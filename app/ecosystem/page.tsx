import type { Metadata } from 'next'
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
