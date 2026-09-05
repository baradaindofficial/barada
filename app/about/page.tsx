import type { Metadata } from 'next'
import Link from 'next/link'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'

export const metadata: Metadata = {
  title: 'About Barada',
  description: 'Learn about Barada \u2014 a professionally driven ecosystem of platforms built around AI, technology, business growth, and social impact.',
  openGraph: {
    title: 'About Barada',
    description: 'Learn about Barada \u2014 a professionally driven ecosystem of platforms built around AI, technology, business growth, and social impact.',
    url: 'https://barada.in/about',
    siteName: 'Barada',
    images: [{ url: '/logo/barada-logo.png', width: 1200, height: 630, alt: 'Barada' }],
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

        <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', border: '1.5px solid #E5E7EB', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.375rem', marginBottom: '1rem' }}>Leadership</h2>
          <p style={{ color: '#6B7280', lineHeight: 1.85, fontSize: '1rem', marginBottom: '0.75rem' }}>
            Barada was founded by a senior corporate professional with 19+ years of leadership experience across procurement transformation, marketing, retail expansion, and AI adoption at organisations including HCL Technologies, Dish TV, and Xiaomi India.
          </p>
          <p style={{ color: '#6B7280', lineHeight: 1.85, fontSize: '1rem', marginBottom: '1.25rem' }}>
            Guinness World Record holder &middot; Rutgers University certified &middot; IIM Kozhikode alumni &middot; Bengaluru, India
          </p>
          <a href="https://bksatpathy.com" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', background: '#0D183D', color: '#fff', padding: '0.625rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>
            Full Profile at bksatpathy.com &rarr;
          </a>
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
                <p style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: '#D11A1A', fontSize: '0.875rem', marginBottom: '0.375rem' }}>{title}</p>
                <p style={{ color: '#6B7280', fontSize: '0.82rem', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/ecosystem" style={{ background: '#D11A1A', color: '#fff', padding: '0.75rem 2rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>Explore Our Ecosystem &rarr;</Link>
        </div>
      </div>

      <CorporateFooter />
    </div>
  )
}
