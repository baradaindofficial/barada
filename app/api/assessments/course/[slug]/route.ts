import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'

// Fisher-Yates partial shuffle: pick `n` unique items from `arr` without bias.
function pickRandom<T>(arr: T[], n: number): T[] {
  const pool = [...arr]
  const picked: T[] = []
  const count = Math.min(n, pool.length)
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(idx, 1)[0])
  }
  return picked
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient()

    const { data: course } = await supabase
      .from('courses')
      .select('course_id, title')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single()
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    const c = course as any

    const { data: assessment } = await supabase
      .from('assessments')
      .select('assessment_id, title, assessment_type, pass_threshold, max_attempts, time_limit_seconds, randomise_questions, randomise_options, questions_per_attempt')
      .eq('course_id', c.course_id)
      .eq('assessment_type', 'final_exam')
      .eq('status', 'published')
      .maybeSingle()
    if (!assessment) return NextResponse.json({ error: 'No evaluation found' }, { status: 404 })
    const a = assessment as any

    const { data: questions } = await supabase
      .from('assessment_questions')
      .select('question_id, question_number, question_type, question_text, hint, points, sort_order, assessment_options(option_id, option_text, sort_order)')
      .eq('assessment_id', a.assessment_id)
      .order('sort_order')
    const qs = (questions || []) as any[]

    // Never expose is_correct to client
    const sanitize = (list: any[]) => list.map((q: any) => ({
      questionId: q.question_id,
      questionNumber: q.question_number,
      questionType: q.question_type,
      questionText: q.question_text,
      hint: q.hint,
      points: q.points,
      options: (q.assessment_options || [])
        .sort((x: any, y: any) => x.sort_order - y.sort_order)
        .map((o: any) => ({ optionId: o.option_id, optionText: o.option_text })),
    }))

    // Server-authoritative sampling: only kicks in when explicitly configured
    // (questions_per_attempt set and smaller than the bank). Any assessment
    // seeded before migration 011, or with this left NULL, keeps the exact
    // original full-bank, no-auth-required response below unchanged.
    const useSampling =
      typeof a.questions_per_attempt === 'number' &&
      a.questions_per_attempt > 0 &&
      a.questions_per_attempt < qs.length

    if (!useSampling) {
      return NextResponse.json({
        evaluation: {
          assessmentId: a.assessment_id,
          title: a.title,
          evaluationType: a.assessment_type,
          totalQuestions: qs.length,
          passThreshold: a.pass_threshold,
          timeLimit: a.time_limit_seconds,
        },
        questions: sanitize(qs),
      })
    }

    // Sampled path requires a known learner: the selected question set is
    // persisted against their attempt row.
    const auth = await getAuthenticatedLearner()
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const respondWith = (attemptId: string, selectedQuestions: any[]) =>
      NextResponse.json({
        evaluation: {
          assessmentId: a.assessment_id,
          title: a.title,
          evaluationType: a.assessment_type,
          totalQuestions: selectedQuestions.length,
          passThreshold: a.pass_threshold,
          timeLimit: a.time_limit_seconds,
        },
        attemptId,
        questions: sanitize(selectedQuestions),
      })

    // Resume an already-started, not-yet-graded attempt instead of starting a
    // new one. Without this, reloading the evaluation page (or two tabs, or
    // React re-running an effect) would call this GET again and spawn another
    // in_progress row with a freshly re-randomized set every time — the
    // question set for an attempt must stay stable across page loads, and a
    // learner should never accumulate untracked abandoned attempts.
    const { data: resumableRaw } = await supabase
      .from('assessment_attempts')
      .select('attempt_id, selected_question_ids')
      .eq('assessment_id', a.assessment_id)
      .eq('learner_id', auth.learnerId)
      .eq('status', 'in_progress')
      .order('attempted_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (resumableRaw) {
      const resumable = resumableRaw as any
      const idOrder = (resumable.selected_question_ids || []) as string[]
      const byId = new Map(qs.map((q: any) => [q.question_id, q]))
      const resumedQuestions = idOrder.map((id) => byId.get(id)).filter(Boolean) as any[]

      // Only resume if every persisted question ID still resolves to a live
      // question in this bank. If content changed underneath an abandoned
      // attempt, fall through and start a clean one instead of serving a
      // partial/stale set.
      if (resumedQuestions.length === idOrder.length && resumedQuestions.length > 0) {
        return respondWith(resumable.attempt_id, resumedQuestions)
      }
    }

    if (a.max_attempts !== null) {
      const { count: prevAttempts } = await supabase
        .from('assessment_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('assessment_id', a.assessment_id)
        .eq('learner_id', auth.learnerId)
      if ((prevAttempts || 0) >= a.max_attempts) {
        return NextResponse.json({
          error: `Maximum attempts (${a.max_attempts}) reached for this evaluation.`
        }, { status: 429 })
      }
    }

    const { count: priorForNumbering } = await supabase
      .from('assessment_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('assessment_id', a.assessment_id)
      .eq('learner_id', auth.learnerId)
    const attemptNumber = (priorForNumbering || 0) + 1

    const selected = pickRandom(qs, a.questions_per_attempt)
    const selectedIds = selected.map((q: any) => q.question_id)

    const { data: attemptRaw, error: insertError } = await (supabase as any)
      .from('assessment_attempts')
      .insert({
        assessment_id: a.assessment_id,
        learner_id: auth.learnerId,
        course_id: c.course_id,
        attempt_number: attemptNumber,
        status: 'in_progress',
        selected_question_ids: selectedIds,
      })
      .select('attempt_id')
      .single()

    if (insertError || !attemptRaw) {
      // 23505 = unique_violation on the partial index that allows at most one
      // in_progress attempt per (assessment_id, learner_id). This means a
      // concurrent request just created the resumable attempt we didn't see
      // above — re-fetch it rather than erroring or duplicating.
      if (insertError?.code === '23505') {
        const { data: raceRaw } = await supabase
          .from('assessment_attempts')
          .select('attempt_id, selected_question_ids')
          .eq('assessment_id', a.assessment_id)
          .eq('learner_id', auth.learnerId)
          .eq('status', 'in_progress')
          .maybeSingle()
        if (raceRaw) {
          const race = raceRaw as any
          const idOrder = (race.selected_question_ids || []) as string[]
          const byId = new Map(qs.map((q: any) => [q.question_id, q]))
          const resumedQuestions = idOrder.map((id) => byId.get(id)).filter(Boolean) as any[]
          if (resumedQuestions.length === idOrder.length && resumedQuestions.length > 0) {
            return respondWith(race.attempt_id, resumedQuestions)
          }
        }
      }
      return NextResponse.json({ error: 'Failed to start evaluation attempt' }, { status: 500 })
    }
    const attempt = attemptRaw as any

    return respondWith(attempt.attempt_id, selected)
  } catch {
    return NextResponse.json({ error: 'Failed to load evaluation' }, { status: 500 })
  }
}
