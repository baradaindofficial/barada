import Link from 'next/link'
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
