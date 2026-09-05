import Link from 'next/link'
import type { Metadata } from 'next'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'
import { ECOSYSTEM_VERTICALS, STATUS_LABEL } from '@/data/ecosystem-verticals'

export const metadata: Metadata = {
  title: 'Barada \u2014 Building the Future through Technology, Excellence and Impact',
  description: 'Barada is a professionally driven ecosystem of platforms built around AI, technology, business growth, and social impact. Bengaluru, India.',
  openGraph: {
    title: 'Barada',
    description: 'Building the Future through Technology, Professional Excellence, Business Growth, and Social Impact.',
    url: 'https://barada.in',
    siteName: 'Barada',
    images: [{ url: '/logo/barada-logo.png', width: 1200, height: 630, alt: 'Barada' }],
    locale: 'en_IN',
    type: 'website',
  },
}

const red = '#D11A1A'
const navy = '#0D183D'
const gold = '#D4AF37'

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: 0, color: '#111' }}>

      <CorporateHeader />

      {/* HERO — corporate identity, no Academy */}
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, #1A2B5E 100%)`, padding: '7rem 2rem 5rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Bengaluru, India &mdash; Founded 2025</p>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(2.25rem,5vw,4.25rem)', fontWeight: 900, color: '#fff', lineHeight: 1.12, marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>
          BARADA
        </h1>
        <p style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.1rem,2.5vw,1.6rem)', fontWeight: 600, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, maxWidth: 700, margin: '0 auto 2.5rem' }}>
          Building the Future through<br />
          <span style={{ color: gold }}>Technology</span>,{' '}
          <span style={{ color: gold }}>Professional Excellence</span>,{' '}
          <span style={{ color: gold }}>Business Growth</span>,{' '}
          and Social Impact.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/ecosystem" style={{ background: red, color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>Explore Ecosystem &rarr;</Link>
          <Link href="/about" style={{ border: '2px solid rgba(255,255,255,0.25)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>About Barada</Link>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Who We Are</p>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: navy, marginBottom: '1.25rem' }}>
            A professionally driven ecosystem<br />built for the AI era.
          </h2>
          <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.85, maxWidth: 680, margin: '0 auto 1.5rem' }}>
            Barada is a parent brand housing multiple platforms and businesses that together help professionals learn, grow, and build sustainable careers and organisations in an AI-driven world.
          </p>
          <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.85, maxWidth: 680, margin: '0 auto 2rem' }}>
            From structured AI learning to B2B business solutions, technology products, and social impact &mdash; every Barada platform is built from 19+ years of real corporate experience.
          </p>
          <Link href="/ecosystem" style={{ background: navy, color: '#fff', padding: '0.75rem 1.75rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>Our Ecosystem &rarr;</Link>
        </div>
      </section>

      {/* ECOSYSTEM CARDS — now from single-source data */}
      <section style={{ background: '#F9FAFB', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>The Barada Ecosystem</p>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: navy, margin: 0 }}>One parent. Multiple platforms.</h2>
            <p style={{ color: '#6B7280', marginTop: '0.75rem' }}>Each platform addresses a different professional need. All share the same founding values.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {ECOSYSTEM_VERTICALS.map(({ icon, name, tagline, desc, href, status, color, external }) => (
              <div key={name} style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', border: '1.5px solid #E5E7EB', borderTop: `4px solid ${color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>{icon}</span>
                  <span style={{
                    background: status === 'live' ? 'rgba(22,163,74,0.1)' : '#F3F4F6',
                    color: status === 'live' ? '#16a34a' : '#6B7280',
                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20
                  }}>{status === 'live' ? '\u25CF ' : '\u23F3 '}{STATUS_LABEL[status]}</span>
                </div>
                <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: navy, fontSize: '1rem', marginBottom: '0.25rem' }}>{name}</h3>
                <p style={{ color: color, fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>{tagline}</p>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{desc}</p>
                {status === 'live' ? (
                  external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: navy, color: '#fff', padding: '0.625rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700, textAlign: 'center' }}>Visit {name} &rarr;</a>
                  ) : (
                    <Link href={href} style={{ display: 'block', background: navy, color: '#fff', padding: '0.625rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700, textAlign: 'center' }}>Visit {name} &rarr;</Link>
                  )
                ) : (
                  <div style={{ display: 'block', background: '#F3F4F6', color: '#9CA3AF', padding: '0.625rem', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, textAlign: 'center' }}>Coming Soon</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/ecosystem" style={{ color: navy, fontWeight: 700, textDecoration: 'underline', fontSize: '0.9rem' }}>View full ecosystem map &rarr;</Link>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section style={{ background: navy, padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ color: gold, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Our Vision</p>
          <blockquote style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.1rem,2.5vw,1.65rem)', fontWeight: 700, color: '#fff', lineHeight: 1.65, margin: '0 0 1.25rem', fontStyle: 'normal' }}>
            &ldquo;To build one of the world&rsquo;s most trusted AI-powered professional transformation platforms &mdash; enabling individuals, organisations, and communities to continuously learn, adapt, and succeed.&rdquo;
          </blockquote>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', letterSpacing: '0.06em' }}>Integrity &middot; Innovation &middot; Impact &middot; Empowerment &middot; Excellence</p>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Leadership</p>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.25rem,2.5vw,2rem)', fontWeight: 800, color: navy, marginBottom: '1rem' }}>Built from real corporate experience.</h2>
          <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.85, maxWidth: 640, margin: '0 auto 1.5rem' }}>
            Barada was founded by a senior corporate professional with 19+ years of leadership experience across procurement, marketing, retail, and AI adoption at organisations including HCL, Dish TV, and Xiaomi India.
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Guinness World Record holder &middot; Rutgers University certified &middot; IIM Kozhikode alumni
          </p>
          <a href="https://bksatpathy.com" target="_blank" rel="noopener noreferrer" style={{ color: navy, fontWeight: 700, textDecoration: 'underline', fontSize: '0.9rem' }}>Full profile at bksatpathy.com &rarr;</a>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ background: '#F9FAFB', padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Get in Touch</p>
        <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.25rem,2.5vw,1.75rem)', fontWeight: 800, color: navy, marginBottom: '1rem' }}>Let&apos;s build something together.</h2>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>For partnerships, consulting, or media enquiries.</p>
        <Link href="/contact" style={{ background: navy, color: '#fff', padding: '0.75rem 2rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>Contact Barada &rarr;</Link>
        <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginTop: '1rem' }}>hello@barada.in</p>
      </section>

      <CorporateFooter />
    </div>
  )
}
