import type { Metadata } from 'next'
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
