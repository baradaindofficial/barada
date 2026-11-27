import type { Metadata } from 'next'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'
import VerifyForm from '@/components/verify/VerifyForm'

export const metadata: Metadata = {
  title: 'Verify a Certificate',
  description: 'Check that a QORVIAN by Barada certificate is genuine by entering its certificate ID.',
  alternates: { canonical: 'https://www.barada.in/verify' },
}

export default function VerifyPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <CorporateHeader />
      <section style={{ background: 'linear-gradient(135deg, #0A1A52, #123C8F)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#fff', marginBottom: '1rem' }}>Verify a certificate</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', margin: 0 }}>Enter the certificate ID to confirm it was issued by QORVIAN by Barada.</p>
      </section>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: '2rem 1.5rem' }}>
          <VerifyForm />
          <p style={{ color: '#69717D', fontSize: '0.875rem', margin: '1rem 0 0' }}>The certificate ID is printed on every certificate and in the link we email to learners.</p>
        </div>
      </div>
      <CorporateFooter />
    </div>
  )
}
