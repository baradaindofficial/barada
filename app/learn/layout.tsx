import type { Metadata } from 'next'

// Lesson and evaluation pages belong to QORVIAN, so their browser tab titles
// carry the QORVIAN brand instead of the parent site's default.
export const metadata: Metadata = {
  title: { default: 'QORVIAN by Barada', template: '%s | QORVIAN by Barada' },
}

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
