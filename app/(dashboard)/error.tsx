'use client'
/**
 * app/(dashboard)/error.tsx — Dashboard error boundary
 * Catches unhandled errors in the (dashboard) route group and shows
 * a recovery UI instead of the default Next.js error page.
 */
import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to monitoring service (Sentry etc.) when available
    console.error('[Dashboard error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-md w-full text-center shadow-sm">
        <div className="text-4xl mb-4" aria-hidden="true">⚠️</div>
        <h1 className="font-display font-bold text-xl text-[#0D183D] mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          We ran into an unexpected error loading your dashboard. Your data is safe.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="bg-[#D11A1A] text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-[#A01010] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/academy"
            className="bg-gray-100 text-gray-700 font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
        {error.digest && (
          <p className="text-gray-300 text-xs mt-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
