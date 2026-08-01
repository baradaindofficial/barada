import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Barada — Innovate. Empower. Grow.',
  description: 'Barada Academy — India\'s AI & Professional Excellence Platform. Free professional courses with verified certificates.',
}

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: 0 }}>

      {/* NAV */}
      <nav style={{ background: '#0D183D', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, background: '#D11A1A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18 }}>B</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Poppins, sans-serif' }}>Barada</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.55rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Innovate · Empower · Grow</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem' }}>Sign In</Link>
          <Link href="/register" style={{ background: '#D11A1A', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>Get Started Free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: '#0D183D', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Bengaluru, India · Founded 2025</p>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '1rem' }}>
          Empowering professionals<br />
          <span style={{ color: '#D4AF37' }}>through knowledge.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
          Barada Academy is India's AI & Professional Excellence Platform. Free professional courses. Verified certificates. Built from 19+ years of real corporate experience.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: '#D11A1A', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>Start Learning Free →</Link>
          <Link href="/login" style={{ border: '2px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Sign In</Link>
        </div>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
          {[['10', 'Flagship Courses'], ['₹0', 'To Start Learning'], ['₹299', 'Per Certificate'], ['19+', 'Years Experience']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 900, color: '#D4AF37' }}>{v}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COURSES PREVIEW */}
      <section style={{ background: '#f8f9fa', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: '#D11A1A', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Flagship Courses</p>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0D183D', margin: '0.5rem 0' }}>10 professional courses. All free to learn.</h2>
            <p style={{ color: '#6B7280', fontSize: '1rem' }}>Self-paced · Verified certificates · Immediately applicable</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '💬', title: 'ChatGPT for Professionals', cat: 'AI Tools · Beginner', color: '#1A7F56', active: true },
              { icon: '✳️', title: 'Claude AI for Professionals', cat: 'AI Tools · Beginner', color: '#CC7740', active: true },
              { icon: '🛠️', title: 'AI Tools for Professionals', cat: 'AI Tools · Beginner', color: '#4A3BE8', active: true },
              { icon: '🧠', title: 'Mastery in Prompt Engineering', cat: 'AI Advanced · Intermediate', color: '#D11A1A', active: true },
              { icon: '⚡', title: 'Mastery in AI Productivity', cat: 'Productivity · Beginner', color: '#0D7340', active: true },
              { icon: '📊', title: 'Excel with AI', cat: 'Productivity Tools · Beginner', color: '#1D6F42', active: true },
            ].map(({ icon, title, cat, color, active }) => (
              <div key={title} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #E5E7EB', transition: 'box-shadow 0.2s' }}>
                <div style={{ background: color + '22', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{icon}</span>
                  {active && <span style={{ background: '#16a34a', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>● LIVE</span>}
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{cat}</p>
                  <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', fontSize: '1rem', marginBottom: '1rem' }}>{title}</h3>
                  <Link href="/register" style={{ display: 'block', background: '#0D183D', color: '#fff', padding: '0.625rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>Start Learning Free →</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/register" style={{ color: '#0D183D', fontWeight: 700, textDecoration: 'underline', fontSize: '0.9rem' }}>View all 10 courses →</Link>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section style={{ background: '#0D183D', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.25rem, 3vw, 2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.5, marginBottom: '1rem' }}>
            "To build one of India's most trusted Professional Excellence Platforms — enabling professionals to continuously learn, adapt, and succeed in an AI-driven world."
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Practical · Trustworthy · Affordable · Accessible · Excellence-first</p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#D11A1A', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Ready to advance your career?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '1rem' }}>Create your free account. Enroll in any flagship course. Start learning today.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: '#D4AF37', color: '#0D183D', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 800 }}>Create Free Account →</Link>
          <Link href="/login" style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Sign In</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#060b18', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>© 2025 Barada · A Barada India Initiative · Bengaluru, India 🇮🇳</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.75rem' }}>
          {[['Privacy Policy', '/privacy'], ['Terms of Use', '/terms'], ['Contact', '/contact']].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>

    </main>
  )
}
