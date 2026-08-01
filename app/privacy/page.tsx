import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'

export const metadata: Metadata = {
  title: 'Privacy Policy | Barada',
}

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <nav style={{ background: '#0D183D', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'inline-block', lineHeight: 0 }}>
          <Logo variant="corporate" height={40} />
        </Link>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.82rem' }}>&larr; Back to Barada.in</Link>
      </nav>
      <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '2rem', marginBottom: '0.5rem' }}>Privacy Policy</h1>
        <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: '2.5rem' }}>Last updated: August 2026</p>
        {[
          ['Information We Collect', 'We collect your name, email address, and professional details when you register for Barada Academy. We also collect usage data such as course progress, quiz scores, and lesson completion to improve your learning experience.'],
          ['How We Use Your Information', 'Your information is used to provide and improve our learning platform, send you course updates and certificate notifications, and personalise your dashboard experience. We do not sell your personal data to third parties.'],
          ['Data Storage', 'Your data is stored securely on Supabase infrastructure (hosted in Singapore, ap-south-1 region). All data is encrypted in transit and at rest.'],
          ['Analytics', 'We use Google Analytics 4 and Microsoft Clarity to understand how learners use our platform. These services may collect anonymised usage data. You can opt out via your browser settings.'],
          ['Your Rights', 'You may request access to, correction of, or deletion of your personal data at any time by emailing privacy@barada.in. We will respond within 30 days.'],
          ['Contact', 'For privacy-related queries, contact us at privacy@barada.in or write to Barada (OPC) Private Limited, Bengaluru, Karnataka, India.'],
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
