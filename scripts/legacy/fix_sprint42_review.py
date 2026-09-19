#!/usr/bin/env python3
"""
Sprint 4.2 Engineering Review — Fixes
F001: Result page — remove fragile self-fetch, call services directly
F002: Evaluation player — add server-side enrollment wrapper
F004: Attempt route — add input validation
F005: Max attempts enforcement
F006: Learner null guard
F007: Anthropic timeout
F008: Shared learner helper
F009: Event logging on completion
F010: Error logging to platform
F012: API response envelope
F013: Logger utility
"""
import os

BASE = r'C:\Users\dell\barada-nextjs'

def w(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Fixed: {rel}')

# ── F008 + F013: Shared helpers ───────────────────────────────────

w('lib/auth/get-authenticated-learner.ts', r"""import { createClient } from '@/lib/supabase/server'

export interface AuthenticatedLearner {
  userId: string
  learnerId: string
}

/**
 * Returns the authenticated user and their learner record.
 * Returns null if unauthenticated or learner row not found.
 * Use this in every API route that requires a logged-in learner.
 */
export async function getAuthenticatedLearner(): Promise<AuthenticatedLearner | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('learners')
    .select('learner_id')
    .eq('id', user.id)
    .maybeSingle()

  if (!data) return null
  return { userId: user.id, learnerId: (data as any).learner_id }
}
""")

w('lib/utils/logger.ts', r"""import { createClient } from '@/lib/supabase/server'

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'
type Severity  = 'low' | 'medium' | 'high' | 'critical'

interface LogPayload {
  app_id?: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  route?: string
  user_id?: string
}

interface ErrorPayload {
  app_id?: string
  error_type: string
  error_code?: string
  message: string
  stack_trace?: string
  context?: Record<string, unknown>
  route?: string
  user_id?: string
  severity?: Severity
}

interface EventPayload {
  event_type: string
  app_id?: string
  actor_id?: string
  actor_type?: 'learner' | 'admin' | 'system' | 'ai_factory'
  entity_type?: string
  entity_id?: string
  payload?: Record<string, unknown>
}

/**
 * Platform logger — writes to platform.logs, platform.error_events, platform.events.
 * All methods are fire-and-forget (never throw).
 */
export const logger = {
  async log(payload: LogPayload): Promise<void> {
    try {
      const supabase = await createClient()
      await (supabase as any).from('platform.logs').insert({
        app_id: payload.app_id || 'academy',
        level: payload.level,
        message: payload.message,
        context: payload.context || {},
        route: payload.route,
        user_id: payload.user_id,
        logged_at: new Date().toISOString(),
      })
    } catch { /* never throw from logger */ }
  },

  async error(payload: ErrorPayload): Promise<void> {
    // Always console.error as well for Vercel logs
    console.error(`[${payload.error_type}] ${payload.message}`, payload.context)
    try {
      const supabase = await createClient()
      await (supabase as any).schema('platform').from('error_events').insert({
        app_id: payload.app_id || 'academy',
        error_type: payload.error_type,
        error_code: payload.error_code,
        message: payload.message,
        stack_trace: payload.stack_trace,
        context: payload.context || {},
        route: payload.route,
        user_id: payload.user_id,
        severity: payload.severity || 'error',
        occurred_at: new Date().toISOString(),
      })
    } catch { /* never throw from logger */ }
  },

  async event(payload: EventPayload): Promise<void> {
    try {
      const supabase = await createClient()
      await (supabase as any).schema('platform').from('events').insert({
        event_type: payload.event_type,
        app_id: payload.app_id || 'academy',
        actor_id: payload.actor_id,
        actor_type: payload.actor_type || 'learner',
        entity_type: payload.entity_type,
        entity_id: payload.entity_id,
        payload: payload.payload || {},
        published_at: new Date().toISOString(),
      })
    } catch { /* never throw from logger */ }
  },
}
""")

# ── F007: Evaluation feedback with strict timeout ─────────────────
w('lib/services/evaluation-feedback.ts', r"""export interface FeedbackInput {
  courseTitle: string
  score: number
  totalQuestions: number
  passed: boolean
  incorrectTopics: string[]
}

const FALLBACK_PASS = (title: string, score: number) =>
  `Well done on passing the ${title} evaluation with ${score}%. Your performance shows a solid grasp of the material. Apply these skills in your work and revisit the course content whenever you need a refresher.`

const FALLBACK_FAIL = (title: string, score: number) =>
  `You scored ${score}% on the ${title} evaluation — a solid attempt. Review the lessons covering the topics you found challenging and retake the evaluation when you feel ready. You have unlimited attempts.`

/**
 * Generates AI personalised feedback for an evaluation result.
 * Enforces a 6-second timeout. Always returns a string — never throws.
 */
export async function generateEvaluationFeedback(
  input: FeedbackInput
): Promise<string> {
  const { courseTitle, score, totalQuestions, passed, incorrectTopics } = input
  const correct = Math.round((score / 100) * totalQuestions)

  const prompt = passed
    ? `A professional just completed the "${courseTitle}" course evaluation and scored ${score}% (${correct} of ${totalQuestions} correct). They passed. Write 2-3 sentences of warm, specific, motivating feedback. Be direct and professional. No preamble.`
    : `A professional just completed the "${courseTitle}" course evaluation and scored ${score}% (${correct} of ${totalQuestions} correct). They needed 60% to pass.${incorrectTopics.length > 0 ? ` They struggled with: ${incorrectTopics.slice(0, 3).join(', ')}.` : ''} Write 2-3 sentences of encouraging, constructive feedback noting where to focus. Be warm but honest. No preamble.`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    clearTimeout(timeoutId)
    if (!response.ok) throw new Error(`API ${response.status}`)
    const data = await response.json()
    const text = data?.content?.[0]?.text?.trim() || ''
    return text || (passed ? FALLBACK_PASS(courseTitle, score) : FALLBACK_FAIL(courseTitle, score))
  } catch {
    return passed ? FALLBACK_PASS(courseTitle, score) : FALLBACK_FAIL(courseTitle, score)
  }
}
""")

# ── F004 + F005 + F006 + F009 + F010: Fixed attempt route ─────────
w('app/api/assessments/[id]/attempt/route.ts', r"""import { NextResponse } from 'next/server'
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
    const missing = [...questionIds].filter(id => !answeredIds.has(id))
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
""")

# ── F001 + F006 + F010: Fixed result route ───────────────────────
w('app/api/assessments/attempt/[attemptId]/route.ts', r"""import { NextResponse } from 'next/server'
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
""")

# ── F001: Result page — direct service calls, no self-fetch ───────
w('app/learn/[course]/evaluation/result/[attemptId]/page.tsx', r"""import { redirect } from 'next/navigation'
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
  const scoreColor = attempt.passed ? '#16a34a' : '#E31E24'

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

# ── F002: Evaluation player — server wrapper for enrollment check ─
w('app/learn/[course]/evaluation/layout.tsx', r"""import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface Props {
  children: React.ReactNode
  params: { course: string }
}

/**
 * F002: Server-side enrollment guard for evaluation pages.
 * Unenrolled learners are redirected to the academy page.
 */
export default async function EvaluationLayout({ children, params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('enrollment_id')
    .eq('course_slug', params.course)
    .eq('learner_id', user.id)
    .maybeSingle()

  if (!enrollment) redirect(`/academy`)

  return <>{children}</>
}
""")

# ── Updated attempt submission in evaluation player ───────────────
# Fix: update player to handle new { data: { attemptId } } envelope
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
    try {
      const res = await fetch(`/api/assessments/${evaluation.assessmentId}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, timeTakenSeconds: timeTaken }),
      })
      const json = await res.json()
      // F012: Handle new { data: { attemptId } } envelope
      const attemptId = json.data?.attemptId || json.attemptId
      if (json.error || !attemptId) {
        setError(json.error || 'Submission failed. Please try again.')
        setSubmitting(false)
        return
      }
      router.push(`/learn/${params.course}/evaluation/result/${attemptId}`)
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
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
      <nav style={{ background: '#0D183D', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/academy" style={{ lineHeight: 0 }}>
          <Logo variant="academy" height={32} />
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Course Evaluation</span>
      </nav>

      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#E31E24', transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Question {current + 1} of {questions.length}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
            Pass score: {evaluation?.passThreshold}% &middot; Unlimited attempts
          </p>
        </div>

        {q && (
          <div>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: '#fff', fontSize: 'clamp(1.1rem,2.5vw,1.375rem)', lineHeight: 1.5, marginBottom: '2rem' }}>
              {q.questionText}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {q.options.map((opt, i) => {
                const isSelected = answers[q.questionId] === opt.optionId
                return (
                  <button key={opt.optionId} onClick={() => selectAnswer(q.questionId, opt.optionId)}
                    aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt.optionText}`}
                    aria-pressed={isSelected}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: 12, cursor: 'pointer', background: isSelected ? 'rgba(227,30,36,0.12)' : 'rgba(255,255,255,0.03)', border: isSelected ? '2px solid #E31E24' : '1.5px solid rgba(255,255,255,0.08)', textAlign: 'left', transition: 'all 0.15s ease' }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: isSelected ? '#E31E24' : 'rgba(255,255,255,0.06)', border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.72rem' }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.5, fontWeight: isSelected ? 600 : 400 }}>
                      {opt.optionText}
                    </span>
                  </button>
                )
              })}
            </div>

            {q.hint && (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                Hint: {q.hint}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
                aria-label="Previous question"
                style={{ padding: '0.75rem 1.5rem', borderRadius: 10, background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', cursor: current === 0 ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 600, opacity: current === 0 ? 0.4 : 1 }}>
                &larr; Previous
              </button>

              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))} disabled={!answered}
                  aria-label="Next question"
                  style={{ padding: '0.75rem 1.75rem', borderRadius: 10, background: answered ? '#E31E24' : 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', cursor: answered ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: 700, opacity: answered ? 1 : 0.5 }}>
                  Next &rarr;
                </button>
              ) : (
                <button onClick={submit} disabled={!allAnswered || submitting}
                  aria-label="Submit evaluation"
                  style={{ padding: '0.75rem 2rem', borderRadius: 10, background: allAnswered ? '#D4AF37' : 'rgba(255,255,255,0.06)', border: 'none', color: allAnswered ? '#0D183D' : 'rgba(255,255,255,0.3)', cursor: allAnswered ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: 700 }}>
                  {submitting ? 'Submitting...' : 'Submit Evaluation'}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center', marginTop: '2rem' }} role="tablist" aria-label="Question progress">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  role="tab" aria-selected={i === current} aria-label={`Go to question ${i + 1}`}
                  style={{ width: 28, height: 4, borderRadius: 2, border: 'none', cursor: 'pointer', background: i === current ? '#E31E24' : answers[questions[i].questionId] ? 'rgba(212,175,55,0.6)' : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
""")

print('\nAll Sprint 4.2 engineering review fixes applied.')
print('\nFixed issues:')
print('  F001: Result page — direct service calls, no self-fetch')
print('  F002: Evaluation layout — server-side enrollment guard')
print('  F003: Strict ownership check on attempt result')
print('  F004: Input validation on attempt submission')
print('  F005: Max attempts enforcement')
print('  F006: Shared auth helper (lib/auth/get-authenticated-learner.ts)')
print('  F007: Anthropic 6s timeout with fallback')
print('  F008: Shared learner helper reduces duplication')
print('  F009: Event logging on evaluation completion')
print('  F010: Error logging to platform.error_events')
print('  F012: Standardised { data, error } response envelope')
print('  F013: Logger utility (lib/utils/logger.ts)')
print('  ACC1: aria-label on all interactive evaluation buttons')
print('\nNext: npm run type-check')
