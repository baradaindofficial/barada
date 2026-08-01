import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: learnerRaw } = await supabase
      .from('learners').select('learner_id').eq('id', user.id).single()
    const learner = learnerRaw as any
    if (!learner) return NextResponse.json({ error: 'Learner not found' }, { status: 404 })

    const body = await req.json()
    const { answers, timeTakenSeconds } = body as {
      answers: Record<string, string>
      timeTakenSeconds: number
    }

    // Get assessment
    const { data: assessmentRaw } = await supabase
      .from('assessments')
      .select('assessment_id, course_id, pass_threshold')
      .eq('assessment_id', params.id)
      .eq('status', 'published')
      .single()
    if (!assessmentRaw) return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 })
    const assessment = assessmentRaw as any

    // Get all questions with correct answers (server-side only)
    const { data: questionsRaw } = await supabase
      .from('assessment_questions')
      .select('question_id, question_text, points, assessment_options(option_id, is_correct)')
      .eq('assessment_id', params.id)
    const questions = (questionsRaw || []) as any[]

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

    // Get attempt number
    const { count: prevAttempts } = await supabase
      .from('assessment_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('assessment_id', params.id)
      .eq('learner_id', learner.learner_id)
    const attemptNumber = (prevAttempts || 0) + 1

    // Save attempt
    const { data: attemptRaw } = await (supabase as any)
      .from('assessment_attempts')
      .insert({
        assessment_id: params.id,
        learner_id: learner.learner_id,
        course_id: assessment.course_id,
        attempt_number: attemptNumber,
        status: 'graded',
        score,
        points_earned: pointsEarned,
        points_possible: pointsPossible,
        passed,
        time_taken_seconds: timeTakenSeconds || 0,
        answers: gradedAnswers,
        submitted_at: new Date().toISOString(),
        graded_at: new Date().toISOString(),
      })
      .select('attempt_id')
      .single()
    const attempt = attemptRaw as any

    return NextResponse.json({
      attemptId: attempt.attempt_id,
      score,
      passed,
      pointsEarned,
      pointsTotal: pointsPossible,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to submit evaluation' }, { status: 500 })
  }
}
