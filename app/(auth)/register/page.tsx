import { Suspense } from 'react'
import type { Metadata } from 'next'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = {
  title: 'Create Free Account',
  description: 'Join Barada Academy — free professional AI courses with verified certificates.',
  robots: { index: false },
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <RegisterForm />
    </Suspense>
  )
}
