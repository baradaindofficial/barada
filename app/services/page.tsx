import type { Metadata } from 'next'
import Link from 'next/link'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Barada is developing AI adoption advisory, procurement transformation consulting, and professional workshops \u2014 planned services, not yet open for engagements. Register your interest.',
  alternates: { canonical: 'https://barada.in/services' },
  openGraph: {
    title: 'Services | Barada',
    description: 'Barada is developing AI adoption advisory, procurement transformation consulting, and professional workshops \u2014 planned, not yet available.',
    url: 'https://barada.in/services',
    siteName: 'Barada',
    images: [{ url: '/og/barada-og.png', width: 1200, height: 630, alt: 'Barada' }],
    locale: 'en_IN',
    type: 'website',
  },
}

// NOTE for BK: pricing, typical engagement length, and delivery format
// (remote / in-person / hybrid) are intentionally left as "discuss on
// enquiry" below rather than invented. Send real figures and this becomes
// a one-line edit per service.
const SERVICES = [
  {
    icon: '\uD83E\uDD16',
    title: 'AI Adoption Advisory',
    whoFor: 'Organisations and teams bringing AI tools into real workflows for the first time, or stuck past an initial pilot.',
    problem: 'Most AI rollouts stall between "we tried ChatGPT once" and actual, repeatable use across a team \u2014 usually from unclear use cases, no rollout plan, or no one owning adoption.',
    deliverables: 'A practical adoption assessment, a prioritised use-case shortlist for your team, and a rollout plan grounded in what actually works day-to-day, not theory.',
    format: 'Discussed on enquiry \u2014 scope depends on team size and starting point.',
    nextStep: 'Register your interest with your team size and current AI usage; this service is planned, not yet open \u2014 we\u2019ll follow up once it is.',
  },
  {
    icon: '\uD83D\uDCCB',
    title: 'Procurement Transformation Consulting',
    whoFor: 'Procurement and GBS leaders redesigning process, digital tooling, or operating model.',
    problem: 'Procurement transformation initiatives often fail to stick because the process redesign isn\u2019t grounded in how the organisation actually buys \u2014 not in a generic best-practice template.',
    deliverables: 'Process design and digital transformation recommendations, drawing on BK Satpathy\u2019s hands-on procurement leadership experience at HCL, Dish TV, and Xiaomi India \u2014 named here as professional background, not as Barada clients.',
    format: 'Discussed on enquiry \u2014 scope depends on current state and objectives.',
    nextStep: 'Register your interest with your current procurement setup and what\u2019s not working; this service is planned, not yet open \u2014 we\u2019ll follow up once it is.',
  },
  {
    icon: '\uD83C\uDF93',
    title: 'Professional Workshops',
    whoFor: 'Teams and organisations wanting structured, live training rather than self-paced courses.',
    problem: 'Self-paced learning doesn\u2019t fit every team \u2014 some need a live, practitioner-led session with room for their own questions and context.',
    deliverables: 'A structured, practitioner-led workshop on AI tools, productivity, or career skills \u2014 the same material behind Barada Academy, delivered live and adapted to your team.',
    format: 'Discussed on enquiry \u2014 session length and group size flexible.',
    nextStep: 'Register your interest with your team size and topic; this service is planned, not yet open \u2014 we\u2019ll follow up once it is.',
  },
]

export default function ServicesPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <CorporateHeader />

      <section style={{ background: 'linear-gradient(135deg, #0D183D, #1A2B5E)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', color: '#fff', marginBottom: '1rem' }}>Services</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>AI adoption advisory, procurement transformation, and professional workshops &mdash; planned services, built on real corporate experience. Not yet open for engagements.</p>
        <p style={{ display: 'inline-block', marginTop: '1.25rem', background: 'rgba(212,175,55,0.15)', color: '#D4AF37', padding: '0.4rem 1rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em' }}>Coming Soon &mdash; Register Your Interest</p>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
          {SERVICES.map(({ icon, title, whoFor, problem, deliverables, format, nextStep }) => (
            <div key={title} style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>{icon}</span>
                <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.15rem', margin: 0 }}>{title}</h2>
              </div>
              <dl style={{ margin: 0, display: 'grid', gap: '1rem' }}>
                <div>
                  <dt style={{ fontSize: '0.68rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '0.25rem' }}>Who it&apos;s for</dt>
                  <dd style={{ margin: 0, color: '#374151', fontSize: '0.9rem', lineHeight: 1.7 }}>{whoFor}</dd>
                </div>
                <div>
                  <dt style={{ fontSize: '0.68rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '0.25rem' }}>The problem it addresses</dt>
                  <dd style={{ margin: 0, color: '#374151', fontSize: '0.9rem', lineHeight: 1.7 }}>{problem}</dd>
                </div>
                <div>
                  <dt style={{ fontSize: '0.68rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '0.25rem' }}>Proposed scope (planned, not yet confirmed)</dt>
                  <dd style={{ margin: 0, color: '#374151', fontSize: '0.9rem', lineHeight: 1.7 }}>{deliverables}</dd>
                </div>
                <div>
                  <dt style={{ fontSize: '0.68rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '0.25rem' }}>Format</dt>
                  <dd style={{ margin: 0, color: '#374151', fontSize: '0.9rem', lineHeight: 1.7 }}>{format}</dd>
                </div>
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #F3F4F6' }}>
                  <dt style={{ fontSize: '0.68rem', color: '#E31E24', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '0.25rem' }}>Coming Soon &mdash; Register Your Interest</dt>
                  <dd style={{ margin: 0, color: '#374151', fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 600 }}>{nextStep}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div style={{ background: '#0D183D', borderRadius: 16, padding: '2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.375rem', marginBottom: '0.75rem' }}>Coming Soon &mdash; Register Your Interest</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>These services are planned, not yet open for engagements. Tell us what you need and we&apos;ll follow up once they are.</p>
          <Link href="/contact" style={{ display: 'inline-block', background: '#E31E24', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>Register Your Interest &rarr;</Link>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '1rem' }}>or email info@barada.in directly</p>
        </div>
      </div>

      <CorporateFooter />
    </div>
  )
}
