import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'
import HeroRobot from '@/components/corporate/HeroRobot'

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
const teal = '#2EE6D6'
const ink = '#0A1020'

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
// unresolved (the existing /services page describes it as planned, not
// confirmed live; CTO call 2026-10-03). registerInterest is set only for
// Consulting since that's the one with a real enquiry route (/contact) to
// send interest to — Technology has no intake yet. Ayushman is live at
// ayushman.world (confirmed 2026-10-03) and is called out separately below
// rather than listed here as "Coming Soon".
const BUILDING: { icon: string; name: string; desc: string; registerInterest?: boolean }[] = [
  { icon: '📋', name: 'Consulting', desc: 'AI adoption advisory, AI and automation services, and procurement transformation consulting — planned.', registerInterest: true },
  { icon: '🤖', name: 'Technology', desc: 'AI-powered tools and platforms for professionals.' },
]

// Real, properly-licensed photography (Unsplash License -- free for
// commercial use) representing the actual breadth of the Barada
// ecosystem, added 2026-10-04 per BK's ask for imagery on the homepage.
// Captions describe Barada's real offerings (self-paced online courses,
// B2B execution, advisory, AI tooling) -- deliberately not styled after
// campus-photography sites with "MBA & Masters" / "Executive Education"
// framing, since Barada doesn't grant degrees or run in-person cohorts
// and that framing would misrepresent what these platforms are.
const ECOSYSTEM_PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=75&auto=format&fit=crop',
    name: 'Barada Academy',
    desc: 'Self-paced online courses on AI tools, productivity, and career skills.',
    href: '/academy',
  },
  {
    src: 'https://images.unsplash.com/photo-1758873269317-51888e824b28?w=800&q=75&auto=format&fit=crop',
    name: 'Partnerschaft',
    desc: 'Pan-India B2B mediation for retail execution and procurement.',
    href: 'https://partnerschaft.in',
    external: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1758518730083-4c12527b6742?w=800&q=75&auto=format&fit=crop',
    name: 'Consulting',
    desc: 'AI adoption advisory, AI and automation, and corporate transformation -- planned.',
    href: '/contact',
  },
  {
    src: 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=800&q=75&auto=format&fit=crop',
    name: 'Technology',
    desc: 'AI-powered tools and platforms for professionals -- in development.',
    href: '/ecosystem',
  },
]

// Planned services shown on the hero strip. Mirrors the BUILDING/Consulting
// description above and the /services page: planned, not open for booking.
const CAPABILITIES = [
  { name: 'AI and automation', desc: 'Practical AI adoption and workflow automation for business teams.' },
  { name: 'Procurement transformation', desc: 'Source-to-Pay and digital procurement advisory, drawn from hands-on experience.' },
  { name: 'Team workshops', desc: 'Hands-on AI skills workshops for teams. Register your interest to be contacted.' },
]

export default function HomePage() {
  return (
    <div style={{ margin: 0, padding: 0, color: '#111' }}>

      <CorporateHeader />

      {/* HERO -- refreshed 2026-10-31 per BK's ask for a distinctive,
          technology-and-services look with a robot illustration. Dark ink
          ground with a teal accent (Barada red kept for the primary CTA).
          The robot is an original vector drawing with a light CSS tilt
          effect (components/corporate/HeroRobot.tsx); no 3D library. */}
      <section style={{ background: `linear-gradient(135deg, ${ink} 0%, #121C3F 100%)`, padding: '6rem 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div className="barada-hero-text" style={{ flex: '1 1 420px', minWidth: 'min(300px, 100%)' }}>
            <p style={{ color: teal, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Barada &middot; Bengaluru, India</p>
            <h1 style={{ fontSize: 'clamp(2.1rem,5vw,3.75rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              AI, technology and business execution, <span style={{ color: teal }}>built on real experience.</span>
            </h1>
            <p style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, maxWidth: 540, margin: '0 0 2.5rem' }}>
              Barada brings practical AI skills, digital procurement know-how and retail execution together, drawing on 19+ years of corporate experience.
            </p>
            <div className="barada-hero-ctas" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/academy" style={{ background: red, color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>Explore Barada Academy &rarr;</Link>
              <Link href="/services" style={{ border: `2px solid ${teal}`, color: teal, padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>See planned services</Link>
            </div>
          </div>

          <div className="barada-hero-illustration" style={{ flex: '1 1 380px', minWidth: 'min(280px, 100%)', maxWidth: 480 }}>
            <HeroRobot />
          </div>
        </div>

        <style>{`
          @media (max-width: 860px) {
            .barada-hero-text {
              text-align: center;
            }
            .barada-hero-text p,
            .barada-hero-ctas {
              margin-left: auto;
              margin-right: auto;
              justify-content: center;
            }
            .barada-hero-illustration {
              max-width: 320px;
              margin: 0 auto;
            }
          }
        `}</style>
      </section>

      {/* CAPABILITIES STRIP -- planned services only. Wording follows the
          /services page: planned, not open for booking, no pricing. */}
      <section style={{ background: ink, padding: '0 2rem 3.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '2rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1.25rem' }}>Planned services &middot; Coming Soon</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: '1rem' }}>
            {CAPABILITIES.map(({ name, desc }) => (
              <Link key={name} href="/services" style={{ display: 'block', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14, padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: '0 0 0.35rem' }}>{name}</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <Image src="/logo/barada-lockup-connect-build-grow.jpg" alt="Barada -- Connect. Build. Grow." width={220} height={220} style={{ width: 180, height: 'auto', margin: '0 auto 2rem' }} />
          <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Who We Are</p>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: navy, marginBottom: '1.25rem' }}>
            A parent brand, built for practical results.
          </h2>
          <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.85, maxWidth: 680, margin: '0 auto 1.5rem' }}>
            Barada is the parent brand behind Barada Academy and Partnerschaft, with consulting services planned and further ventures underway. Every Barada platform is built from 19+ years of real corporate experience.
          </p>
          <Link href="/ecosystem" style={{ background: navy, color: '#fff', padding: '0.75rem 1.75rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>See the Full Ecosystem &rarr;</Link>
        </div>
      </section>

      {/* ECOSYSTEM IMAGERY -- added 2026-10-04 per BK's ask for imagery
          on the homepage. Real Unsplash photography (not stock campus
          photos claiming programmes Barada doesn't run), captioned with
          what each platform actually is. */}
      <section style={{ background: '#fff', padding: '1rem 2rem 4rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
          {ECOSYSTEM_PHOTOS.map(({ src, name, desc, href, external }) => {
            const card = (
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '4 / 3', background: '#E5E7EB' }}>
                <Image src={src} alt={name} fill sizes="(max-width: 700px) 100vw, 280px" style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,24,61,0.97) 0%, rgba(13,24,61,0.8) 42%, rgba(13,24,61,0.2) 75%, transparent 100%)' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '1.25rem' }}>
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', marginBottom: '0.25rem' }}>{name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem', lineHeight: 1.5, margin: 0 }}>{desc}</p>
                </div>
              </div>
            )
            return external ? (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{card}</a>
            ) : (
              <Link key={name} href={href} style={{ textDecoration: 'none' }}>{card}</Link>
            )
          })}
        </div>
      </section>

      {/* TWO PRIMARY ROUTES */}
      <section style={{ background: '#F9FAFB', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Two Ways to Work With Barada</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: navy, margin: 0 }}>Start here.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' }}>
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
            {BUILDING.map(({ icon, name, desc, registerInterest }) => (
              <div key={name} style={{ background: '#F9FAFB', borderRadius: 14, padding: '1.5rem', border: '1px solid #E5E7EB', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                <div>
                  <p style={{ fontWeight: 700, color: navy, fontSize: '0.9rem', margin: '0 0 0.25rem' }}>{name} <span style={{ color: '#9CA3AF', fontWeight: 600, fontSize: '0.7rem' }}>&middot; Coming Soon</span></p>
                  <p style={{ color: '#6B7280', fontSize: '0.82rem', lineHeight: 1.6, margin: '0 0 0.5rem' }}>{desc}</p>
                  {registerInterest && (
                    <Link href="/contact" style={{ color: red, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'underline' }}>Coming Soon &mdash; Register Your Interest &rarr;</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
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
