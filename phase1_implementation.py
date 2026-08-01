#!/usr/bin/env python3
"""
Barada Platform — Phase 1 Brand & Homepage Correction
Architecture v3.0 compliant implementation

Run from: C:\\Users\\dell\\barada-nextjs
  python phase1_implementation.py
"""
import os

BASE = r'C:\Users\dell\barada-nextjs'

def w(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Created: {rel}')

# ────────────────────────────────────────────────────────────────
# 1. LOGO COMPONENT — components/shared/Logo.tsx
# Single source of truth for all logo rendering
# ────────────────────────────────────────────────────────────────
w('components/shared/Logo.tsx', r"""import Image from 'next/image'
import Link from 'next/link'

type LogoVariant = 'corporate' | 'academy' | 'icon' | 'footer'

interface LogoProps {
  variant: LogoVariant
  height?: number
  linkTo?: string
  className?: string
}

/**
 * Logo component — single source of truth for all Barada logos.
 * To swap a logo: replace the file in public/logo/ — no code changes needed.
 *
 * Variants:
 *   corporate — Barada parent brand logo (red square, white B, "BARADA")
 *   academy   — Barada Academy logo (white bg, red B, "BARADA ACADEMY")
 *   icon      — B mark only (for favicon, small spaces)
 *   footer    — Same as corporate, used in footer context
 *
 * Logo policy (Architecture v3.0):
 *   corporate → all pages under / /about /ecosystem /resources /community
 *   academy   → all pages under /academy /dashboard /learn /login /register
 *   icon      → favicon, nav small spaces
 *   footer    → footer column logo
 */
export default function Logo({ variant, height = 40, linkTo, className = '' }: LogoProps) {
  const config: Record<LogoVariant, { src: string; alt: string; width: number }> = {
    corporate: {
      src: '/logo/barada-logo.png',
      alt: 'Barada',
      width: Math.round(height * 1),   // square logo
    },
    academy: {
      // Using corporate logo temporarily until academy-logo.png is confirmed
      src: '/logo/academy-logo.png',
      alt: 'Barada Academy',
      width: Math.round(height * 1),   // square logo
    },
    icon: {
      src: '/logo/barada-icon.png',
      alt: 'Barada',
      width: height,
    },
    footer: {
      src: '/logo/barada-logo.png',
      alt: 'Barada',
      width: Math.round(height * 1),
    },
  }

  const { src, alt, width } = config[variant]

  const img = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  )

  if (linkTo) {
    return (
      <Link href={linkTo} style={{ display: 'inline-block', lineHeight: 0 }}>
        {img}
      </Link>
    )
  }

  return img
}
""")

# ────────────────────────────────────────────────────────────────
# 2. CORPORATE HOMEPAGE — app/page.tsx
# Parent brand. No Academy hero. No courses. No "Start Learning".
# ────────────────────────────────────────────────────────────────
w('app/page.tsx', r"""import Link from 'next/link'
import type { Metadata } from 'next'
import Logo from '@/components/shared/Logo'

export const metadata: Metadata = {
  title: 'Barada — Building the Future through Technology, Excellence and Impact',
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

const NAV_LINKS = [
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Academy', href: '/academy' },
  { label: 'Resources', href: '/resources' },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const VERTICALS = [
  {
    icon: '\uD83C\uDF93',
    name: 'Barada Academy',
    tagline: 'AI & Professional Learning',
    desc: 'Structured professional courses on AI tools, productivity, and career skills. Free to learn.',
    href: '/academy',
    cta: 'Explore Academy',
    status: 'Live',
    color: '#E31E24',
  },
  {
    icon: '\uD83D\uDD17',
    name: 'Partnerschaft',
    tagline: 'B2B Lean Mediation',
    desc: 'Pan-India B2B mediation for retail execution, BTL, procurement, and instore branding.',
    href: 'https://partnerschaft.in',
    cta: 'Visit Partnerschaft',
    status: 'Live',
    color: '#0D183D',
  },
  {
    icon: '\uD83E\uDD16',
    name: 'Technology',
    tagline: 'AI Products & Platforms',
    desc: 'Building the next generation of AI-powered tools and technology platforms for professionals.',
    href: '/technology',
    cta: 'Learn More',
    status: 'Soon',
    color: '#475569',
  },
  {
    icon: '\uD83D\uDCCB',
    name: 'Consulting',
    tagline: 'Corporate Transformation',
    desc: 'AI adoption advisory, procurement transformation, and corporate excellence consulting.',
    href: '/consulting',
    cta: 'Learn More',
    status: 'Soon',
    color: '#475569',
  },
  {
    icon: '\uD83D\uDCDA',
    name: 'Resources',
    tagline: 'Knowledge Hub',
    desc: 'Blog, templates, downloads, case studies, research, whitepapers, and curated AI tools.',
    href: '/resources',
    cta: 'Browse Resources',
    status: 'Live',
    color: '#0D7340',
  },
  {
    icon: '\uD83E\uDD1D',
    name: 'Community',
    tagline: 'Events & Collaboration',
    desc: 'Professional events, webinars, newsletter, and a growing community of AI practitioners.',
    href: '/community',
    cta: 'Join Community',
    status: 'Live',
    color: '#0D7340',
  },
  {
    icon: '\uD83C\uDF31',
    name: 'Ayushman',
    tagline: 'Social Impact',
    desc: 'A platform for autism awareness, caregiver support, and community building across India.',
    href: '#',
    cta: 'Coming Soon',
    status: 'Soon',
    color: '#475569',
  },
]

const red = '#E31E24'
const navy = '#0D183D'
const gold = '#D4AF37'

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: 0, color: '#111' }}>

      {/* NAV */}
      <nav style={{ background: navy, padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
          <Logo variant="corporate" height={40} />
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>{label}</Link>
          ))}
          <Link href="/login" style={{ background: red, color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>Login</Link>
        </div>
      </nav>

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

      {/* ECOSYSTEM CARDS */}
      <section style={{ background: '#F9FAFB', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>The Barada Ecosystem</p>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: navy, margin: 0 }}>One parent. Multiple platforms.</h2>
            <p style={{ color: '#6B7280', marginTop: '0.75rem' }}>Each platform addresses a different professional need. All share the same founding values.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {VERTICALS.map(({ icon, name, tagline, desc, href, cta, status, color }) => (
              <div key={name} style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', border: '1.5px solid #E5E7EB', borderTop: `4px solid ${color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>{icon}</span>
                  <span style={{
                    background: status === 'Live' ? 'rgba(22,163,74,0.1)' : '#F3F4F6',
                    color: status === 'Live' ? '#16a34a' : '#6B7280',
                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20
                  }}>{status === 'Live' ? '\u25CF Active' : '\u23F3 Soon'}</span>
                </div>
                <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: navy, fontSize: '1rem', marginBottom: '0.25rem' }}>{name}</h3>
                <p style={{ color: color, fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>{tagline}</p>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{desc}</p>
                {status === 'Live' ? (
                  <Link href={href} style={{ display: 'block', background: navy, color: '#fff', padding: '0.625rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700, textAlign: 'center' }}>{cta} &rarr;</Link>
                ) : (
                  <div style={{ display: 'block', background: '#F3F4F6', color: '#9CA3AF', padding: '0.625rem', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, textAlign: 'center' }}>{cta}</div>
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

      {/* FOOTER */}
      <footer style={{ background: '#060b18', padding: '3.5rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <Logo variant="footer" height={44} />
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', lineHeight: 1.7, marginTop: '0.75rem' }}>A professionally driven ecosystem of platforms built from real corporate experience.</p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Corporate</p>
              {[['About', '/about'], ['Ecosystem', '/ecosystem'], ['Technology', '/technology'], ['Consulting', '/consulting'], ['Contact', '/contact']].map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '0.4rem' }}>{l}</Link>
              ))}
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Academy</p>
              {[['Barada Academy', '/academy'], ['Courses', '/academy'], ['AI Tools', '/academy'], ['Certificates', '/academy'], ['Login', '/login']].map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '0.4rem' }}>{l}</Link>
              ))}
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Resources</p>
              {[['Blog', '/resources/blog'], ['Templates', '/resources/templates'], ['Downloads', '/resources/downloads'], ['Research', '/resources/research'], ['Tools', '/resources/tools']].map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '0.4rem' }}>{l}</Link>
              ))}
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Community</p>
              {[['Events', '/community/events'], ['Webinars', '/community/webinars'], ['Newsletter', '/community/newsletter'], ['Success Stories', '/community/success-stories']].map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '0.4rem' }}>{l}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[['Partnerschaft', 'https://partnerschaft.in'], ['Ayushman', '#'], ['bksatpathy.com', 'https://bksatpathy.com']].map(([l, h]) => (
                <a key={l} href={h} style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textDecoration: 'none' }}>{l}</a>
              ))}
              {[['Privacy', '/privacy'], ['Terms', '/terms']].map(([l, h]) => (
                <Link key={l} href={h} style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textDecoration: 'none' }}>{l}</Link>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', margin: 0 }}>
              &copy; 2026 Barada. A venture of Barada (OPC) Private Limited.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
""")

# ────────────────────────────────────────────────────────────────
# 3. ACADEMY PAGE — app/academy/page.tsx
# Academy branding. "Learn AI. Build the Future." tagline.
# Dynamic course grid — no hardcoded count.
# ────────────────────────────────────────────────────────────────
w('app/academy/page.tsx', r"""import Link from 'next/link'
import type { Metadata } from 'next'
import Logo from '@/components/shared/Logo'
import { COURSES } from '@/data/courses'

export const metadata: Metadata = {
  title: 'Barada Academy \u2014 Learn AI. Build the Future.',
  description: 'Structured, self-paced professional courses on AI tools, productivity, and career skills. Free to learn. Verified certificates available.',
}

const red = '#E31E24'
const navy = '#0D183D'
const gold = '#D4AF37'

export default function AcademyPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: 0 }}>

      {/* ACADEMY NAV */}
      <nav style={{ background: navy, padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 500 }}>&larr; Barada.in</Link>
          <Link href="/academy" style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
            <Logo variant="academy" height={40} />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          {[['Courses', '/academy'], ['Learning Paths', '/academy'], ['AI Tools', '/academy'], ['Certificates', '/academy']].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.82rem' }}>{l}</Link>
          ))}
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.82rem' }}>Sign In</Link>
          <Link href="/register" style={{ background: red, color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700 }}>Start Free</Link>
        </div>
      </nav>

      {/* PROMO BAR */}
      <div style={{ background: red, padding: '0.625rem', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: '0.82rem', margin: 0 }}>
          <strong>Now Enrolling</strong> &mdash; All courses live &middot; Free to learn &middot; Certificate available &middot;{' '}
          <Link href="/register" style={{ color: gold, fontWeight: 700 }}>Start Today &rarr;</Link>
        </p>
      </div>

      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, #1A2B5E 100%)`, padding: '4.5rem 2rem 3.5rem', textAlign: 'center' }}>
        <p style={{ color: gold, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Barada Academy</p>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '0.5rem' }}>
          Learn AI.
        </h1>
        <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 900, color: gold, lineHeight: 1.15, marginBottom: '1.25rem' }}>
          Build the Future.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.85 }}>
          Structured, self-paced professional courses on AI tools, productivity, and career skills. Built by a practitioner. Immediately applicable to your work.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: red, color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>Start Learning Free &rarr;</Link>
          <Link href="/login" style={{ border: '2px solid rgba(255,255,255,0.25)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem' }}>Sign In</Link>
        </div>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
          {[['Free', 'To Enroll'], ['Self-Paced', 'No Deadlines'], ['\u20B9299', 'Per Certificate'], ['Practical', 'Immediately Applicable']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: gold, fontFamily: 'Poppins, sans-serif' }}>{v}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COURSE GRID — dynamic, no hardcoded count */}
      <section style={{ background: '#F9FAFB', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Course Catalogue</p>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: navy, margin: '0 0 0.5rem' }}>
              All courses &mdash; free to start
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Every course is free to enroll. Certificate available after passing the final assessment.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {COURSES.map((course) => (
              <div key={course.slug} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #E5E7EB', borderTop: `4px solid ${course.themeColor || red}` }}>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{course.icon}</span>
                    <span style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>&bull; Available Now</span>
                  </div>
                  <p style={{ color: '#6B7280', fontSize: '0.72rem', marginBottom: '0.25rem' }}>{course.category} &middot; {course.difficulty}</p>
                  <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: navy, fontSize: '0.95rem', marginBottom: '0.75rem', lineHeight: 1.4 }}>{course.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <span>{course.modules?.reduce((acc: number, m: {lessons?: unknown[]}) => acc + (m.lessons?.length || 0), 0) || 0} lessons</span>
                    <span>Certificate: \u20B9299</span>
                  </div>
                  <Link href="/register" style={{ display: 'block', background: navy, color: '#fff', padding: '0.625rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700, textAlign: 'center' }}>Start Learning Free &rarr;</Link>
                </div>
                <div style={{ background: 'rgba(22,163,74,0.05)', borderTop: '1px solid rgba(22,163,74,0.1)', padding: '0.5rem 1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>&#10003; Enroll instantly &middot; No payment required</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: navy, padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Ready to start learning?</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Create your free account and start any course today.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: gold, color: navy, padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 800 }}>Create Free Account &rarr;</Link>
          <Link href="/login" style={{ border: '2px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem' }}>Sign In</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#060b18', padding: '2rem', textAlign: 'center' }}>
        <Logo variant="academy" height={36} />
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', marginTop: '0.75rem' }}>&copy; 2026 Barada Academy &middot; A Barada Platform</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
          {[['Barada.in', '/'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>

    </div>
  )
}
""")

# ────────────────────────────────────────────────────────────────
# 4. LOGIN FORM — fix broken logo reference
# ────────────────────────────────────────────────────────────────
w('app/(auth)/login/LoginForm.tsx', r"""'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/shared/Logo'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawNext = searchParams.get('next') ?? '/dashboard'
  const next = rawNext.startsWith('/') && !rawNext.includes('://') ? rawNext : '/dashboard'
  const errorParam = searchParams.get('error')

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(
    errorParam === 'link_expired'         ? 'Your verification link has expired. Please request a new one.' :
    errorParam === 'auth_callback_failed' ? 'Authentication failed. Please try again.' : ''
  )
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    if (signInError) { setError('Incorrect email or password. Please try again.'); setLoading(false); return }
    router.push(next)
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      {/* Left panel */}
      <div style={{ background: '#0D183D', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'inline-block', lineHeight: 0 }}>
          <Logo variant="academy" height={44} />
        </Link>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['10 flagship courses \u2014 free to learn', 'Self-paced \u2014 no deadlines', 'Verified certificates', 'Track progress across devices'].map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#D4AF37', fontWeight: 700 }}>&#10003;</span>{f}
            </li>
          ))}
        </ul>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>Bengaluru, India &middot; barada.in</p>
      </div>
      {/* Right panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.82rem', display: 'block', marginBottom: '2rem' }}>&larr; Back to Barada.in</Link>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, fontSize: '1.875rem', color: '#0D183D', marginBottom: '0.5rem' }}>Welcome back.</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '2rem' }}>Sign in to continue your learning journey.</p>
          {error && <div role="alert" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '0.875rem', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>{error}</div>}
          <form onSubmit={handleLogin} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0D183D', marginBottom: '0.375rem' }}>Email address</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" inputMode="email" placeholder="you@example.com"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0D183D', marginBottom: '0.375rem' }}>Password</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ textAlign: 'right', marginTop: '0.375rem' }}>
                <Link href="/forgot-password" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0D183D', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
            </div>
            <button type="submit" disabled={loading} aria-busy={loading}
              style={{ background: '#E31E24', color: '#fff', padding: '0.875rem', borderRadius: 10, border: 'none', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Signing in\u2026' : 'Sign In \u2192'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', marginTop: '1.5rem' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ fontWeight: 700, color: '#0D183D', textDecoration: 'none' }}>Create one free &rarr;</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
""")

# ────────────────────────────────────────────────────────────────
# 5. DOCS — VISION.md, CTO_GUIDELINES.md, BARADA_MASTER_BLUEPRINT.md
# ────────────────────────────────────────────────────────────────
w('docs/VISION.md', r"""# Barada Platform — Vision Document

Version: 1.0 | August 2026 | Internal — Confidential

## Mission

To empower professionals and organisations with practical AI skills
and tools to build a better and smarter future.

## Vision

To build one of the world's most trusted AI-powered professional
transformation platforms — enabling individuals, organisations, and
communities to continuously learn, adapt, and succeed in an AI-driven world.

## Core Values

| Value | Meaning |
|---|---|
| Integrity | We build what we promise. We say what we mean. |
| Innovation | We embrace AI and new ideas without losing human judgment. |
| Impact | We measure success by what changes in people's lives. |
| Empowerment | We equip — not entertain. Every interaction must add value. |
| Excellence | We hold ourselves to the highest standard in everything we ship. |
| Collaboration | We build with our community, not just for them. |

## The 10-Year Ambition

By 2035, Barada should be:
- The most trusted AI skills platform in South and Southeast Asia
- A platform that has meaningfully improved the careers of 1 million+ professionals
- A multi-tenant infrastructure serving enterprise clients across 10+ countries
- An AI Factory producing verified, high-quality professional content at scale
- A community of practitioners who learn, share, and grow together
""")

w('docs/CTO_GUIDELINES.md', r"""# Barada Platform — CTO Engineering Guidelines

Version: 1.0 | August 2026 | Internal — Engineering Team

## 1. Architecture Authority

The BARADA_MASTER_BLUEPRINT.md is the single source of truth.
Any structural change requires a formal Architecture Review and written CTO approval.

## 2. Security Non-Negotiables

- getUser() always — never getSession() for auth decisions
- RLS on every table — no exceptions
- SUPABASE_SERVICE_ROLE_KEY — server-side only, never NEXT_PUBLIC_
- All API inputs validated with Zod before DB write
- No redirect to unvalidated URLs
- No secrets committed to git

## 3. Logo Rules

- No page references logo files directly — always use <Logo variant="..." />
- Corporate logo on corporate pages only
- Academy logo on Academy pages only
- Swapping a logo = replacing one file in public/logo/ — no code changes

## 4. Sprint Governance

No sprint closes without:
1. npm run type-check — zero errors
2. npm run build — successful
3. All routes verified manually
4. CHANGELOG.md updated

## 5. What Requires CTO Approval

Always:
- Architecture Package changes
- New third-party dependencies
- RBAC role changes
- Payment flow changes
- Certificate generation changes

Never needs approval:
- Bug fixes that don't change architecture
- Content/text updates
- TypeScript or ESLint fixes
""")

print('\n  Phase 1 implementation complete.')
print('\n  Files created:')
print('    components/shared/Logo.tsx')
print('    app/page.tsx                 (corporate homepage)')
print('    app/academy/page.tsx         (Academy sub-site)')
print('    app/(auth)/login/LoginForm.tsx (fixed logo reference)')
print('    docs/VISION.md')
print('    docs/CTO_GUIDELINES.md')
print('\n  Next steps:')
print('    1. Copy barada-logo.png, academy-logo.png, barada-icon.png to public/logo/')
print('    2. Run: npm run type-check')
print('    3. If zero errors: git add . && git commit && git push')
