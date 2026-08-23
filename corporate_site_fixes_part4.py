"""
corporate_site_fixes_part4.py
Part 4 of 5 — rewrites app/ecosystem/page.tsx.
Run AFTER parts 1, 2, 3.
Run from repo root: py corporate_site_fixes_part4.py
"""
import os

def w(rel, content):
    path = os.path.join(*rel.split('/'))
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Wrote: {rel}')

w('app/ecosystem/page.tsx', r"""import type { Metadata } from 'next'
import Link from 'next/link'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'
import { ECOSYSTEM_VERTICALS, STATUS_LABEL } from '@/data/ecosystem-verticals'

export const metadata: Metadata = {
  title: 'The Barada Ecosystem',
  description: 'One parent. Multiple platforms. Explore the Barada ecosystem of professional platforms.',
  openGraph: {
    title: 'The Barada Ecosystem',
    description: 'One parent. Multiple platforms. Explore the Barada ecosystem of professional platforms.',
    url: 'https://barada.in/ecosystem',
    siteName: 'Barada',
    images: [{ url: '/logo/barada-logo.png', width: 1200, height: 630, alt: 'Barada' }],
    locale: 'en_IN',
    type: 'website',
  },
}

const STAGES: { number: number; status: 'live' | 'in_development' | 'planned'; desc: string; color: string; bg: string }[] = [
  { number: 1, status: 'live', desc: 'Active and operational', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
  { number: 2, status: 'in_development', desc: 'Designed and being built', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  { number: 3, status: 'planned', desc: 'Researched and reserved', color: '#6B7280', bg: '#F9FAFB' },
]

export default function EcosystemPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh' }}>
      <CorporateHeader />

      <section style={{ background: 'linear-gradient(135deg, #0D183D, #1A2B5E)', padding: '5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>The Barada Ecosystem</p>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', color: '#fff', marginBottom: '1rem' }}>One parent. Multiple platforms.</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 580, margin: '0 auto' }}>Each platform addresses a different professional need. All share the same founding values, brand, and infrastructure.</p>
      </section>

      <section style={{ background: '#fff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.5rem', marginBottom: '1rem' }}>How the ecosystem works</h2>
          <p style={{ color: '#6B7280', lineHeight: 1.85, maxWidth: 680, margin: '0 auto 2rem' }}>Barada is the parent brand. It owns and governs a growing portfolio of independently operated platforms. Each platform has its own domain, brand identity, and user base &mdash; but all operate under the Barada umbrella of values and governance.</p>
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

      <section style={{ background: '#F9FAFB', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Business maturity stages</h2>
          {STAGES.map(stage => (
            <div key={stage.number} style={{ background: stage.bg, borderRadius: 16, padding: '2rem', border: `1.5px solid ${stage.color}22`, marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ background: stage.color, color: '#fff', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0 }}>{stage.number}</span>
                <div>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', margin: 0 }}>Stage {stage.number} &mdash; {STATUS_LABEL[stage.status]}</p>
                  <p style={{ color: '#6B7280', fontSize: '0.78rem', margin: 0 }}>{stage.desc}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {ECOSYSTEM_VERTICALS.filter(v => v.status === stage.status).map(({ icon, name, desc, href, color, external }) => (
                  <div key={name} style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', border: '1.5px solid #E5E7EB', borderLeft: `4px solid ${color}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                      <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', margin: 0, fontSize: '0.9rem' }}>{name}</p>
                    </div>
                    <p style={{ color: '#6B7280', fontSize: '0.82rem', lineHeight: 1.65, marginBottom: '0.875rem' }}>{desc}</p>
                    {href !== '#' && (
                      external ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: color, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>Visit {name} &rarr;</a>
                      ) : (
                        <Link href={href} style={{ color: color, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>Visit {name} &rarr;</Link>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

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

      <CorporateFooter />
    </div>
  )
}
""")

print("Part 4 done: ecosystem page rewritten.")
