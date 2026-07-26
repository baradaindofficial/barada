/**
 * app/(auth)/login/page.tsx
 *
 * FIX (C4): useSearchParams() requires a Suspense boundary in Next.js 14
 * App Router. Without it the build emits a warning and the page breaks in
 * production when rendered on the server. Split into an outer shell that
 * provides the boundary and an inner LoginForm that reads search params.
 */
import { Suspense } from 'react'
import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Barada Academy account.',
  robots: { index: false },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginForm />
    </Suspense>
  )
}

/** Skeleton shown while the client component hydrates */
function LoginShell() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block bg-[#0D183D]" />
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-100 rounded w-64" />
          <div className="h-12 bg-gray-100 rounded" />
          <div className="h-12 bg-gray-100 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}
