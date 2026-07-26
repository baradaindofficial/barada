import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D183D] flex items-center justify-center text-center p-8">
      <div>
        <div className="text-7xl mb-6">404</div>
        <h1 className="font-display font-bold text-3xl text-white mb-3">Page not found</h1>
        <p className="text-white/50 text-sm mb-8 max-w-md">The page you are looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="bg-[#D11A1A] text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#A01010] transition-colors">Go Home</Link>
          <Link href="/academy" className="bg-white/10 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-white/20 transition-colors">Browse Courses</Link>
        </div>
      </div>
    </div>
  )
}
