import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkCertificateEligibility } from '@/lib/services/certificate-eligibility'
import { generateEvaluationFeedback } from '@/lib/services/evaluation-feedback'

export async function GET(
  _req: Request,
  { params }: { params: { attemptId: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: learnerRaw } = await supabase
      .from('learners').select('learner_id').eq('id', user.id).single()
    const learner = learnerRaw as any

    // Get attempt
    const { data: attemptRaw } = await supabase
      .from('assessment_attempts')
      .select('*, assessments(assessment_id, course_id, pass_threshold, title, courses(slug, title, cert_price_paise))')
      .eq('attempt_id', params.attemptId)
      .eq('learner_id', learner.learner_id)
      .single()
    if (!attemptRaw) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
    const attempt = attemptRaw as any
    const assessment = attempt.assessments as any
    const course = assessment?.courses as any

    // Get questions with correct answers revealed
    const { data: questionsRaw } = await supabase
      .from('assessment_questions')
      .select('question_id, question_number, question_text, explanation, points, sort_order, assessment_options(option_id, option_text, is_correct, explanation, sort_order)')
      .eq('assessment_id', assessment.assessment_id)
      .order('sort_order')
    const questions = (questionsRaw || []) as any[]

    // Merge attempt answers into question results
    const answeredQuestions = questions.map((q: any) => {
      const answerData = attempt.answers?.[q.question_id] || {}
      const selectedOption = (q.assessment_options || []).find(
        (o: any) => o.option_id === answerData.selected_option_id
      )
      const correctOption = (q.assessment_options || []).find((o: any) => o.is_correct)
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

    // Incorrect topics for AI feedback
    const incorrectTopics = answeredQuestions
      .filter((q: any) => !q.isCorrect)
      .map((q: any) => q.questionText.substring(0, 60))

    // Generate AI feedback and check eligibility in parallel
    const [feedback, eligibility] = await Promise.all([
      generateEvaluationFeedback({
        courseTitle: course?.title || '',
        score: attempt.score || 0,
        totalQuestions: questions.length,
        passed: attempt.passed || false,
        incorrectTopics,
      }),
      checkCertificateEligibility(learner.learner_id, course?.slug || ''),
    ])

    return NextResponse.json({
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
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 })
  }
}
