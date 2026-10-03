import Link from 'next/link'
import type { Metadata } from 'next'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'

export const metadata: Metadata = {
  title: 'Barada — Practical Learning and Business Execution',
  description: 'Barada is the parent brand behind Barada Academy (practical AI skills training) and Partnerschaft (retail execution and procurement support), built on 19+ years of real corporate experience. Bengaluru, India.',
  alternates: { canonical: 'https://barada.in' },
  openGraph: {
    title: 'Barada',
    description: 'Practical learning and business execution, built on professional experience.',
    url: 'https://barada.in',
    siteName: 'Barada',
    images: [{ url: '/og/barada-og.png', width: 1200, height: 630, alt: 'Barada' }],
    locale: 'en_IN',
    type: 'website',
  },
}

const red = '#E31E24'
const navy = '#0D183D'
const gold = '#D4AF37'

// The two routes Barada actively wants every visitor to find in one click.
// Kept as plain data (not sourced from ECOSYSTEM_VERTICALS) because this
// section's copy is deliberately more direct/action-oriented than the
// ecosystem card grid used on /ecosystem.
const PRIMARY_ROUTES = [
  {
    icon: '🎓',
    name: 'Barada Academy',
    headline: 'Learn practical AI skills',
    desc: 'Structured, self-paced courses on AI tools, productivity, and career skills — free to start, with a verified certificate available on completion.',
    href: '/academy',
    cta: 'Explore Barada Academy',
    color: red,
  },
  {
    icon: '🔗',
    name: 'Partnerschaft',
    headline: 'Retail execution and procurement support',
    desc: 'Pan-India B2B mediation for retail execution, BTL activation, procurement, and in-store branding.',
    href: 'https://partnerschaft.in',
    cta: 'Visit Partnerschaft',
    external: true,
    color: navy,
  },
]

// Ventures still being built, plus Consulting — whose availability is
// unresolved (the existing /services page invites enquiries, but that is
// not confirmation it is a live, staffed offering; left exactly as flagged
// until explicitly confirmed, not resolved either way here).
const BUILDING: { icon: string; name: string; desc: string }[] = [
  { icon: '📋', name: 'Consulting', desc: 'AI adoption advisory and procurement transformation consulting.' },
  { icon: '🤖', name: 'Technology', desc: 'AI-powered tools and platforms for professionals.' },
  { icon: '🌱', name: 'Ayushman', desc: 'Autism awareness, caregiver support, and community building.' },
]

export default function HomePage() {
  return (
    <div style={{ margin: 0, padding: 0, color: '#111' }}>

      <CorporateHeader />

      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, #1A2B5E 100%)`, padding: '7rem 2rem 5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

        {/* Simplified decorative mark — a single glow behind the existing,
            unmodified B mark. The previous orbiting multi-node "ecosystem"
            graphic was removed: it visually implied five co-equal
            destinations, which no longer matches a homepage built around
            two primary routes. */}
        <div className="barada-hero-visual" aria-hidden="true">
          <div className="barada-hero-glow" />
          <img
            src="/logo/barada-symbol-512.png"
            alt=""
            width={200}
            height={200}
            className="barada-hero-mark"
          />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Bengaluru, India &mdash; Founded 2025</p>
          <h1 style={{ fontSize: 'clamp(2.25rem,5vw,4.25rem)', fontWeight: 900, color: '#fff', lineHeight: 1.12, marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>
            BARADA
          </h1>
          <p style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.1rem,2.5vw,1.6rem)', fontWeight: 600, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, maxWidth: 640, margin: '0 auto 2.5rem' }}>
            Practical <span style={{ color: gold }}>learning</span> and business <span style={{ color: gold }}>execution</span>, built on professional experience.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/academy" style={{ background: red, color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>Explore Barada Academy &rarr;</Link>
            <a href="https://partnerschaft.in" target="_blank" rel="noopener noreferrer" style={{ border: '2px solid rgba(255,255,255,0.25)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Visit Partnerschaft</a>
          </div>
        </div>

        <style>{`
          .barada-hero-visual {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 0;
            opacity: 0.35;
          }
          .barada-hero-glow {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(227,30,36,0.3) 0%, rgba(212,175,55,0.15) 45%, rgba(13,24,61,0) 72%);
            filter: blur(6px);
            animation: baradaGlowPulse 7s ease-in-out infinite;
          }
          .barada-hero-mark {
            position: relative;
            width: 200px;
            height: 200px;
            filter: drop-shadow(0 18px 34px rgba(0,0,0,0.45));
            animation: baradaFloat 6.5s ease-in-out infinite;
          }
          @keyframes baradaFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
          }
          @keyframes baradaGlowPulse {
            0%, 100% { opacity: 0.55; transform: scale(1); }
            50% { opacity: 0.85; transform: scale(1.07); }
          }
          @media (prefers-reduced-motion: reduce) {
            .barada-hero-mark, .barada-hero-glow {
              animation: none !important;
            }
          }
        `}</style>
      </section>

      {/* WHO WE ARE */}
      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Who We Are</p>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: navy, marginBottom: '1.25rem' }}>
            A parent brand, built for practical results.
          </h2>
          <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.85, maxWidth: 680, margin: '0 auto 1.5rem' }}>
            Barada is the parent brand behind Barada Academy and Partnerschaft, with consulting services and further ventures underway. Every Barada platform is built from 19+ years of real corporate experience.
          </p>
          <Link href="/ecosystem" style={{ background: navy, color: '#fff', padding: '0.75rem 1.75rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>See the Full Ecosystem &rarr;</Link>
        </div>
      </section>

      {/* TWO PRIMARY ROUTES */}
      <section style={{ background: '#F9FAFB', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Two Ways to Work With Barada</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: navy, margin: 0 }}>Start here.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {PRIMARY_ROUTES.map(({ icon, name, headline, desc, href, cta, external, color }) => (
              <div key={name} style={{ background: '#fff', borderRadius: 20, padding: '2.5rem', border: '1.5px solid #E5E7EB', borderTop: `4px solid ${color}` }}>
                <span style={{ fontSize: '2.25rem', display: 'block', marginBottom: '1.25rem' }}>{icon}</span>
                <p style={{ color: color, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{name}</p>
                <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: navy, fontSize: '1.375rem', marginBottom: '0.875rem' }}>{headline}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.75rem' }}>{desc}</p>
                {external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: color, color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>{cta} &rarr;</a>
                ) : (
                  <Link href={href} style={{ display: 'inline-block', background: color, color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>{cta} &rarr;</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE'RE BUILDING — planned/in-development ventures, de-emphasized.
          Consulting is included here rather than presented as a confirmed
          live route — its availability is unresolved, see BUILDING above. */}
      <section style={{ background: '#fff', padding: '3.5rem 2rem 5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ color: '#9CA3AF', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1.5rem' }}>What We&apos;re Building</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {BUILDING.map(({ icon, name, desc }) => (
              <div key={name} style={{ background: '#F9FAFB', borderRadius: 14, padding: '1.5rem', border: '1px solid #E5E7EB', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                <div>
                  <p style={{ fontWeight: 700, color: navy, fontSize: '0.9rem', margin: '0 0 0.25rem' }}>{name} <span style={{ color: '#9CA3AF', fontWeight: 600, fontSize: '0.7rem' }}>&middot; Coming Soon</span></p>
                  <p style={{ color: '#6B7280', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/ecosystem" style={{ color: navy, fontWeight: 700, textDecoration: 'underline', fontSize: '0.9rem' }}>View full ecosystem map &rarr;</Link>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section style={{ background: navy, padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ color: gold, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Our Vision</p>
          <blockquote style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.1rem,2.5vw,1.65rem)', fontWeight: 700, color: '#fff', lineHeight: 1.65, margin: '0 0 1.25rem', fontStyle: 'normal' }}>
            &ldquo;To build one of the world&rsquo;s most trusted AI-powered professional transformation platforms — enabling individuals, organisations, and communities to continuously learn, adapt, and succeed.&rdquo;
          </blockquote>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', letterSpacing: '0.06em' }}>Integrity &middot; Innovation &middot; Impact &middot; Empowerment &middot; Excellence</p>
        </div>
      </section>

      {/* PROFESSIONAL FOUNDATION */}
      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Professional Foundation</p>
          <h2 style={{ fontSize: 'clamp(1.25rem,2.5vw,2rem)', fontWeight: 800, color: navy, marginBottom: '1rem' }}>Built and run by BK Satpathy.</h2>
          <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.85, maxWidth: 640, margin: '0 auto 1rem' }}>
            Barada&apos;s platforms are built and run by BK Satpathy, drawing on 19+ years of hands-on professional experience across procurement, marketing, retail, and AI adoption. This includes his professional experience at HCL Technologies, Dish TV, and Xiaomi India &mdash; named here as professional background, not as Barada clients or partners.
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '2rem' }}>
            BK Satpathy: Guinness World Record holder &middot; Rutgers University certified &middot; IIM Kozhikode alumni
          </p>
          <a href="https://bksatpathy.com" target="_blank" rel="noopener noreferrer" style={{ color: navy, fontWeight: 700, textDecoration: 'underline', fontSize: '0.9rem' }}>Professional background: bksatpathy.com &rarr;</a>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ background: '#F9FAFB', padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Get in Touch</p>
        <h2 style={{ fontSize: 'clamp(1.25rem,2.5vw,1.75rem)', fontWeight: 800, color: navy, marginBottom: '1rem' }}>Let&apos;s build something together.</h2>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>For partnerships, consulting, or media enquiries.</p>
        <Link href="/contact" style={{ background: navy, color: '#fff', padding: '0.75rem 2rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>Contact Barada &rarr;</Link>
        <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginTop: '1rem' }}>info@barada.in</p>
      </section>

      <CorporateFooter />
    </div>
  )
}
