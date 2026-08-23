import Link from 'next/link'
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
