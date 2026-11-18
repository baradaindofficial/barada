import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'QORVIAN by Barada', template: '%s | QORVIAN by Barada' },
}

/** Auth pages layout — no main nav, just auth UI */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
