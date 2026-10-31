import type { Metadata } from 'next'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'

export const metadata: Metadata = {
  title: 'Terms of Use',
  alternates: { canonical: 'https://barada.in/terms' },
}

export default function TermsPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <CorporateHeader />

      <section style={{ background: 'linear-gradient(135deg, #0D183D, #1A2B5E)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4.5vw,3.5rem)', color: '#fff', marginBottom: '1rem' }}>Terms of Use</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', margin: 0 }}>Last updated: August 2026</p>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem' }}>
        {[
          ['Acceptance', 'By accessing or using any Barada platform, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.'],
          ['Permitted Use', 'Barada Academy courses are for personal, non-commercial professional development. You may not reproduce, resell, or redistribute course content without written permission from Barada.'],
          ['Accounts', 'You are responsible for maintaining the security of your account. You must provide accurate information during registration. Barada reserves the right to suspend accounts that violate these terms.'],
          ['Certificates', 'Certificates are issued upon successful completion of the course assessment and payment of the certificate fee. Certificates are issued in the name provided at registration and cannot be transferred.'],
          ['Intellectual Property', 'All course content, including videos, slides, prompts, and materials, is the intellectual property of Barada (OPC) Private Limited. Unauthorised reproduction is prohibited.'],
          ['Limitation of Liability', 'Barada provides its platform on an as-is basis. We do not guarantee specific career outcomes. Our liability is limited to the amount paid for any certificate in the preceding 12 months.'],
          ['Governing Law', 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.'],
          ['Contact', 'For terms-related queries, contact info@barada.in or write to Barada (OPC) Private Limited, Bengaluru, Karnataka, India.'],
        ].map(([title, body]) => (
          <div key={title} style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: '#0D183D', fontSize: '1rem', marginBottom: '0.625rem' }}>{title}</h2>
            <p style={{ color: '#6B7280', lineHeight: 1.8, fontSize: '0.9rem', margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
      <CorporateFooter />
    </div>
  )
}
