#!/usr/bin/env python3
"""
CTO Gate Review Fix
Fixes: corporate homepage, academy page, broken routes, redirect loop
Run from: C:\\Users\\dell\\barada-nextjs
"""
import os, json

BASE = r'C:\Users\dell\barada-nextjs'

def w(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Created: {rel}')

# ── FIX 1: vercel.json — remove /academy redirect loop ──────────────
vpath = os.path.join(BASE, 'vercel.json')
with open(vpath, encoding='utf-8') as f:
    vdata = json.load(f)

# Remove the /academy -> /academy/ redirect that causes the loop
vdata['redirects'] = [
    r for r in vdata.get('redirects', [])
    if not (r.get('source') == '/academy' and r.get('destination') == '/academy/')
]
with open(vpath, 'w', encoding='utf-8') as f:
    json.dump(vdata, f, indent=2)
print('Fixed: vercel.json (removed /academy redirect loop)')

# ── FIX 2: Corporate homepage app/page.tsx ───────────────────────────
w('app/page.tsx', r"""import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Barada — Innovate. Empower. Grow.',
  description: 'Barada is a growing ecosystem of professional platforms — AI learning, B2B solutions, consulting, and community impact. Built from 19+ years of real corporate experience.',
}

const NAV_LINKS = [
  { label: 'Academy', href: '/academy' },
  { label: 'Services', href: '/services' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const VERTICALS = [
  {
    icon: '🎓',
    name: 'Barada Academy',
    tagline: 'AI & Professional Excellence Platform',
    desc: 'Structured, self-paced professional courses on AI tools, productivity, and career skills. Free to learn. Certificates ₹299.',
    href: '/academy',
    cta: 'Start Learning Free →',
    color: '#D11A1A',
    status: 'Live',
  },
  {
    icon: '🔗',
    name: 'Partnerschaft',
    tagline: 'B2B Lean Mediator · Pan-India',
    desc: 'Pan-India B2B mediation for retail execution — BTL, printing, fixtures, gifting, instore branding, and procurement support.',
    href: 'https://partnerschaft.in',
    cta: 'Visit Partnerschaft →',
    color: '#0D183D',
    status: 'Live',
  },
  {
    icon: '👤',
    name: 'BKSatpathy.com',
    tagline: 'Founder Portfolio & Consulting',
    desc: 'Professional portfolio of BK Satpathy — 19+ years of corporate leadership in procurement, retail, and AI adoption.',
    href: 'https://bksatpathy.com',
    cta: 'Visit BKSatpathy.com →',
    color: '#374151',
    status: 'Live',
  },
  {
    icon: '🌱',
    name: 'Ayushman.world',
    tagline: 'Autism & Social Impact Initiative',
    desc: 'A platform for autism awareness, caregiver support, and community building across India. Rooted in personal experience.',
    href: '#',
    cta: 'Coming Soon',
    color: '#0D7340',
    status: 'Soon',
  },
]

const SERVICES = [
  { icon: '🤖', title: 'AI Adoption Advisory', desc: 'Structured AI adoption roadmaps for organisations. Tool selection, workflow integration, and 90-day implementation plans.' },
  { icon: '🔗', title: 'Procurement Consulting', desc: 'Procurement process design and vendor governance. P2P optimisation from 19+ years of real practice.' },
  { icon: '🎤', title: 'Professional Workshops', desc: 'Half-day and full-day workshops for teams on AI tools, productivity, and career development.' },
]

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: 0, color: '#111' }}>

      {/* NAV */}
      <nav style={{ background: '#0D183D', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: '#D11A1A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 20 }}>B</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2 }}>Barada</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Innovate · Empower · Grow</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>{label}</Link>
          ))}
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.875rem' }}>Sign In</Link>
          <Link href="/register" style={{ background: '#D11A1A', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>Get Started Free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0D183D 0%, #1A2B5E 100%)', padding: '6rem 2rem 5rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Bengaluru, India · Founded 2025</p>
        <h1 style={{ fontSize: 'clamp(2.25rem,5vw,4rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '1.25rem', fontFamily: 'Poppins, system-ui, sans-serif' }}>
          One vision.<br /><span style={{ color: '#D4AF37' }}>Multiple platforms.</span><br />Unlimited impact.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.85 }}>
          Barada is a growing ecosystem of professional platforms — AI learning, B2B solutions, and community impact — built from 19+ years of real corporate experience.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/academy" style={{ background: '#D11A1A', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>Explore Barada Academy →</Link>
          <Link href="/ecosystem" style={{ border: '2px solid rgba(255,255,255,0.25)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Our Ecosystem</Link>
        </div>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '3.5rem', flexWrap: 'wrap' }}>
          {[['4', 'Platforms'], ['10', 'Flagship Courses'], ['19+', 'Years Experience'], ['₹0', 'To Start Learning']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D4AF37', fontFamily: 'Poppins, sans-serif' }}>{v}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.04em' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IS BARADA */}
      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#D11A1A', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Who We Are</p>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#0D183D', marginBottom: '1.25rem' }}>Barada is not just a learning platform.</h2>
          <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.85, maxWidth: 700, margin: '0 auto 1rem' }}>
            It is a professional ecosystem — a parent brand housing multiple platforms that together help professionals learn, grow, and build sustainable careers and businesses in an AI-driven world.
          </p>
          <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.85, maxWidth: 700, margin: '0 auto 2rem' }}>
            Founded by BK Satpathy — Guinness World Record holder, Rutgers University certified, IIM Kozhikode educated — with a mission to make professional excellence accessible to every working professional in India.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/about" style={{ background: '#0D183D', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>About the Founder →</Link>
            <Link href="/ecosystem" style={{ border: '2px solid #0D183D', color: '#0D183D', padding: '0.75rem 1.75rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>The Ecosystem →</Link>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section style={{ background: '#0D183D', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Our Vision</p>
          <blockquote style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.1rem,2.5vw,1.75rem)', fontWeight: 700, color: '#fff', lineHeight: 1.6, margin: '0 0 1rem' }}>
            "To build one of India's most trusted Professional Excellence Platforms — enabling professionals to continuously learn, adapt, and succeed in an AI-driven world."
          </blockquote>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>Practical · Trustworthy · Affordable · Accessible · Excellence-first</p>
        </div>
      </section>

      {/* ECOSYSTEM — 4 VERTICALS */}
      <section style={{ background: '#F9FAFB', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#D11A1A', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>The Barada Ecosystem</p>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#0D183D', margin: 0 }}>Four platforms. One parent brand.</h2>
            <p style={{ color: '#6B7280', marginTop: '0.75rem' }}>Each platform addresses a different professional need. All share the same founding values.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {VERTICALS.map(({ icon, name, tagline, desc, href, cta, color, status }) => (
              <div key={name} style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', border: '1.5px solid #E5E7EB', borderTop: `4px solid ${color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{icon}</span>
                  <span style={{ background: status === 'Live' ? 'rgba(22,163,74,0.1)' : '#F3F4F6', color: status === 'Live' ? '#16a34a' : '#6B7280', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{status === 'Live' ? '● Active' : '⏳ Soon'}</span>
                </div>
                <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{name}</h3>
                <p style={{ color: color, fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.75rem' }}>{tagline}</p>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{desc}</p>
                {status === 'Live' ? (
                  <Link href={href} style={{ display: 'block', background: color, color: '#fff', padding: '0.625rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700, textAlign: 'center' }}>{cta}</Link>
                ) : (
                  <div style={{ display: 'block', background: '#F3F4F6', color: '#9CA3AF', padding: '0.625rem', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, textAlign: 'center' }}>{cta}</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/ecosystem" style={{ color: '#0D183D', fontWeight: 700, textDecoration: 'underline', fontSize: '0.9rem' }}>View full ecosystem →</Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#D11A1A', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Professional Services</p>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#0D183D', margin: 0 }}>Consulting from a practitioner.</h2>
            <p style={{ color: '#6B7280', marginTop: '0.75rem' }}>19+ years of corporate experience — available as consulting and advisory.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {SERVICES.map(({ icon, title, desc }) => (
              <div key={title} style={{ background: '#F9FAFB', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
                <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: '#0D183D', fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/contact" style={{ background: '#0D183D', color: '#fff', padding: '0.75rem 2rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>Get in Touch →</Link>
          </div>
        </div>
      </section>

      {/* ACADEMY CTA */}
      <section style={{ background: 'linear-gradient(135deg, #0D183D, #1A2B5E)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '3rem 2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '0.25rem 0.875rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 28, height: 28, background: '#D11A1A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 14 }}>B</div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 700 }}>Barada Academy</span>
          </div>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Master AI. Advance Your Career.</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.8 }}>10 flagship professional courses. Free to learn. Verified certificates ₹299. Self-paced — no deadlines.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/academy" style={{ background: '#D4AF37', color: '#0D183D', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 800 }}>Explore the Academy →</Link>
            <Link href="/register" style={{ border: '2px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Create Free Account</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#060b18', padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 32, height: 32, background: '#D11A1A', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>B</div>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>Barada</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', lineHeight: 1.7 }}>A growing ecosystem of professional platforms built from real corporate experience.</p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Platforms</p>
              {[['Barada Academy', '/academy'], ['Partnerschaft', 'https://partnerschaft.in'], ['BKSatpathy.com', 'https://bksatpathy.com'], ['Ayushman.world', '#']].map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '0.4rem' }}>{l}</Link>
              ))}
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Company</p>
              {[['About', '/about'], ['Ecosystem', '/ecosystem'], ['Services', '/services'], ['Contact', '/contact']].map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '0.4rem' }}>{l}</Link>
              ))}
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Academy</p>
              {[['All Courses', '/academy'], ['Login', '/login'], ['Register', '/register'], ['Dashboard', '/dashboard']].map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '0.4rem' }}>{l}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>© 2025 Barada · A Barada India Initiative · Bengaluru, India 🇮🇳</p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {[['Privacy', '/privacy'], ['Terms', '/terms']].map(([l, h]) => (
                <Link key={l} href={h} style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textDecoration: 'none' }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
""")

# ── FIX 3: Academy page app/academy/page.tsx ─────────────────────────
w('app/academy/page.tsx', r"""import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Barada Academy — 10 Flagship AI Courses | Free to Learn',
  description: 'Structured, self-paced professional courses on AI tools, productivity, and career skills. Free to learn. Verified certificates ₹299.',
}

const COURSES = [
  { icon: '💬', title: 'ChatGPT for Professionals', cat: 'AI Tools · Beginner', dur: '3h 20m', lessons: 17, color: '#1A7F56', status: 'active' },
  { icon: '✳️', title: 'Claude AI for Professionals', cat: 'AI Tools · Beginner', dur: '2h 45m', lessons: 13, color: '#CC7740', status: 'active' },
  { icon: '🛠️', title: 'AI Tools for Professionals', cat: 'AI Tools · Beginner', dur: '4h 10m', lessons: 14, color: '#4A3BE8', status: 'active' },
  { icon: '🧠', title: 'Mastery in Prompt Engineering', cat: 'AI Advanced · Intermediate', dur: '3h 50m', lessons: 16, color: '#D11A1A', status: 'active' },
  { icon: '⚡', title: 'Mastery in AI Productivity', cat: 'Productivity · Beginner', dur: '3h 30m', lessons: 15, color: '#0D7340', status: 'active' },
  { icon: '📊', title: 'Excel with AI', cat: 'Productivity Tools · Beginner', dur: '3h 15m', lessons: 14, color: '#1D6F42', status: 'active' },
  { icon: '📽️', title: 'PowerPoint with AI', cat: 'Productivity Tools · Beginner', dur: '2h 50m', lessons: 13, color: '#B7472A', status: 'active' },
  { icon: '💼', title: 'LinkedIn Profile Optimisation', cat: 'Career Development · Beginner', dur: '2h 20m', lessons: 13, color: '#0077B5', status: 'active' },
  { icon: '📄', title: 'Resume Building with AI', cat: 'Career Development · Beginner', dur: '2h 40m', lessons: 13, color: '#0D183D', status: 'active' },
  { icon: '🤖', title: 'Mastery in Artificial Intelligence', cat: 'AI Fundamentals · Intermediate', dur: '5h 30m', lessons: 17, color: '#6B21A8', status: 'active' },
]

export default function AcademyPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: 0 }}>

      {/* ACADEMY NAV */}
      <nav style={{ background: '#0D183D', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.78rem' }}>← Barada.in</Link>
          <Link href="/academy" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: '#D11A1A', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16 }}>B</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>Barada Academy</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Learn AI. Build the Future.</div>
            </div>
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.875rem' }}>Sign In</Link>
          <Link href="/register" style={{ background: '#D11A1A', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>Get Started Free</Link>
        </div>
      </nav>

      {/* PROMO BANNER */}
      <div style={{ background: '#D11A1A', padding: '0.625rem', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: '0.82rem', margin: 0 }}>
          <strong>Now Enrolling</strong> — All 10 flagship courses are live · Free to learn · Certificate ₹299 · <Link href="/register" style={{ color: '#D4AF37', fontWeight: 700 }}>Start Today →</Link>
        </p>
      </div>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0D183D, #1A2B5E)', padding: '4.5rem 2rem 3.5rem', textAlign: 'center' }}>
        <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Barada Academy</p>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '1rem' }}>
          10 flagship courses.<br /><span style={{ color: '#D4AF37' }}>Free to learn.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.85 }}>
          Structured, self-paced professional courses on AI tools, productivity, and career skills. Built by a practitioner — immediately applicable to your work.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: '#D11A1A', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>Start Learning Now →</Link>
          <Link href="/login" style={{ border: '2px solid rgba(255,255,255,0.25)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem' }}>Sign In</Link>
        </div>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
          {[['10', 'Flagship Courses'], ['₹0', 'To Enroll'], ['₹299', 'Per Certificate'], ['4', 'Modules Each']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D4AF37', fontFamily: 'Poppins, sans-serif' }}>{v}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATUS BAR */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0D7340' }}>All 10 courses available now — start immediately</span>
        </div>
        <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>Free to learn · Certificate ₹299 on completion · Self-paced</span>
      </div>

      {/* COURSES GRID */}
      <section style={{ background: '#F9FAFB', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: '#0D183D', margin: '0 0 0.5rem' }}>All 10 flagship courses</h2>
            <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Every course is free to start. Certificate available for ₹299 after passing the final exam.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {COURSES.map(({ icon, title, cat, dur, lessons, color }) => (
              <div key={title} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #E5E7EB', borderTop: `4px solid ${color}` }}>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                    <span style={{ fontSize: '2rem' }}>{icon}</span>
                    <span style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>● Available Now</span>
                  </div>
                  <p style={{ color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{cat}</p>
                  <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: '#0D183D', fontSize: '1rem', marginBottom: '0.75rem', lineHeight: 1.35 }}>{title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#9CA3AF', marginBottom: '1.25rem' }}>
                    <span>⏱ {dur}</span>
                    <span>📚 {lessons} lessons</span>
                    <span>🏅 Certificate ₹299</span>
                  </div>
                  <Link href="/register" style={{ display: 'block', background: '#0D183D', color: '#fff', padding: '0.625rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700, textAlign: 'center' }}>Start Learning Free →</Link>
                </div>
                <div style={{ background: 'rgba(22,163,74,0.05)', borderTop: '1px solid rgba(22,163,74,0.1)', padding: '0.5rem 1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>✓ Enroll instantly · No payment required</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0D183D', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Ready to start learning?</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Create your free account and start any course today.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: '#D4AF37', color: '#0D183D', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 800 }}>Create Free Account →</Link>
          <Link href="/login" style={{ border: '2px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem' }}>Sign In</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#060b18', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>© 2025 Barada Academy · A Barada India Initiative · Bengaluru, India 🇮🇳</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.75rem' }}>
          {[['Barada.in', '/'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>

    </div>
  )
}
""")

# ── FIX 4: Stub pages for /privacy, /terms, /contact ─────────────────
for slug, title, body in [
    ('privacy', 'Privacy Policy', 'Our privacy policy will be published here. Contact academy@barada.in for any privacy queries.'),
    ('terms', 'Terms of Use', 'Our terms of use will be published here. Contact academy@barada.in for any queries.'),
    ('contact', 'Contact Barada', 'Reach us at info@barada.in or academy@barada.in. We are based in Bengaluru, India.'),
    ('about', 'About Barada', 'Barada is a professional ecosystem founded by BK Satpathy — 19+ years of corporate experience in procurement, retail, and AI adoption. Based in Bengaluru, India.'),
    ('ecosystem', 'The Barada Ecosystem', 'Barada houses four platforms: Barada Academy (AI learning), Partnerschaft (B2B mediation), BKSatpathy.com (founder portfolio), and Ayushman.world (social impact).'),
    ('services', 'Services', 'Barada offers AI adoption advisory, procurement consulting, and professional workshops. Contact info@barada.in to discuss your requirements.'),
]:
    w(f'app/{slug}/page.tsx', f"""import type {{ Metadata }} from 'next'
import Link from 'next/link'

export const metadata: Metadata = {{
  title: '{title} | Barada',
}}

export default function Page() {{
  return (
    <div style={{{{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}}}>
      <nav style={{{{ background: '#0D183D', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}}}>
        <Link href="/" style={{{{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}}}>
          <div style={{{{ width: 32, height: 32, background: '#D11A1A', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}}}>B</div>
          <span style={{{{ color: '#fff', fontWeight: 800 }}}}>Barada</span>
        </Link>
      </nav>
      <div style={{{{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}}}>
        <h1 style={{{{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '2rem', marginBottom: '1.5rem' }}}}>{title}</h1>
        <p style={{{{ color: '#6B7280', lineHeight: 1.8, fontSize: '1rem' }}}}>{body}</p>
        <Link href="/" style={{{{ display: 'inline-block', marginTop: '2rem', color: '#0D183D', fontWeight: 700 }}}}>← Back to Barada.in</Link>
      </div>
    </div>
  )
}}
""")

print('\n✅ All files created successfully.')
print('\nFiles changed:')
print('  app/page.tsx          — Corporate Barada homepage')
print('  app/academy/page.tsx  — Academy landing page')
print('  app/privacy/page.tsx  — Privacy Policy stub')
print('  app/terms/page.tsx    — Terms of Use stub')
print('  app/contact/page.tsx  — Contact stub')
print('  app/about/page.tsx    — About Barada stub')
print('  app/ecosystem/page.tsx — Ecosystem stub')
print('  app/services/page.tsx  — Services stub')
print('  vercel.json           — Removed /academy redirect loop')
print('\nRoot cause of /academy redirect loop:')
print('  vercel.json had: { source: "/academy", destination: "/academy/" }')
print('  But no app/academy/page.tsx existed.')
print('  This caused: /academy -> /academy/ -> 404 -> loop')
print('\nNext step: python gate_review_fix.py then git push')
