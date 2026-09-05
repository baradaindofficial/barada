import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { checkCertificateEligibility } from '@/lib/services/certificate-eligibility'
import { generateEvaluationFeedback } from '@/lib/services/evaluation-feedback'
import Logo from '@/components/shared/Logo'

interface Props {
  params: { course: string; attemptId: string }
}

export default async function ResultPage({ params }: Props) {
  // F006: Use shared auth helper
  const auth = await getAuthenticatedLearner()
  if (!auth) redirect('/login')

  const supabase = await createClient()

  // F003: Strict ownership check
  const { data: attemptRaw } = await supabase
    .from('assessment_attempts')
    .select('*, assessments(assessment_id, course_id, pass_threshold, title, courses(slug, title, cert_price_paise))')
    .eq('attempt_id', params.attemptId)
    .eq('learner_id', auth.learnerId)
    .maybeSingle()

  if (!attemptRaw) redirect(`/learn/${params.course}/evaluation`)
  const attempt = attemptRaw as any
  const assessment = attempt.assessments as any
  const course = assessment?.courses as any

  // Verify this attempt belongs to the right course
  if (course?.slug !== params.course) redirect(`/learn/${params.course}/evaluation`)

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
      selectedOptionText: selectedOption?.option_text || 'Not answered',
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

  // F007: Direct service calls — feedback has internal 6s timeout
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

  const correctCount = answeredQuestions.filter((q: any) => q.isCorrect).length
  const scoreColor = attempt.passed ? '#16a34a' : '#D11A1A'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{ background: '#0D183D', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/academy" style={{ lineHeight: 0 }}>
          <Logo variant="academy" height={32} />
        </Link>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', textDecoration: 'none' }}>Dashboard</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Score card */}
        <div style={{ background: 'linear-gradient(135deg, #0D183D, #1a2b5e)', borderRadius: 20, padding: '2.5rem', border: `1.5px solid ${attempt.passed ? 'rgba(22,163,74,0.3)' : 'rgba(227,30,36,0.2)'}`, textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {course?.title} &mdash; Course Evaluation
          </p>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: `rgba(${attempt.passed ? '22,163,74' : '227,30,36'},0.12)`, border: `3px solid ${scoreColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <span style={{ color: scoreColor, fontWeight: 900, fontSize: '2rem', fontFamily: 'Poppins, sans-serif' }}>{attempt.score}%</span>
          </div>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            {attempt.passed ? '\uD83C\uDF89 You Passed!' : 'Not Quite Yet'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {correctCount} of {questions.length} correct &middot; Attempt #{attempt.attempt_number} &middot; {Math.round((attempt.time_taken_seconds || 0) / 60)} min
          </p>

          {/* AI Feedback */}
          {feedback && (
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '1.25rem', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', marginBottom: '1.5rem' }}>
              <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>AI Feedback</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', lineHeight: 1.75 }}>{feedback}</p>
            </div>
          )}

          {/* Certificate eligibility */}
          {attempt.passed && eligibility?.eligible ? (
            <div style={{ background: 'rgba(212,175,55,0.08)', borderRadius: 12, padding: '1.25rem', border: '1.5px solid rgba(212,175,55,0.3)' }}>
              <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Certificate Available</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '1rem' }}>{eligibility.reason}</p>
              <div style={{ background: 'rgba(212,175,55,0.15)', borderRadius: 8, padding: '0.625rem 1.25rem', display: 'inline-block', border: '1px dashed rgba(212,175,55,0.4)' }}>
                <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.78rem' }}>
                  Payment coming in Sprint 5 &mdash; Certificate at &#8377;{Math.round((eligibility.certificatePricePaise || 29900) / 100)}
                </p>
              </div>
            </div>
          ) : !attempt.passed ? (
            <Link href={`/learn/${params.course}/evaluation`} style={{ display: 'inline-block', background: '#D11A1A', color: '#fff', padding: '0.75rem 2rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
              Try Again
            </Link>
          ) : null}
        </div>

        {/* Per-question breakdown */}
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1.125rem', marginBottom: '1.25rem' }}>
          Question Review
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {answeredQuestions.map((q: any) => (
            <div key={q.questionId} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '1.25rem', border: `1.5px solid ${q.isCorrect ? 'rgba(22,163,74,0.25)' : 'rgba(227,30,36,0.2)'}` }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: q.isCorrect ? 'rgba(22,163,74,0.2)' : 'rgba(227,30,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: q.isCorrect ? '#4ade80' : '#f87171' }}>
                  {q.isCorrect ? '✓' : '✗'}
                </span>
                <p style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 }}>{q.questionText}</p>
              </div>
              <div style={{ paddingLeft: '2.25rem' }}>
                {!q.isCorrect && (
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '0.375rem' }}>
                    Your answer: <span style={{ color: '#f87171' }}>{q.selectedOptionText}</span>
                  </p>
                )}
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '0.625rem' }}>
                  Correct answer: <span style={{ color: '#4ade80' }}>{q.correctOptionText}</span>
                </p>
                {q.explanation && (
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontStyle: 'italic', lineHeight: 1.6 }}>{q.explanation}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href={`/learn/${params.course}/module-1/lesson-1`} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            Review Course
          </Link>
          <Link href="/academy" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            Browse Courses
          </Link>
          {!attempt.passed && (
            <Link href={`/learn/${params.course}/evaluation`} style={{ background: '#D11A1A', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
              Retake Evaluation
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
