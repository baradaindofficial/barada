'use client'
/**
 * app/(auth)/login/LoginForm.tsx
 * Client component — owns the form state and Supabase auth call.
 * Separated from page.tsx so that useSearchParams() is inside a Suspense boundary.
 */
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Validate the `next` param — only accept relative paths
  const rawNext = searchParams.get('next') ?? '/dashboard'
  const next = rawNext.startsWith('/') && !rawNext.includes('://') ? rawNext : '/dashboard'

  const errorParam = searchParams.get('error')

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(
    errorParam === 'link_expired'        ? 'Your verification link has expired. Please request a new one.' :
    errorParam === 'auth_callback_failed' ? 'Authentication failed. Please try again.' :
    ''
  )
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (signInError) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0D183D] p-12" aria-hidden="true">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo/barada-icon-36.png" alt="Barada" width={36} height={36} className="rounded-lg" />
          <span className="font-display font-bold text-white text-lg">Barada Academy</span>
        </Link>
        <ul className="space-y-4" aria-label="Platform benefits">
          {[
            '10 flagship courses — free to learn',
            'Self-paced — no deadlines, ever',
            'Verified certificates from ₹299',
            'Track your progress across devices',
            'Download slides, notes, and prompt packs',
          ].map((f) => (
            <li key={f} className="flex items-center gap-3 text-white/70 text-sm">
              <span className="text-[#D4AF37] font-bold" aria-hidden="true">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <p className="text-white/30 text-xs">Bengaluru, India · barada.in</p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 mb-8 inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D183D] rounded"
          >
            ← Back to Barada.in
          </Link>

          <h1 className="font-display font-bold text-3xl text-[#0D183D] mb-2">
            Welcome back.
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Sign in to continue your learning journey.
          </p>

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0D183D] mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D183D] focus:ring-2 focus:ring-[#0D183D]/10 transition-colors"
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#0D183D] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D183D] focus:ring-2 focus:ring-[#0D183D]/10 transition-colors"
                placeholder="Your password"
                autoComplete="current-password"
              />
              <div className="text-right mt-1.5">
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#0D183D] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D183D] rounded"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full bg-[#D11A1A] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#A01010] transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D11A1A]"
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-[#0D183D] hover:underline">
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
