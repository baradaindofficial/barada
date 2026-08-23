"""
corporate_site_fixes.py
Barada Digital Platform — Corporate website audit implementation (approved items)

Per CTO approval on BARADA_CORPORATE_WEBSITE_IMPLEMENTATION_BRIEF.md:
  1. Shared Header/Footer components -> rolled out to all 6 corporate pages
  2. Services page rebuilt (was a stub with deprecated red + no shared Logo)
  3. Dead links removed: /resources, /community (not yet built)
  4. Single source of truth for ecosystem vertical data (was duplicated
     between Home and Ecosystem, already diverging)
  5. SEO metadata standardized: openGraph added where missing
  6. Branding fixes: deprecated #D11A1A -> #E31E24, invented #0D7340 removed

NOT touched (per CTO decisions):
  - app/(academy) empty scaffold — deferred, left untouched
  - Academy's distinct branded nav — kept intentionally (Logo policy v3.0)
  - /technology, /consulting — kept as FUTURE, inert where not yet linked

Run from repo root: py corporate_site_fixes.py
"""
import os

def w(rel, content):
    path = os.path.join(*rel.split('/'))
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Wrote: {rel}')

print("Implementing approved corporate website fixes...")

# ============================================================================
# data/ecosystem-verticals.ts — single source of truth
# ============================================================================
w('data/ecosystem-verticals.ts', r"""// Single source of truth for Barada ecosystem vertical data.
// Previously defined independently in app/page.tsx and app/ecosystem/page.tsx
// with diverging status labels and colors for the same items — see
// BARADA_CORPORATE_WEBSITE_IMPLEMENTATION_BRIEF.md Section 3/10.

export type VerticalStatus = 'live' | 'in_development' | 'planned'

export interface EcosystemVertical {
  icon: string
  name: string
  tagline: string
  desc: string
  href: string
  status: VerticalStatus
  color: string
  external?: boolean
}

export const STATUS_LABEL: Record<VerticalStatus, string> = {
  live: 'Active',
  in_development: 'In Development',
  planned: 'Planned',
}

export const ECOSYSTEM_VERTICALS: EcosystemVertical[] = [
  {
    icon: '\uD83C\uDF93',
    name: 'Barada Academy',
    tagline: 'AI & Professional Learning',
    desc: 'Structured professional courses on AI tools, productivity, and career skills. Free to learn.',
    href: '/academy',
    status: 'live',
    color: '#E31E24',
  },
  {
    icon: '\uD83D\uDD17',
    name: 'Partnerschaft',
    tagline: 'B2B Lean Mediation',
    desc: 'Pan-India B2B mediation for retail execution, BTL, procurement, and instore branding.',
    href: 'https://partnerschaft.in',
    status: 'live',
    color: '#0D183D',
    external: true,
  },
  {
    icon: '\uD83E\uDD16',
    name: 'Technology',
    tagline: 'AI Products & Platforms',
    desc: 'Building the next generation of AI-powered tools and technology platforms for professionals.',
    href: '/technology',
    status: 'in_development',
    color: '#475569',
  },
  {
    icon: '\uD83D\uDCCB',
    name: 'Consulting',
    tagline: 'Corporate Transformation',
    desc: 'AI adoption advisory, procurement transformation, and corporate excellence consulting.',
    href: '/consulting',
    status: 'in_development',
    color: '#475569',
  },
  {
    icon: '\uD83C\uDF31',
    name: 'Ayushman',
    tagline: 'Social Impact',
    desc: 'A platform for autism awareness, caregiver support, and community building across India.',
    href: '#',
    status: 'planned',
    color: '#475569',
  },
]
""")

# ============================================================================
# components/corporate/Header.tsx
# ============================================================================
w('components/corporate/Header.tsx', r"""import Link from 'next/link'
import Logo from '@/components/shared/Logo'

// Shared corporate nav — used by Home, About, Services, Contact, Ecosystem.
// Academy keeps its own distinct branded nav intentionally (see the
// documented "Logo policy (Architecture v3.0)" comment in
// components/shared/Logo.tsx) and does not use this component.
//
// /resources and /community are intentionally NOT linked here — they are
// not yet built (BARADA_CORPORATE_WEBSITE_IMPLEMENTATION_BRIEF.md, FUTURE).
// Re-add once real pages exist.
const NAV_LINKS = [
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Academy', href: '/academy' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function CorporateHeader() {
  return (
    <nav style={{ background: '#0D183D', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
        <Logo variant="corporate" height={40} />
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {NAV_LINKS.map(({ label, href }) => (
          <Link key={label} href={href} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>{label}</Link>
        ))}
        <Link href="/login" style={{ background: '#E31E24', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>Login</Link>
      </div>
    </nav>
  )
}
""")

# ============================================================================
# components/corporate/Footer.tsx
# ============================================================================
w('components/corporate/Footer.tsx', r"""import Link from 'next/link'
import Logo from '@/components/shared/Logo'

// Shared corporate footer — used by Home, About, Services, Contact, Ecosystem.
// /resources and /community links removed (not yet built — see
// BARADA_CORPORATE_WEBSITE_IMPLEMENTATION_BRIEF.md). /technology and
// /consulting kept inert (no href) rather than linked, since those pages
// don't exist yet either — matches the "in development" status honestly.
export default function CorporateFooter() {
  return (
    <footer style={{ background: '#060b18', padding: '3.5rem 2rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <Logo variant="footer" height={44} />
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', lineHeight: 1.7, marginTop: '0.75rem' }}>A professionally driven ecosystem of platforms built from real corporate experience.</p>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Corporate</p>
            {[['About', '/about'], ['Ecosystem', '/ecosystem'], ['Services', '/services'], ['Contact', '/contact']].map(([l, h]) => (
              <Link key={l} href={h} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '0.4rem' }}>{l}</Link>
            ))}
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Academy</p>
            {[['Barada Academy', '/academy'], ['Sign In', '/login'], ['Start Free', '/register']].map(([l, h]) => (
              <Link key={l} href={h} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '0.4rem' }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[['Partnerschaft', 'https://partnerschaft.in'], ['bksatpathy.com', 'https://bksatpathy.com']].map(([l, h]) => (
              <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textDecoration: 'none' }}>{l}</a>
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
  )
}
""")

print("\nPart 1 done: data file + 2 shared components written.")
