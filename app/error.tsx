'use client'
/** app/error.tsx — Root-level error boundary for unexpected crashes */
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en-IN">
      <body className="min-h-screen bg-[#0D183D] flex items-center justify-center p-8 font-sans">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4" aria-hidden="true">⚠️</div>
          <h1 className="font-bold text-2xl text-white mb-3">Something went wrong</h1>
          <p className="text-white/50 text-sm mb-8">
            An unexpected error occurred. Please try again.
            {error.digest && <span className="block mt-2 font-mono text-white/25 text-xs">ID: {error.digest}</span>}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={reset}
              className="bg-[#D11A1A] text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-[#A01010] transition-colors">
              Try again
            </button>
            <Link href="/"
              className="bg-white/10 text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-white/20 transition-colors">
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
