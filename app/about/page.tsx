import type { Metadata } from 'next'
import Link from 'next/link'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Barada \u2014 a professionally driven ecosystem of platforms built around AI, technology, business growth, and social impact.',
  alternates: { canonical: 'https://barada.in/about' },
  openGraph: {
    title: 'About Barada',
    description: 'Learn about Barada \u2014 a professionally driven ecosystem of platforms built around AI, technology, business growth, and social impact.',
    url: 'https://barada.in/about',
    siteName: 'Barada',
    images: [{ url: '/og/barada-og.png', width: 1200, height: 630, alt: 'Barada' }],
    locale: 'en_IN',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <CorporateHeader />

      <section style={{ background: 'linear-gradient(135deg, #0D183D, #1A2B5E)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', color: '#fff', marginBottom: '1rem' }}>About Barada</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>A professionally driven ecosystem of platforms built from 19+ years of real corporate experience.</p>
      </section>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '4rem 2rem' }}>

        <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', border: '1.5px solid #E5E7EB', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.375rem', marginBottom: '1rem' }}>Who We Are</h2>
          <p style={{ color: '#6B7280', lineHeight: 1.85, fontSize: '1rem', marginBottom: '1rem' }}>
            Barada is the parent brand of a growing ecosystem of platforms designed to help professionals and organisations succeed in an AI-driven world. From structured AI learning to B2B business solutions, technology products, and social impact &mdash; every Barada platform is built on the same foundation of integrity, innovation, and real-world experience.
          </p>
          <p style={{ color: '#6B7280', lineHeight: 1.85, fontSize: '1rem' }}>
            Barada was founded in Bengaluru, India in 2025. The organisation operates as Barada (OPC) Private Limited.
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #E5E7EB', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(13,24,61,0.04)' }}>
          <div style={{ height: 4, background: 'linear-gradient(90deg, #0D183D 0%, #0D183D 33%, #D4AF37 33%, #D4AF37 66%, #E31E24 66%, #E31E24 100%)' }} />
          <div style={{ padding: '2.5rem' }}>
            <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Registered Entity</p>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900, color: '#0D183D', fontSize: '1.5rem', marginBottom: '0.375rem' }}>BARADA (OPC) PRIVATE LIMITED</h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.85rem', letterSpacing: '0.02em', marginBottom: '2rem' }}>Technology &middot; Consulting &middot; Learning &middot; Strategic Partnerships</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.25rem', padding: '1.25rem 1.5rem', background: '#F9FAFB', borderRadius: 12, border: '1px solid #E5E7EB', marginBottom: '2rem' }}>
              {[
                ['CIN', 'U70200KA2026OPC228497'],
                ['PAN', 'AAPCB1876R'],
                ['TAN', 'BLRB33874B'],
                ['Director', 'Manaswini Satapathy'],
              ].map(([label, val]) => (
                <div key={label}>
                  <p style={{ fontSize: '0.68rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '0.3rem' }}>{label}</p>
                  <p style={{ fontSize: '0.88rem', color: '#0D183D', fontWeight: 700, margin: 0 }}>{val}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[
                ['\uD83D\uDCCD', 'Registered Office (as per ROC)', '155, DS MAX, Synergy Agrahara Layout, Yelahanka, Bangalore North, Bangalore \u2013 560064, Karnataka'],
                ['\uD83C\uDFE0', 'Head Office', 'No. 101, Ranpur, PS \u2013 Binjharpur, Jajpur, Odisha \u2013 755012'],
                ['\uD83C\uDFE2', 'Bangalore Operating Location', 'No. 2060, JPLV-2, Kodichiknahalli, Bommanahalli, Bangalore \u2013 560076'],
                ['\uD83D\uDCDE', 'Phone & Email', '+91 91132 83848 \u00b7 info@barada.in'],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ padding: '1.25rem', border: '1px solid #E5E7EB', borderRadius: 12 }}>
                  <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '0.5rem' }}>{icon}</span>
                  <p style={{ fontSize: '0.68rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '0.3rem' }}>{label}</p>
                  <p style={{ fontSize: '0.85rem', color: '#0D183D', lineHeight: 1.6, margin: 0 }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', border: '1.5px solid #E5E7EB', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.375rem', marginBottom: '1.25rem' }}>Our Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              ['Integrity', 'We build what we promise. We say what we mean.'],
              ['Innovation', 'We embrace AI and new ideas without losing human judgment.'],
              ['Impact', 'We measure success by what changes in people\'s lives.'],
              ['Empowerment', 'We equip \u2014 not entertain. Every interaction must add value.'],
              ['Excellence', 'We hold ourselves to the highest standard in everything we ship.'],
              ['Collaboration', 'We build with our community, not just for them.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: '#F9FAFB', borderRadius: 12, padding: '1.25rem', border: '1px solid #E5E7EB' }}>
                <p style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: '#E31E24', fontSize: '0.875rem', marginBottom: '0.375rem' }}>{title}</p>
                <p style={{ color: '#6B7280', fontSize: '0.82rem', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/ecosystem" style={{ background: '#E31E24', color: '#fff', padding: '0.75rem 2rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>Explore Our Ecosystem &rarr;</Link>
        </div>
      </div>

      <CorporateFooter />
    </div>
  )
}
