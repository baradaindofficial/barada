'use client'
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
