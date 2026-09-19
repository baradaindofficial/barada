#!/usr/bin/env python3
"""
Fixes all stub pages: encoding corruption, Logo component, Ayushman status.
Run from: C:\\Users\\dell\\barada-nextjs
"""
import os

BASE = r'C:\Users\dell\barada-nextjs'

def w(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Fixed: {rel}')

NAV = r"""      <nav style={{ background: '#0D183D', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'inline-block', lineHeight: 0 }}>
          <Logo variant="corporate" height={40} />
        </Link>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.82rem' }}>&larr; Back to Barada.in</Link>
      </nav>"""

FOOTER = r"""      <footer style={{ background: '#060b18', padding: '1.5rem 2rem', textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', margin: 0 }}>&copy; 2026 Barada. A venture of Barada (OPC) Private Limited.</p>
      </footer>"""

# ── About ──────────────────────────────────────────────────────
w('app/about/page.tsx', r"""import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'

export const metadata: Metadata = {
  title: 'About Barada',
  description: 'Learn about Barada — a professionally driven ecosystem of platforms built around AI, technology, business growth, and social impact.',
}

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <nav style={{ background: '#0D183D', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'inline-block', lineHeight: 0 }}>
          <Logo variant="corporate" height={40} />
        </Link>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.82rem' }}>&larr; Back to Barada.in</Link>
      </nav>

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

      <footer style={{ background: '#060b18', padding: '1.5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', margin: 0 }}>&copy; 2026 Barada. A venture of Barada (OPC) Private Limited.</p>
      </footer>
    </div>
  )
}
""")

# ── Ecosystem ───────────────────────────────────────────────────
w('app/ecosystem/page.tsx', r"""import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'

export const metadata: Metadata = {
  title: 'The Barada Ecosystem',
  description: 'One parent. Multiple platforms. Explore the Barada ecosystem of professional platforms.',
}

const VERTICALS = [
  { stage: 1, icon: '\uD83C\uDF93', name: 'Barada Academy', desc: 'AI and professional learning platform. Structured courses, self-paced, free to enroll.', status: 'Live', href: '/academy', color: '#E31E24' },
  { stage: 1, icon: '\uD83D\uDD17', name: 'Partnerschaft', desc: 'Pan-India B2B lean mediation for retail execution, BTL, procurement, and instore branding.', status: 'Live', href: 'https://partnerschaft.in', color: '#0D183D' },
  { stage: 2, icon: '\uD83E\uDD16', name: 'Technology', desc: 'AI-powered products and technology platforms for professional and enterprise use.', status: 'In Development', href: '/technology', color: '#475569' },
  { stage: 2, icon: '\uD83D\uDCCB', name: 'Consulting', desc: 'Corporate transformation, AI adoption advisory, and procurement excellence consulting.', status: 'In Development', href: '/consulting', color: '#475569' },
  { stage: 3, icon: '\uD83C\uDF31', name: 'Ayushman', desc: 'Social impact platform for autism awareness, caregiver support, and community building.', status: 'Planned', href: '#', color: '#6B7280' },
  { stage: 3, icon: '\u2728', name: 'Future Ventures', desc: 'New business units are added to the ecosystem as the vision expands. Architecture supports unlimited verticals.', status: 'Reserved', href: '#', color: '#6B7280' },
]

const STAGES = [
  { number: 1, label: 'Stage 1 \u2014 Live', desc: 'Active and operational', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
  { number: 2, label: 'Stage 2 \u2014 In Development', desc: 'Designed and being built', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  { number: 3, label: 'Stage 3 \u2014 Planned', desc: 'Researched and reserved', color: '#6B7280', bg: '#F9FAFB' },
]

export default function EcosystemPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh' }}>
      <nav style={{ background: '#0D183D', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'inline-block', lineHeight: 0 }}>
          <Logo variant="corporate" height={40} />
        </Link>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.82rem' }}>&larr; Back to Barada.in</Link>
      </nav>

      <section style={{ background: 'linear-gradient(135deg, #0D183D, #1A2B5E)', padding: '5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>The Barada Ecosystem</p>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', color: '#fff', marginBottom: '1rem' }}>One parent. Multiple platforms.</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 580, margin: '0 auto' }}>Each platform addresses a different professional need. All share the same founding values, brand, and infrastructure.</p>
      </section>

      {/* Relationship */}
      <section style={{ background: '#fff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.5rem', marginBottom: '1rem' }}>How the ecosystem works</h2>
          <p style={{ color: '#6B7280', lineHeight: 1.85, maxWidth: 680, margin: '0 auto 2rem' }}>Barada is the parent brand. It owns and governs a growing portfolio of independently operated platforms. Each platform has its own domain, brand identity, and user base — but all operate under the Barada umbrella of values and governance.</p>
          <div style={{ background: '#F9FAFB', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB', display: 'inline-block', textAlign: 'left', minWidth: 320 }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', textAlign: 'center', marginBottom: '1.5rem' }}>BARADA (Parent)</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              {['Academy', 'Technology', 'Consulting', 'Partnerschaft', 'Ayushman', '+ Future'].map(v => (
                <div key={v} style={{ background: '#fff', borderRadius: 8, padding: '0.5rem 0.75rem', border: '1px solid #E5E7EB', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{v}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Maturity */}
      <section style={{ background: '#F9FAFB', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Business maturity stages</h2>
          {STAGES.map(stage => (
            <div key={stage.number} style={{ background: stage.bg, borderRadius: 16, padding: '2rem', border: `1.5px solid ${stage.color}22`, marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ background: stage.color, color: '#fff', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0 }}>{stage.number}</span>
                <div>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', margin: 0 }}>{stage.label}</p>
                  <p style={{ color: '#6B7280', fontSize: '0.78rem', margin: 0 }}>{stage.desc}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {VERTICALS.filter(v => v.stage === stage.number).map(({ icon, name, desc, href, color }) => (
                  <div key={name} style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', border: '1.5px solid #E5E7EB', borderLeft: `4px solid ${color}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                      <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', margin: 0, fontSize: '0.9rem' }}>{name}</p>
                    </div>
                    <p style={{ color: '#6B7280', fontSize: '0.82rem', lineHeight: 1.65, marginBottom: '0.875rem' }}>{desc}</p>
                    {href !== '#' && (
                      <Link href={href} style={{ color: color, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>Visit {name} &rarr;</Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section style={{ background: '#0D183D', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.5rem', marginBottom: '2rem' }}>Ecosystem roadmap</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[['2025', 'Foundation', 'Academy live. Partnerschaft live.'], ['2026', 'Growth', 'Technology. Consulting. Resources.'], ['2027', 'Scale', 'Enterprise. Multi-tenant. API.'], ['2028+', 'Expansion', 'Global. Mobile. Agent Layer.']].map(([year, title, desc]) => (
              <div key={year} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ color: '#D4AF37', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Poppins, sans-serif', marginBottom: '0.25rem' }}>{year}</p>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: '#060b18', padding: '1.5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', margin: 0 }}>&copy; 2026 Barada. A venture of Barada (OPC) Private Limited.</p>
      </footer>
    </div>
  )
}
""")

# ── Contact ─────────────────────────────────────────────────────
w('app/contact/page.tsx', r"""import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'

export const metadata: Metadata = {
  title: 'Contact Barada',
  description: 'Get in touch with Barada for partnerships, consulting, media enquiries, or general questions.',
}

export default function ContactPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <nav style={{ background: '#0D183D', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'inline-block', lineHeight: 0 }}>
          <Logo variant="corporate" height={40} />
        </Link>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.82rem' }}>&larr; Back to Barada.in</Link>
      </nav>

      <section style={{ background: 'linear-gradient(135deg, #0D183D, #1A2B5E)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', color: '#fff', marginBottom: '1rem' }}>Get in Touch</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>For partnerships, consulting enquiries, media, or general questions.</p>
      </section>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { icon: '\uD83D\uDCE7', label: 'General Enquiries', value: 'hello@barada.in', href: 'mailto:hello@barada.in' },
            { icon: '\uD83C\uDF93', label: 'Academy Support', value: 'academy@barada.in', href: 'mailto:academy@barada.in' },
            { icon: '\uD83D\uDCBC', label: 'Business & Partnerships', value: 'partners@barada.in', href: 'mailto:partners@barada.in' },
            { icon: '\uD83D\uDCCD', label: 'Headquarters', value: 'Bengaluru, Karnataka, India', href: null },
          ].map(({ icon, label, value, href }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', border: '1.5px solid #E5E7EB' }}>
              <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.875rem' }}>{icon}</span>
              <p style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>{label}</p>
              {href ? (
                <a href={href} style={{ color: '#0D183D', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>{value}</a>
              ) : (
                <p style={{ color: '#0D183D', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>{value}</p>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: '#0D183D', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Response Time</p>
          <p style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.5rem' }}>We aim to respond within 2 business days.</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>Monday to Friday &middot; 9am to 6pm IST</p>
        </div>
      </div>

      <footer style={{ background: '#060b18', padding: '1.5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', margin: 0 }}>&copy; 2026 Barada. A venture of Barada (OPC) Private Limited.</p>
      </footer>
    </div>
  )
}
""")

# ── Privacy ─────────────────────────────────────────────────────
w('app/privacy/page.tsx', r"""import type { Metadata } from 'next'
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
""")

# ── Terms ───────────────────────────────────────────────────────
w('app/terms/page.tsx', r"""import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'

export const metadata: Metadata = {
  title: 'Terms of Use | Barada',
}

export default function TermsPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <nav style={{ background: '#0D183D', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'inline-block', lineHeight: 0 }}>
          <Logo variant="corporate" height={40} />
        </Link>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.82rem' }}>&larr; Back to Barada.in</Link>
      </nav>
      <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '2rem', marginBottom: '0.5rem' }}>Terms of Use</h1>
        <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: '2.5rem' }}>Last updated: August 2026</p>
        {[
          ['Acceptance', 'By accessing or using any Barada platform, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.'],
          ['Permitted Use', 'Barada Academy courses are for personal, non-commercial professional development. You may not reproduce, resell, or redistribute course content without written permission from Barada.'],
          ['Accounts', 'You are responsible for maintaining the security of your account. You must provide accurate information during registration. Barada reserves the right to suspend accounts that violate these terms.'],
          ['Certificates', 'Certificates are issued upon successful completion of the course assessment and payment of the certificate fee. Certificates are issued in the name provided at registration and cannot be transferred.'],
          ['Intellectual Property', 'All course content, including videos, slides, prompts, and materials, is the intellectual property of Barada (OPC) Private Limited. Unauthorised reproduction is prohibited.'],
          ['Limitation of Liability', 'Barada provides its platform on an as-is basis. We do not guarantee specific career outcomes. Our liability is limited to the amount paid for any certificate in the preceding 12 months.'],
          ['Governing Law', 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.'],
          ['Contact', 'For terms-related queries, contact legal@barada.in or write to Barada (OPC) Private Limited, Bengaluru, Karnataka, India.'],
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
""")

print('\nAll stub pages fixed.')
print('Files updated:')
print('  app/about/page.tsx     - Full About page with Leadership section')
print('  app/ecosystem/page.tsx - Relationship map + maturity stages + roadmap')
print('  app/contact/page.tsx   - Contact cards with email addresses')
print('  app/privacy/page.tsx   - Privacy policy with real content')
print('  app/terms/page.tsx     - Terms of use with real content')
print('\nRun: npm run type-check')
