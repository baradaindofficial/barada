import Link from 'next/link'
import Logo from '@/components/shared/Logo'
import { ECOSYSTEM_VERTICALS } from '@/data/ecosystem-verticals'

// Shared corporate footer — used by Home, About, Services, Contact, Ecosystem.
// /resources and /community links removed (not yet built — see
// BARADA_CORPORATE_WEBSITE_IMPLEMENTATION_BRIEF.md).
//
// Academy appears as one entry in the "Ecosystem" column, alongside
// Barada's other platforms, sourced from the same ECOSYSTEM_VERTICALS list
// used on /ecosystem so the two never drift out of sync.
//
// CTO reversal (2026-10-03): the 2026-09-27 decision to hide Academy from
// the homepage footer is superseded — Academy is now one of Barada's two
// primary routes and must be reachable from every page, including "/".
// `hideAcademy` is kept as a prop for flexibility but is no longer passed
// by any page.
interface CorporateFooterProps {
  hideAcademy?: boolean
}

export default function CorporateFooter({ hideAcademy = false }: CorporateFooterProps) {
  const footerVerticals = hideAcademy
    ? ECOSYSTEM_VERTICALS.filter((v) => v.name !== 'Barada Academy')
    : ECOSYSTEM_VERTICALS

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
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Ecosystem</p>
            {footerVerticals.map((v) =>
              v.external ? (
                <a key={v.name} href={v.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '0.4rem' }}>{v.name}</a>
              ) : v.href === '#' ? (
                <span key={v.name} style={{ display: 'block', color: 'rgba(255,255,255,0.25)', fontSize: '0.82rem', marginBottom: '0.4rem' }}>{v.name}</span>
              ) : (
                <Link key={v.name} href={v.href} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '0.4rem' }}>{v.name}</Link>
              )
            )}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href="https://bksatpathy.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', textDecoration: 'none' }}>bksatpathy.com</a>
            {[['Privacy', '/privacy'], ['Terms', '/terms']].map(([l, h]) => (
              <Link key={l} href={h} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', margin: 0 }}>
            &copy; 2026 Barada. A venture of Barada (OPC) Private Limited.
          </p>
        </div>
      </div>
    </footer>
  )
}
