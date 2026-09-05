import type { Metadata } from 'next'
import Link from 'next/link'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'

export const metadata: Metadata = {
  title: 'Services | Barada',
  description: 'Barada offers AI adoption advisory, procurement transformation consulting, and professional workshops \u2014 built from 19+ years of real corporate experience.',
  openGraph: {
    title: 'Services | Barada',
    description: 'Barada offers AI adoption advisory, procurement transformation consulting, and professional workshops.',
    url: 'https://barada.in/services',
    siteName: 'Barada',
    images: [{ url: '/logo/barada-logo.png', width: 1200, height: 630, alt: 'Barada' }],
    locale: 'en_IN',
    type: 'website',
  },
}

const SERVICES = [
  {
    icon: '\uD83E\uDD16',
    title: 'AI Adoption Advisory',
    desc: 'Practical guidance for organisations bringing AI tools into real workflows \u2014 from initial assessment to team rollout, grounded in what actually works day-to-day, not theory.',
  },
  {
    icon: '\uD83D\uDCCB',
    title: 'Procurement Transformation Consulting',
    desc: 'Procurement process design, digital transformation, and GBS strategy \u2014 drawing on 19+ years of hands-on procurement leadership across HCL, Dish TV, and Xiaomi India.',
  },
  {
    icon: '\uD83C\uDF93',
    title: 'Professional Workshops',
    desc: 'Structured, practitioner-led workshops on AI tools, productivity, and career skills for teams and organisations \u2014 the same material behind Barada Academy, delivered live.',
  },
]

export default function ServicesPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <CorporateHeader />

      <section style={{ background: 'linear-gradient(135deg, #0D183D, #1A2B5E)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', color: '#fff', marginBottom: '1rem' }}>Services</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>AI adoption advisory, procurement transformation, and professional workshops &mdash; built from real corporate experience.</p>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
          {SERVICES.map(({ icon, title, desc }) => (
            <div key={title} style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>{icon}</span>
              <div>
                <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.15rem', marginBottom: '0.5rem' }}>{title}</h2>
                <p style={{ color: '#6B7280', lineHeight: 1.8, fontSize: '0.95rem' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#0D183D', borderRadius: 16, padding: '2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.375rem', marginBottom: '0.75rem' }}>Discuss your requirements</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Every engagement starts with a conversation about what you actually need.</p>
          <Link href="/contact" style={{ display: 'inline-block', background: '#D11A1A', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>Contact Barada &rarr;</Link>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '1rem' }}>or email info@barada.in directly</p>
        </div>
      </div>

      <CorporateFooter />
    </div>
  )
}
