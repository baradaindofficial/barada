import type { Metadata } from 'next'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: 'https://barada.in/privacy' },
}

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <CorporateHeader />

      <section style={{ background: 'linear-gradient(135deg, #0D183D, #1A2B5E)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4.5vw,3.5rem)', color: '#fff', marginBottom: '1rem' }}>Privacy Policy</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', margin: 0 }}>Last updated: August 2026</p>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem' }}>
        {[
          ['Information We Collect', 'We collect your name, email address, and professional details when you register for Barada Academy. We also collect usage data such as course progress, quiz scores, and lesson completion to improve your learning experience.'],
          ['How We Use Your Information', 'Your information is used to provide and improve our learning platform, send you course updates and certificate notifications, and personalise your dashboard experience. We do not sell your personal data to third parties.'],
          ['Data Storage', 'Your data is stored securely on Supabase infrastructure. All data is encrypted in transit and at rest.'],
          ['Analytics', 'We use Google Analytics 4 and Microsoft Clarity to understand how learners use our platform. These services may collect anonymised usage data. You can opt out via your browser settings.'],
          ['Your Rights', 'You may request access to, correction of, or deletion of your personal data at any time by emailing info@barada.in. We will respond within 30 days.'],
          ['Contact', 'For privacy-related queries, contact us at info@barada.in or write to Barada (OPC) Private Limited, Bengaluru, Karnataka, India.'],
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
