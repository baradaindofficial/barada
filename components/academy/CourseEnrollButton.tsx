'use client'
/**
 * components/academy/CourseEnrollButton.tsx
 * Per-course enroll CTA for the /academy catalogue.
 *
 * Fix: the course cards previously linked every "Start Learning Free" button
 * to the generic /register URL with no course reference. For an already
 * logged-in user, /register just redirects to /dashboard and nothing gets
 * enrolled -- there was no working path to enroll in a course at all.
 * This calls the existing POST /api/enrollment endpoint (which already
 * worked, it was just never wired up here) and sends the learner straight
 * into the course. Logged-out visitors keep the original /register link.
 */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const navy = '#0D183D'
const red = '#D11A1A'

const buttonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  background: navy,
  color: '#fff',
  padding: '0.625rem',
  borderRadius: 8,
  border: 'none',
  textDecoration: 'none',
  fontSize: '0.82rem',
  fontWeight: 700,
  textAlign: 'center',
  fontFamily: 'inherit',
}

export default function CourseEnrollButton({ slug, isLoggedIn }: { slug: string; isLoggedIn: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isLoggedIn) {
    return (
      <Link href="/register" style={buttonStyle}>
        Start Learning Free &rarr;
      </Link>
    )
  }

  const handleEnroll = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: slug }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok || data.status === 'already_enrolled') {
        router.push(`/learn/${slug}/module-1/lesson-1`)
        return
      }
      setError(data.error || 'Failed to enroll. Please try again.')
      setLoading(false)
    } catch {
      setError('Failed to enroll. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading}
        style={{ ...buttonStyle, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Enrolling…' : <>Start Learning Free &rarr;</>}
      </button>
      {error && (
        <p style={{ color: red, fontSize: '0.72rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>
      )}
    </div>
  )
}
