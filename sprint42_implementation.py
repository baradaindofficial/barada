#!/usr/bin/env python3
"""
Sprint 4.2 — Evaluation Engine
Services, API routes, and UI pages
Run from: C:\\Users\\dell\\barada-nextjs
"""
import os

BASE = r'C:\Users\dell\barada-nextjs'

def w(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Created: {rel}')

# ── lib/services/certificate-eligibility.ts ───────────────────────
w('lib/services/certificate-eligibility.ts', r"""import { createClient } from '@/lib/supabase/server'

export interface EligibilityResult {
  eligible: boolean
  evaluationPassed: boolean
  bestScore: number
  attemptsCount: number
  enrolled: boolean
  paymentRequired: boolean
  certificatePricePaise: number
  reason: string
}

export async function checkCertificateEligibility(
  learnerId: string,
  courseSlug: string
): Promise<EligibilityResult> {
  const supabase = await createClient()

  // Check enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('enrollment_id')
    .eq('learner_id', learnerId)
    .eq('course_slug', courseSlug)
    .maybeSingle()

  if (!enrollment) {
    return {
      eligible: false,
      evaluationPassed: false,
      bestScore: 0,
      attemptsCount: 0,
      enrolled: false,
      paymentRequired: true,
      certificatePricePaise: 29900,
      reason: 'You must be enrolled in this course to earn a certificate.',
    }
  }

  // Get course assessment
  const { data: course } = await supabase
    .from('courses')
    .select('course_id, cert_price_paise')
    .eq('slug', courseSlug)
    .single()
  const c = course as any

  const { data: assessment } = await supabase
    .from('assessments')
    .select('assessment_id, pass_threshold')
    .eq('course_id', c?.course_id)
    .eq('assessment_type', 'final_exam')
    .eq('status', 'published')
    .maybeSingle()
  const a = assessment as any

  if (!a) {
    return {
      eligible: false,
      evaluationPassed: false,
      bestScore: 0,
      attemptsCount: 0,
      enrolled: true,
      paymentRequired: true,
      certificatePricePaise: c?.cert_price_paise || 29900,
      reason: 'No evaluation available for this course yet.',
    }
  }

  // Get all attempts for this learner and assessment
  const { data: attempts } = await supabase
    .from('assessment_attempts')
    .select('score, passed, attempt_number')
    .eq('learner_id', learnerId)
    .eq('assessment_id', a.assessment_id)
    .eq('status', 'graded')
    .order('score', { ascending: false })

  const att = (attempts || []) as any[]
  const bestScore = att.length > 0 ? att[0].score : 0
  const evaluationPassed = att.some((attempt: any) => attempt.passed === true)
  const attemptsCount = att.length

  if (!evaluationPassed) {
    return {
      eligible: false,
      evaluationPassed: false,
      bestScore,
      attemptsCount,
      enrolled: true,
      paymentRequired: true,
      certificatePricePaise: c?.cert_price_paise || 29900,
      reason: attemptsCount === 0
        ? 'Complete the course evaluation to earn your certificate.'
        : `Your best score is ${bestScore}%. You need ${a.pass_threshold}% to pass. Try again.`,
    }
  }

  return {
    eligible: true,
    evaluationPassed: true,
    bestScore,
    attemptsCount,
    enrolled: true,
    paymentRequired: true,
    certificatePricePaise: c?.cert_price_paise || 29900,
    reason: `You passed with ${bestScore}%. Your certificate is ready for \u20b9${Math.round((c?.cert_price_paise || 29900) / 100)}.`,
  }
}
""")

# ── lib/services/evaluation-feedback.ts ──────────────────────────
w('lib/services/evaluation-feedback.ts', r"""export interface FeedbackInput {
  courseTitle: string
  score: number
  totalQuestions: number
  passed: boolean
  incorrectTopics: string[]
}

export async function generateEvaluationFeedback(
  input: FeedbackInput
): Promise<string> {
  try {
    const { courseTitle, score, totalQuestions, passed, incorrectTopics } = input
    const correct = Math.round((score / 100) * totalQuestions)

    const prompt = passed
      ? `A professional learner just completed the "${courseTitle}" course evaluation and scored ${score}% (${correct} of ${totalQuestions} correct). They passed. Write 2-3 sentences of warm, specific, motivating feedback acknowledging their achievement and encouraging them to apply what they learned. Be direct and professional.`
      : `A professional learner just completed the "${courseTitle}" course evaluation and scored ${score}% (${correct} of ${totalQuestions} correct). They needed 60% to pass. ${incorrectTopics.length > 0 ? `They struggled with: ${incorrectTopics.join(', ')}.` : ''} Write 2-3 sentences of encouraging, constructive feedback acknowledging their effort, noting where to focus when they retake it, and motivating them to try again. Be warm but honest.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) throw new Error('API error')
    const data = await response.json()
    const text = data?.content?.[0]?.text || ''
    return text.trim()
  } catch {
    // Fallback feedback if API fails
    return input.passed
      ? `Well done on passing the ${input.courseTitle} evaluation with ${input.score}%! Your performance shows a solid grasp of the material. Apply these skills in your work and revisit the course content whenever you need a refresher.`
      : `You scored ${input.score}% on the ${input.courseTitle} evaluation — a solid start. Review the lessons covering the topics you found challenging and retake the evaluation when you are ready. You have unlimited attempts.`
  }
}
""")

# ── app/api/assessments/course/[slug]/route.ts ────────────────────
w('app/api/assessments/course/[slug]/route.ts', r"""import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
      .select('assessment_id, title, assessment_type, pass_threshold, max_attempts, time_limit_seconds, randomise_questions, randomise_options')
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
    const sanitized = qs.map((q: any) => ({
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

    return NextResponse.json({
      evaluation: {
        assessmentId: a.assessment_id,
        title: a.title,
        evaluationType: a.assessment_type,
        totalQuestions: qs.length,
        passThreshold: a.pass_threshold,
        timeLimit: a.time_limit_seconds,
      },
      questions: sanitized,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load evaluation' }, { status: 500 })
  }
}
""")

# ── app/api/assessments/[id]/attempt/route.ts ─────────────────────
w('app/api/assessments/[id]/attempt/route.ts', r"""import { NextResponse } from 'next/server'
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
    const { data: attemptRaw } = await supabase
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
""")

# ── app/api/assessments/attempt/[attemptId]/route.ts ──────────────
w('app/api/assessments/attempt/[attemptId]/route.ts', r"""import { NextResponse } from 'next/server'
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
""")

# ── app/learn/[course]/evaluation/page.tsx ────────────────────────
w('app/learn/[course]/evaluation/page.tsx', r"""'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'

interface Option { optionId: string; optionText: string }
interface Question {
  questionId: string
  questionNumber: number
  questionText: string
  hint: string | null
  options: Option[]
}
interface Evaluation {
  assessmentId: string
  title: string
  totalQuestions: number
  passThreshold: number
}

export default function EvaluationPage() {
  const params = useParams() as { course: string }
  const router = useRouter()
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const startTime = useRef<number>(Date.now())

  useEffect(() => {
    fetch(`/api/assessments/course/${params.course}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); setLoading(false); return }
        setEvaluation(data.evaluation)
        setQuestions(data.questions)
        setLoading(false)
        startTime.current = Date.now()
      })
      .catch(() => { setError('Failed to load evaluation'); setLoading(false) })
  }, [params.course])

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const submit = async () => {
    if (!evaluation) return
    setSubmitting(true)
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000)
    const res = await fetch(`/api/assessments/${evaluation.assessmentId}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, timeTakenSeconds: timeTaken }),
    })
    const data = await res.json()
    if (data.error) { setError(data.error); setSubmitting(false); return }
    router.push(`/learn/${params.course}/evaluation/result/${data.attemptId}`)
  }

  const q = questions[current]
  const answered = q ? !!answers[q.questionId] : false
  const allAnswered = questions.every(q => !!answers[q.questionId])
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>Loading evaluation...</p>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: '#E31E24', fontFamily: 'Inter, sans-serif' }}>{error}</p>
      <Link href={`/learn/${params.course}/module-1/lesson-1`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textDecoration: 'none' }}>Back to Course</Link>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Nav */}
      <nav style={{ background: '#0D183D', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/academy" style={{ lineHeight: 0 }}>
          <Logo variant="academy" height={32} />
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Course Evaluation</span>
      </nav>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#E31E24', transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Question {current + 1} of {questions.length}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
            Pass score: {evaluation?.passThreshold}% &middot; Unlimited attempts
          </p>
        </div>

        {/* Question */}
        {q && (
          <div>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: '#fff', fontSize: 'clamp(1.1rem, 2.5vw, 1.375rem)', lineHeight: 1.5, marginBottom: '2rem' }}>
              {q.questionText}
            </h2>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {q.options.map((opt, i) => {
                const isSelected = answers[q.questionId] === opt.optionId
                return (
                  <button
                    key={opt.optionId}
                    onClick={() => selectAnswer(q.questionId, opt.optionId)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem 1.25rem', borderRadius: 12, cursor: 'pointer',
                      background: isSelected ? 'rgba(227,30,36,0.12)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '2px solid #E31E24' : '1.5px solid rgba(255,255,255,0.08)',
                      textAlign: 'left', transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: isSelected ? '#E31E24' : 'rgba(255,255,255,0.06)',
                      border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isSelected ? '#fff' : 'rgba(255,255,255,0.4)',
                      fontWeight: 700, fontSize: '0.72rem',
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.5, fontWeight: isSelected ? 600 : 400 }}>
                      {opt.optionText}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Hint */}
            {q.hint && (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                Hint: {q.hint}
              </p>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setCurrent(c => Math.max(0, c - 1))}
                disabled={current === 0}
                style={{ padding: '0.75rem 1.5rem', borderRadius: 10, background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', cursor: current === 0 ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 600, opacity: current === 0 ? 0.4 : 1 }}
              >
                &larr; Previous
              </button>

              {current < questions.length - 1 ? (
                <button
                  onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
                  disabled={!answered}
                  style={{ padding: '0.75rem 1.75rem', borderRadius: 10, background: answered ? '#E31E24' : 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', cursor: answered ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: 700, opacity: answered ? 1 : 0.5 }}
                >
                  Next &rarr;
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={!allAnswered || submitting}
                  style={{ padding: '0.75rem 2rem', borderRadius: 10, background: allAnswered ? '#D4AF37' : 'rgba(255,255,255,0.06)', border: 'none', color: allAnswered ? '#0D183D' : 'rgba(255,255,255,0.3)', cursor: allAnswered ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: 700 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Evaluation'}
                </button>
              )}
            </div>

            {/* Answer tracker */}
            <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center', marginTop: '2rem' }}>
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: 28, height: 4, borderRadius: 2, border: 'none', cursor: 'pointer',
                    background: i === current ? '#E31E24' : answers[questions[i].questionId] ? 'rgba(212,175,55,0.6)' : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
""")

# ── app/learn/[course]/evaluation/result/[attemptId]/page.tsx ─────
w('app/learn/[course]/evaluation/result/[attemptId]/page.tsx', r"""import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Logo from '@/components/shared/Logo'

interface Props {
  params: { course: string; attemptId: string }
}

export default async function ResultPage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/assessments/attempt/${params.attemptId}`,
    { headers: { Cookie: `sb-access-token=${(await supabase.auth.getSession()).data.session?.access_token}` }, cache: 'no-store' }
  )

  if (!res.ok) redirect(`/learn/${params.course}/evaluation`)
  const data = await res.json()
  const { attempt, course, questions, feedback, eligibility } = data

  const scoreColor = attempt.passed ? '#16a34a' : '#E31E24'
  const correctCount = questions.filter((q: any) => q.isCorrect).length

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
            {attempt.passed ? '🎉 You Passed!' : 'Not Quite Yet'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {correctCount} of {questions.length} correct &middot; Attempt #{attempt.attemptNumber} &middot; {Math.round((attempt.timeTakenSeconds || 0) / 60)} min
          </p>

          {/* AI Feedback */}
          {feedback && (
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '1.25rem', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', marginBottom: '1.5rem' }}>
              <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>AI Feedback</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', lineHeight: 1.75 }}>{feedback}</p>
            </div>
          )}

          {/* Certificate eligibility CTA */}
          {attempt.passed && eligibility?.eligible ? (
            <div style={{ background: 'rgba(212,175,55,0.08)', borderRadius: 12, padding: '1.25rem', border: '1.5px solid rgba(212,175,55,0.3)' }}>
              <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Certificate Available</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                {eligibility.reason}
              </p>
              <div style={{ background: 'rgba(212,175,55,0.15)', borderRadius: 8, padding: '0.625rem 1.25rem', display: 'inline-block', border: '1px dashed rgba(212,175,55,0.4)' }}>
                <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.78rem' }}>
                  Payment coming in Sprint 5 &mdash; Certificate at &#8377;{Math.round((eligibility.certificatePricePaise || 29900) / 100)}
                </p>
              </div>
            </div>
          ) : !attempt.passed ? (
            <Link href={`/learn/${params.course}/evaluation`} style={{ display: 'inline-block', background: '#E31E24', color: '#fff', padding: '0.75rem 2rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
              Try Again
            </Link>
          ) : null}
        </div>

        {/* Per-question breakdown */}
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1.125rem', marginBottom: '1.25rem' }}>
          Question Review
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {(questions as any[]).map((q: any, i: number) => (
            <div key={q.questionId} style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '1.25rem',
              border: `1.5px solid ${q.isCorrect ? 'rgba(22,163,74,0.25)' : 'rgba(227,30,36,0.2)'}`,
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: q.isCorrect ? 'rgba(22,163,74,0.2)' : 'rgba(227,30,36,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', color: q.isCorrect ? '#4ade80' : '#f87171',
                }}>
                  {q.isCorrect ? '✓' : '✗'}
                </span>
                <p style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 }}>
                  {q.questionText}
                </p>
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
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontStyle: 'italic', lineHeight: 1.6 }}>
                    {q.explanation}
                  </p>
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
            <Link href={`/learn/${params.course}/evaluation`} style={{ background: '#E31E24', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
              Retake Evaluation
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
""")

print('\nSprint 4.2 implementation complete.')
print('Files created:')
print('  lib/services/certificate-eligibility.ts')
print('  lib/services/evaluation-feedback.ts')
print('  app/api/assessments/course/[slug]/route.ts')
print('  app/api/assessments/[id]/attempt/route.ts')
print('  app/api/assessments/attempt/[attemptId]/route.ts')
print('  app/learn/[course]/evaluation/page.tsx')
print('  app/learn/[course]/evaluation/result/[attemptId]/page.tsx')
print('\nNext: npm run type-check')
