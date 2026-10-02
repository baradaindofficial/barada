'use client'
import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/academy" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            <Logo variant="academy" height={40} />
          </Link>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Reset your password
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Enter your email and we will send you a reset link.
          </p>
        </div>

        {sent ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', fontSize: '1.125rem', marginBottom: '0.5rem' }}>Check your email</h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7 }}>
              We sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
            </p>
            <Link href="/login" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#E31E24', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#374151', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem' }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              {error && <p style={{ color: '#E31E24', fontSize: '0.82rem' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ background: '#E31E24', color: '#fff', border: 'none', borderRadius: 10, padding: '0.875rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#6B7280', fontSize: '0.875rem' }}>
              Remember your password?{' '}
              <Link href="/login" style={{ color: '#E31E24', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
