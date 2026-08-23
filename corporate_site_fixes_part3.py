"""
corporate_site_fixes_part3.py
Part 3 of 5 — rewrites app/about/page.tsx, app/services/page.tsx, app/contact/page.tsx.
Run AFTER parts 1 and 2.
Run from repo root: py corporate_site_fixes_part3.py
"""
import os

def w(rel, content):
    path = os.path.join(*rel.split('/'))
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Wrote: {rel}')

w('app/about/page.tsx', r"""import type { Metadata } from 'next'
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
""")

w('app/services/page.tsx', r"""import type { Metadata } from 'next'
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
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>AI adoption advisory, procurement transformation, and professional workshops \u2014 built from real corporate experience.</p>
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
          <Link href="/contact" style={{ display: 'inline-block', background: '#E31E24', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>Contact Barada &rarr;</Link>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '1rem' }}>or email info@barada.in directly</p>
        </div>
      </div>

      <CorporateFooter />
    </div>
  )
}
""")

w('app/contact/page.tsx', r"""import type { Metadata } from 'next'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'

export const metadata: Metadata = {
  title: 'Contact Barada',
  description: 'Get in touch with Barada for partnerships, consulting, media enquiries, or general questions.',
  openGraph: {
    title: 'Contact Barada',
    description: 'Get in touch with Barada for partnerships, consulting, media enquiries, or general questions.',
    url: 'https://barada.in/contact',
    siteName: 'Barada',
    images: [{ url: '/logo/barada-logo.png', width: 1200, height: 630, alt: 'Barada' }],
    locale: 'en_IN',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <CorporateHeader />

      <section style={{ background: 'linear-gradient(135deg, #0D183D, #1A2B5E)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', color: '#fff', marginBottom: '1rem' }}>Get in Touch</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>For partnerships, consulting enquiries, media, or general questions.</p>
      </section>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { icon: '\uD83D\uDCE7', label: 'General Enquiries', value: 'info@barada.in', href: 'mailto:info@barada.in' },
            { icon: '\uD83C\uDF93', label: 'Academy Support', value: 'academy@barada.in', href: 'mailto:academy@barada.in' },
            { icon: '\uD83D\uDCBC', label: 'Business & Partnerships', value: 'business@partnerschaft.in', href: 'mailto:business@partnerschaft.in' },
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

      <CorporateFooter />
    </div>
  )
}
""")

print("Part 3 done: about, services, contact pages rewritten.")
