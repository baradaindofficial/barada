'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function RegisterForm() {
  const router = useRouter()
  const [form, setForm]     = useState({ firstName: '', lastName: '', email: '', password: '', profession: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim()

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: {
          full_name: fullName,
          profession: form.profession.trim(),
        },
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback?next=/dashboard`,
      },
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('This email is already registered. Please sign in instead.')
      } else {
        setError(signUpError.message)
      }
      setLoading(false)
      return
    }

    router.push(`/verify-email?email=${encodeURIComponent(form.email)}`)
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
            'Free account — no credit card required',
            '10 flagship professional courses',
            'Self-paced — learn at your own schedule',
            'Verifiable certificates from ₹299',
            'Real skills from real corporate experience',
          ].map(f => (
            <li key={f} className="flex items-center gap-3 text-white/70 text-sm">
              <span className="text-[#D4AF37] font-bold" aria-hidden="true">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <p className="text-white/30 text-xs">Bengaluru, India · barada.in</p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-8 inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D183D] rounded">
            ← Back to Barada.in
          </Link>
          <h1 className="font-display font-bold text-3xl text-[#0D183D] mb-2">Create your free account.</h1>
          <p className="text-gray-500 text-sm mb-8">Join professionals across India learning with Barada Academy.</p>

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-[#0D183D] mb-1.5">First name</label>
                <input id="firstName" type="text" required value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D183D] focus:ring-2 focus:ring-[#0D183D]/10"
                  placeholder="Rahul" autoComplete="given-name" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-[#0D183D] mb-1.5">Last name</label>
                <input id="lastName" type="text" required value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D183D] focus:ring-2 focus:ring-[#0D183D]/10"
                  placeholder="Sharma" autoComplete="family-name" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0D183D] mb-1.5">Email address</label>
              <input id="email" type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D183D] focus:ring-2 focus:ring-[#0D183D]/10"
                placeholder="you@company.com" autoComplete="email" inputMode="email" />
            </div>

            <div>
              <label htmlFor="profession" className="block text-sm font-semibold text-[#0D183D] mb-1.5">
                Profession <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input id="profession" type="text" value={form.profession}
                onChange={e => setForm(f => ({ ...f, profession: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D183D] focus:ring-2 focus:ring-[#0D183D]/10"
                placeholder="e.g. Marketing Manager, Business Analyst" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#0D183D] mb-1.5">Password</label>
              <input id="password" type="password" required minLength={8} value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D183D] focus:ring-2 focus:ring-[#0D183D]/10"
                placeholder="Minimum 8 characters" autoComplete="new-password"
                aria-describedby="password-hint" />
              <p id="password-hint" className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
            </div>

            <p className="text-xs text-gray-500">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="text-[#0D183D] font-semibold hover:underline">Terms</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#0D183D] font-semibold hover:underline">Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={loading} aria-busy={loading}
              className="w-full bg-[#D11A1A] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#A01010] transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D11A1A]">
              {loading ? 'Creating account…' : 'Create Free Account →'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#0D183D] hover:underline">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
