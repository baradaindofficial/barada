import Link from 'next/link'
import Logo from '@/components/shared/Logo'

export default function VerifyEmailPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <Link href="/academy" style={{ display: 'inline-block', marginBottom: '2rem' }}>
          <Logo variant="academy" height={40} />
        </Link>
        <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', border: '1.5px solid #E5E7EB' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            Check your inbox
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
            We sent you a verification email. Click the link in the email to activate your Barada Academy account and start learning.
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginBottom: '1.5rem' }}>
            Did not receive it? Check your spam folder, or{' '}
            <Link href="/register" style={{ color: '#D11A1A', fontWeight: 700, textDecoration: 'none' }}>try again</Link>.
          </p>
          <Link
            href="/login"
            style={{ display: 'inline-block', background: '#0D183D', color: '#fff', padding: '0.75rem 2rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
