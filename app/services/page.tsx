import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services | Barada',
}

export default function Page() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <nav style={{ background: '#0D183D', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#D11A1A', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>B</div>
          <span style={{ color: '#fff', fontWeight: 800 }}>Barada</span>
        </Link>
      </nav>
      <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '2rem', marginBottom: '1.5rem' }}>Services</h1>
        <p style={{ color: '#6B7280', lineHeight: 1.8, fontSize: '1rem' }}>Barada offers AI adoption advisory, procurement consulting, and professional workshops. Contact info@barada.in to discuss your requirements.</p>
        <Link href="/" style={{ display: 'inline-block', marginTop: '2rem', color: '#0D183D', fontWeight: 700 }}>← Back to Barada.in</Link>
      </div>
    </div>
  )
}
