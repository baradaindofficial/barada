import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'

export const metadata: Metadata = {
  title: 'Terms of Use | Barada',
}

export default function TermsPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <nav style={{ background: '#0D183D', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'inline-block', lineHeight: 0 }}>
          <Logo variant="corporate" height={40} />
        </Link>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.82rem' }}>&larr; Back to Barada.in</Link>
      </nav>
      <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '2rem', marginBottom: '0.5rem' }}>Terms of Use</h1>
        <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: '2.5rem' }}>Last updated: August 2026</p>
        {[
          ['Acceptance', 'By accessing or using any Barada platform, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.'],
          ['Permitted Use', 'Barada Academy courses are for personal, non-commercial professional development. You may not reproduce, resell, or redistribute course content without written permission from Barada.'],
          ['Accounts', 'You are responsible for maintaining the security of your account. You must provide accurate information during registration. Barada reserves the right to suspend accounts that violate these terms.'],
          ['Certificates', 'Certificates are issued upon successful completion of the course assessment and payment of the certificate fee. Certificates are issued in the name provided at registration and cannot be transferred.'],
          ['Intellectual Property', 'All course content, including videos, slides, prompts, and materials, is the intellectual property of Barada (OPC) Private Limited. Unauthorised reproduction is prohibited.'],
          ['Limitation of Liability', 'Barada provides its platform on an as-is basis. We do not guarantee specific career outcomes. Our liability is limited to the amount paid for any certificate in the preceding 12 months.'],
          ['Governing Law', 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.'],
          ['Contact', 'For terms-related queries, contact legal@barada.in or write to Barada (OPC) Private Limited, Bengaluru, Karnataka, India.'],
        ].map(([title, body]) => (
          <div key={title} style={{ background: '#fff', borderRadius: 12, padding: '1.75rem', border: '1.5px solid #E5E7EB', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', fontSize: '1rem', marginBottom: '0.625rem' }}>{title}</h2>
            <p style={{ color: '#6B7280', lineHeight: 1.8, fontSize: '0.9rem', margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
      <footer style={{ background: '#060b18', padding: '1.5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', margin: 0 }}>&copy; 2026 Barada. A venture of Barada (OPC) Private Limited.</p>
      </footer>
    </div>
  )
}
