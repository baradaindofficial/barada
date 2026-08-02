import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { logger } from '@/lib/utils/logger'

function isValidUUID(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const route = `/api/assessments/${params.id}/attempt`
  try {
    // F006: Auth guard
    const auth = await getAuthenticatedLearner()
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // F004: Parse and validate body
    let body: any
    try { body = await req.json() }
    catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }) }

    const { answers, timeTakenSeconds } = body
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return NextResponse.json({ error: 'answers must be an object' }, { status: 400 })
    }

    // Validate all answer values are UUIDs
    for (const [qId, oId] of Object.entries(answers)) {
      if (!isValidUUID(qId) || !isValidUUID(oId as string)) {
        return NextResponse.json({ error: 'Invalid answer format' }, { status: 400 })
      }
    }

    const supabase = await createClient()

    // Get assessment + verify it exists and is published
    const { data: assessmentRaw } = await supabase
      .from('assessments')
      .select('assessment_id, course_id, pass_threshold, max_attempts')
      .eq('assessment_id', params.id)
      .eq('status', 'published')
      .maybeSingle()
    if (!assessmentRaw) {
      return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 })
    }
    const assessment = assessmentRaw as any

    // F005: Enforce max_attempts if set
    const { count: prevAttempts } = await supabase
      .from('assessment_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('assessment_id', params.id)
      .eq('learner_id', auth.learnerId)

    const attemptNumber = (prevAttempts || 0) + 1

    if (assessment.max_attempts !== null && (prevAttempts || 0) >= assessment.max_attempts) {
      return NextResponse.json({
        error: `Maximum attempts (${assessment.max_attempts}) reached for this evaluation.`
      }, { status: 429 })
    }

    // Get all questions with correct answers — server-side only, never sent to client
    const { data: questionsRaw } = await supabase
      .from('assessment_questions')
      .select('question_id, question_text, points, assessment_options(option_id, is_correct)')
      .eq('assessment_id', params.id)
    const questions = (questionsRaw || []) as any[]

    // F004: Validate that all questions are answered
    const questionIds = new Set(questions.map((q: any) => q.question_id))
    const answeredIds = new Set(Object.keys(answers))
    const missing = Array.from(questionIds).filter(id => !answeredIds.has(id))
    if (missing.length > 0) {
      return NextResponse.json({
        error: `Missing answers for ${missing.length} question(s). All questions must be answered.`
      }, { status: 400 })
    }

    // Grade answers
    let pointsEarned = 0
    let pointsPossible = 0
    const gradedAnswers: Record<string, any> = {}

    for (const q of questions) {
      pointsPossible += q.points
      const selectedOptionId = answers[q.question_id]
      const correctOption = (q.assessment_options || []).find((o: any) => o.is_correct)
      const isCorrect = selectedOptionId === correctOption?.option_id
      if (isCorrect) pointsEarned += q.points
      gradedAnswers[q.question_id] = {
        selected_option_id: selectedOptionId || null,
        is_correct: isCorrect,
        question_text: q.question_text,
      }
    }

    const score = pointsPossible > 0 ? Math.round((pointsEarned / pointsPossible) * 100) : 0
    const passed = score >= assessment.pass_threshold

    // Save attempt
    const { data: attemptRaw } = await (supabase as any)
      .from('assessment_attempts')
      .insert({
        assessment_id: params.id,
        learner_id: auth.learnerId,
        course_id: assessment.course_id,
        attempt_number: attemptNumber,
        status: 'graded',
        score,
        points_earned: pointsEarned,
        points_possible: pointsPossible,
        passed,
        time_taken_seconds: typeof timeTakenSeconds === 'number' ? timeTakenSeconds : 0,
        answers: gradedAnswers,
        submitted_at: new Date().toISOString(),
        graded_at: new Date().toISOString(),
      })
      .select('attempt_id')
      .single()
    const attempt = attemptRaw as any

    // F009: Log events
    await logger.event({
      event_type: 'academy.evaluation.completed',
      actor_id: auth.learnerId,
      entity_type: 'assessment',
      entity_id: params.id,
      payload: { score, passed, attempt_number: attemptNumber },
    })

    if (passed) {
      await logger.event({
        event_type: 'academy.evaluation.passed',
        actor_id: auth.learnerId,
        entity_type: 'assessment',
        entity_id: params.id,
        payload: { score, attempt_number: attemptNumber },
      })
    }

    return NextResponse.json({
      data: {
        attemptId: attempt.attempt_id,
        score,
        passed,
        pointsEarned,
        pointsTotal: pointsPossible,
        attemptNumber,
      }
    })
  } catch (e: any) {
    // F010: Log error
    await logger.error({
      error_type: 'evaluation_attempt_error',
      message: e?.message || 'Unknown error',
      stack_trace: e?.stack,
      route,
      severity: 'high',
    })
    return NextResponse.json({ error: 'Failed to submit evaluation' }, { status: 500 })
  }
}
