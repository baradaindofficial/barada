import type { Metadata } from 'next'
import Link from 'next/link'
import CorporateHeader from '@/components/corporate/Header'
import CorporateFooter from '@/components/corporate/Footer'
import EnquiryForm from '@/components/corporate/EnquiryForm'

export const metadata: Metadata = {
  title: 'Enquire: AI Training, Integration and Support',
  description:
    'Businesses and institutes: enquire with Barada about AI training, AI integration and AI support. Tell us what you need and we respond within 2 business days.',
  alternates: { canonical: 'https://barada.in/enquire' },
  openGraph: {
    title: 'Enquire with Barada: AI Training, Integration and Support',
    description:
      'Businesses and institutes: enquire about AI training, AI integration and AI support. We respond within 2 business days.',
    url: 'https://barada.in/enquire',
    siteName: 'Barada',
    images: [{ url: '/og/barada-og.png', width: 1200, height: 630, alt: 'Barada' }],
    locale: 'en_IN',
    type: 'website',
  },
}

const navy = '#0A1A52'
const blue = '#0B63CE'
const orange = '#FF7A12'

type Service = {
  key: string
  title: string
  forWho: string
  what: string
  include: string[]
}

const SERVICES: Service[] = [
  {
    key: 'AI training',
    title: 'AI training',
    forWho: 'Teams, departments and institutes that want people confident with everyday AI tools.',
    what: 'Practical, role-based training and workshops built around real workplace tasks, with QORVIAN courses and verifiable certificates. Institutes can also ask about course content for students and support for faculty.',
    include: ['Who will be trained and how many', 'Tools they use today', 'Preferred format: live workshop, self-paced, or both', 'Target dates'],
  },
  {
    key: 'AI integration',
    title: 'AI integration',
    forWho: 'Businesses that want AI built into how work actually gets done.',
    what: 'Finding the processes where AI and automation pay off, then designing and rolling out the workflow, with a focus on procurement, finance and operations teams.',
    include: ['The process or function you want to improve', 'Systems and tools involved', 'What success would look like', 'Any data or security constraints'],
  },
  {
    key: 'AI support',
    title: 'AI support',
    forWho: 'Organisations already using AI that want it to work reliably and safely.',
    what: 'Ongoing help after rollout: answering team questions, improving prompts and workflows, usage guidelines and responsible-AI practices, and refresher sessions.',
    include: ['What you already use', 'Where people are getting stuck', 'Team size', 'How often you would want support'],
  },
]

const STEPS: [string, string][] = [
  ['Enquire', 'Fill in the short form below, or call or email us. Tell us what you need.'],
  ['Discovery call', 'A short call to understand your team, tools and goals.'],
  ['Written scope', 'A clear proposal: what we will do, timeline and cost.'],
  ['Pilot, then scale', 'Start small with a pilot, review results, then extend.'],
]

const SERVICE_NAMES = ['AI training', 'AI integration', 'AI support', 'Not sure yet']

export default function EnquirePage({ searchParams }: { searchParams?: { service?: string; who?: string } }) {
  const defaultService = SERVICE_NAMES.includes(searchParams?.service ?? '') ? (searchParams!.service as string) : 'AI training'
  const defaultAudience = searchParams?.who === 'institute' ? 'institute' : 'business'
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <CorporateHeader />

      <section style={{ background: `linear-gradient(135deg, ${navy}, #123C8F)`, padding: '5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: orange, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem' }}>For businesses and institutes</p>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#fff', margin: '0 auto 1rem', maxWidth: 760, lineHeight: 1.15 }}>
          Work with Barada on AI training, integration and support
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: 600, margin: '0 auto' }}>
          We are scoping first pilot engagements. Tell us what you need and we reply within 2 business days with next steps.
        </p>
        <a href="#enquiry-form" style={{ display: 'inline-block', marginTop: '1.5rem', background: orange, color: navy, padding: '0.8rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>Go to the enquiry form &darr;</a>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '1.5rem' }}>
          {SERVICES.map((s) => (
            <div key={s.key} style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', border: '1.5px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', color: navy, fontWeight: 800, fontSize: '1.25rem', margin: '0 0 0.5rem' }}>{s.title}</h2>
              <p style={{ color: blue, fontWeight: 600, fontSize: '0.875rem', margin: '0 0 0.75rem' }}>{s.forWho}</p>
              <p style={{ color: '#4B5563', fontSize: '0.875rem', lineHeight: 1.7, margin: '0 0 1rem' }}>{s.what}</p>
              <p style={{ color: '#69717D', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 0.4rem' }}>Helpful to include</p>
              <ul style={{ color: '#4B5563', fontSize: '0.875rem', lineHeight: 1.7, margin: '0 0 1.25rem', paddingLeft: '1.1rem', flex: 1 }}>
                {s.include.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <div>
                <a href={`/enquire?service=${encodeURIComponent(s.key)}#enquiry-form`} style={{ display: 'inline-block', background: orange, color: navy, padding: '0.7rem 1.25rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>Enquire about {s.title}</a>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', color: navy, fontWeight: 800, fontSize: '1.5rem', textAlign: 'center', margin: '4rem 0 1.5rem' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '1rem' }}>
          {STEPS.map(([t, d], i) => (
            <div key={t} style={{ background: '#fff', borderRadius: 14, padding: '1.25rem', border: '1.5px solid #E5E7EB' }}>
              <p style={{ color: orange, fontWeight: 800, fontSize: '0.875rem', margin: '0 0 0.3rem' }}>STEP {i + 1}</p>
              <p style={{ color: navy, fontWeight: 700, margin: '0 0 0.3rem' }}>{t}</p>
              <p style={{ color: '#4B5563', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>

        <h2 id="enquiry-form" style={{ fontFamily: 'Poppins, system-ui, sans-serif', color: navy, fontWeight: 800, fontSize: '1.5rem', textAlign: 'center', margin: '4rem 0 1.5rem', scrollMarginTop: 90 }}>Send us your enquiry</h2>
        <div style={{ maxWidth: 760, margin: '0 auto 3rem' }}>
          <EnquiryForm key={`${defaultService}-${defaultAudience}`} defaultService={defaultService} defaultAudience={defaultAudience} />
        </div>

        <div style={{ background: navy, borderRadius: 16, padding: '2rem', textAlign: 'center', marginTop: 0 }}>
          <p style={{ color: orange, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Prefer to talk?</p>
          <p style={{ color: '#fff', fontSize: '1rem', margin: '0 0 0.4rem' }}>
            Call <a href="tel:+919113283848" style={{ color: '#fff', fontWeight: 700 }}>+91 91132 83848</a> or write to{' '}
            <a href="mailto:info@barada.in" style={{ color: '#fff', fontWeight: 700 }}>info@barada.in</a>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', margin: 0 }}>Monday to Friday &middot; 9am to 6pm IST</p>
        </div>
        <p style={{ color: '#69717D', fontSize: '0.875rem', textAlign: 'center', marginTop: '1.5rem' }}>
          Individual learner? <Link href="/qorvian" style={{ color: blue, fontWeight: 700 }}>Start free on QORVIAN</Link>.
        </p>
      </div>

      <CorporateFooter />
    </div>
  )
}
