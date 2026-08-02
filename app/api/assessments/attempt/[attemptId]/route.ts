import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { checkCertificateEligibility } from '@/lib/services/certificate-eligibility'
import { generateEvaluationFeedback } from '@/lib/services/evaluation-feedback'
import { logger } from '@/lib/utils/logger'

export async function GET(
  _req: Request,
  { params }: { params: { attemptId: string } }
) {
  const route = `/api/assessments/attempt/${params.attemptId}`
  try {
    // F006: Auth guard using shared helper
    const auth = await getAuthenticatedLearner()
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()

    // F003: Strict ownership — learner_id enforced here AND at RLS level
    const { data: attemptRaw } = await supabase
      .from('assessment_attempts')
      .select('*, assessments(assessment_id, course_id, pass_threshold, title, courses(slug, title, cert_price_paise))')
      .eq('attempt_id', params.attemptId)
      .eq('learner_id', auth.learnerId)  // explicit ownership check
      .maybeSingle()

    if (!attemptRaw) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
    }
    const attempt = attemptRaw as any
    const assessment = attempt.assessments as any
    const course = assessment?.courses as any

    // Get questions with correct answers revealed for results page
    const { data: questionsRaw } = await supabase
      .from('assessment_questions')
      .select('question_id, question_number, question_text, explanation, points, sort_order, assessment_options(option_id, option_text, is_correct, explanation, sort_order)')
      .eq('assessment_id', assessment.assessment_id)
      .order('sort_order')
    const questions = (questionsRaw || []) as any[]

    const answeredQuestions = questions.map((q: any) => {
      const answerData = attempt.answers?.[q.question_id] || {}
      const correctOption = (q.assessment_options || []).find((o: any) => o.is_correct)
      const selectedOption = (q.assessment_options || []).find(
        (o: any) => o.option_id === answerData.selected_option_id
      )
      return {
        questionId: q.question_id,
        questionNumber: q.question_number,
        questionText: q.question_text,
        explanation: q.explanation,
        isCorrect: answerData.is_correct || false,
        selectedOptionId: answerData.selected_option_id || null,
        selectedOptionText: selectedOption?.option_text || 'Not answered',
        correctOptionId: correctOption?.option_id,
        correctOptionText: correctOption?.option_text,
        options: (q.assessment_options || [])
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((o: any) => ({
            optionId: o.option_id,
            optionText: o.option_text,
            isCorrect: o.is_correct,
            explanation: o.explanation,
          })),
      }
    })

    const incorrectTopics = answeredQuestions
      .filter((q: any) => !q.isCorrect)
      .map((q: any) => q.questionText.substring(0, 60))

    // F007: Both run in parallel, feedback has internal 6s timeout
    const [feedback, eligibility] = await Promise.all([
      generateEvaluationFeedback({
        courseTitle: course?.title || '',
        score: attempt.score || 0,
        totalQuestions: questions.length,
        passed: attempt.passed || false,
        incorrectTopics,
      }),
      checkCertificateEligibility(auth.learnerId, course?.slug || ''),
    ])

    // F012: Standardised response envelope
    return NextResponse.json({
      data: {
        attempt: {
          attemptId: attempt.attempt_id,
          score: attempt.score,
          passed: attempt.passed,
          pointsEarned: attempt.points_earned,
          pointsTotal: attempt.points_possible,
          attemptNumber: attempt.attempt_number,
          timeTakenSeconds: attempt.time_taken_seconds,
          submittedAt: attempt.submitted_at,
        },
        course: { slug: course?.slug, title: course?.title },
        questions: answeredQuestions,
        feedback,
        eligibility,
      }
    })
  } catch (e: any) {
    await logger.error({
      error_type: 'evaluation_result_error',
      message: e?.message || 'Unknown error',
      stack_trace: e?.stack,
      route,
      severity: 'high',
    })
    return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 })
  }
}
