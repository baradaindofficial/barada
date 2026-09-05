'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/shared/Logo'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawNext = searchParams.get('next') ?? '/dashboard'
  const next = rawNext.startsWith('/') && !rawNext.includes('://') ? rawNext : '/dashboard'
  const errorParam = searchParams.get('error')

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(
    errorParam === 'link_expired'         ? 'Your verification link has expired. Please request a new one.' :
    errorParam === 'auth_callback_failed' ? 'Authentication failed. Please try again.' : ''
  )
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    if (signInError) { setError('Incorrect email or password. Please try again.'); setLoading(false); return }
    router.push(next)
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      {/* Left panel */}
      <div style={{ background: '#0D183D', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'inline-block', lineHeight: 0 }}>
          <Logo variant="academy" height={44} />
        </Link>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['10 flagship courses \u2014 free to learn', 'Self-paced \u2014 no deadlines', 'Verified certificates', 'Track progress across devices'].map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#D4AF37', fontWeight: 700 }}>&#10003;</span>{f}
            </li>
          ))}
        </ul>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>Bengaluru, India &middot; barada.in</p>
      </div>
      {/* Right panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.82rem', display: 'block', marginBottom: '2rem' }}>&larr; Back to Barada.in</Link>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, fontSize: '1.875rem', color: '#0D183D', marginBottom: '0.5rem' }}>Welcome back.</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '2rem' }}>Sign in to continue your learning journey.</p>
          {error && <div role="alert" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '0.875rem', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>{error}</div>}
          <form onSubmit={handleLogin} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0D183D', marginBottom: '0.375rem' }}>Email address</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" inputMode="email" placeholder="you@example.com"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0D183D', marginBottom: '0.375rem' }}>Password</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ textAlign: 'right', marginTop: '0.375rem' }}>
                <Link href="/forgot-password" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0D183D', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
            </div>
            <button type="submit" disabled={loading} aria-busy={loading}
              style={{ background: '#D11A1A', color: '#fff', padding: '0.875rem', borderRadius: 10, border: 'none', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Signing in\u2026' : 'Sign In \u2192'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', marginTop: '1.5rem' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ fontWeight: 700, color: '#0D183D', textDecoration: 'none' }}>Create one free &rarr;</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
