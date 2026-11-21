'use client'

import { useState } from 'react'

const navy = '#0A1A52'
const blue = '#0B63CE'
const orange = '#FF7A12'

const SERVICES = ['AI training', 'AI integration', 'AI support', 'Not sure yet']
const TEAM_SIZES = ['', '1 to 10', '11 to 50', '51 to 200', '201 to 1000', 'More than 1000']

const label = { display: 'block', color: navy, fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem' } as const
const field = { width: '100%', boxSizing: 'border-box', padding: '0.75rem 0.875rem', border: '1.5px solid #D1D5DB', borderRadius: 10, fontSize: '1rem', fontFamily: 'inherit', color: '#111827', background: '#fff' } as const

export default function EnquiryForm({ defaultService, defaultAudience }: { defaultService: string; defaultAudience: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('busy')
    setMsg('')
    const f = new FormData(e.currentTarget)
    const body = Object.fromEntries(f.entries())
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setState('done')
    } catch (err: any) {
      setMsg(err.message)
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', color: navy, fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.5rem' }}>Thank you, we have your enquiry</h3>
        <p style={{ color: '#4B5563', fontSize: '1rem', margin: 0 }}>A confirmation is on its way to your inbox. We reply within 2 business days with next steps.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: '2rem 1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: '1rem' }}>
        <div>
          <label style={label} htmlFor="audience">I am enquiring as</label>
          <select id="audience" name="audience" defaultValue={defaultAudience} required style={field}>
            <option value="business">A business</option>
            <option value="institute">An institute</option>
          </select>
        </div>
        <div>
          <label style={label} htmlFor="service">What do you need?</label>
          <select id="service" name="service" defaultValue={defaultService} required style={field}>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={label} htmlFor="name">Your name</label>
          <input id="name" name="name" required maxLength={120} autoComplete="name" style={field} />
        </div>
        <div>
          <label style={label} htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" style={field} />
        </div>
        <div>
          <label style={label} htmlFor="organisation">Organisation</label>
          <input id="organisation" name="organisation" required maxLength={200} autoComplete="organization" style={field} />
        </div>
        <div>
          <label style={label} htmlFor="role">Your role (optional)</label>
          <input id="role" name="role" maxLength={120} autoComplete="organization-title" style={field} />
        </div>
        <div>
          <label style={label} htmlFor="phone">Phone (optional)</label>
          <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" style={field} />
        </div>
        <div>
          <label style={label} htmlFor="city">City (optional)</label>
          <input id="city" name="city" maxLength={120} autoComplete="address-level2" style={field} />
        </div>
        <div>
          <label style={label} htmlFor="teamSize">People involved (optional)</label>
          <select id="teamSize" name="teamSize" defaultValue="" style={field}>
            {TEAM_SIZES.map((s) => <option key={s} value={s}>{s || 'Select'}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={label} htmlFor="message">Tell us what you want to achieve (optional)</label>
        <textarea id="message" name="message" rows={5} maxLength={4000} style={{ ...field, resize: 'vertical' }} />
      </div>

      {/* Honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <p style={{ color: '#69717D', fontSize: '0.75rem', margin: '1rem 0' }}>
        We use these details only to respond to your enquiry. See our <a href="/privacy" style={{ color: blue }}>Privacy Policy</a>.
      </p>

      <button type="submit" disabled={state === 'busy'} style={{ background: orange, color: navy, border: 'none', borderRadius: 10, padding: '0.875rem 2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: state === 'busy' ? 0.7 : 1 }}>
        {state === 'busy' ? 'Sending…' : 'Send enquiry'}
      </button>
      {state === 'error' && <p role="alert" style={{ color: '#B91C1C', fontSize: '0.875rem', margin: '0.75rem 0 0' }}>{msg}</p>}
    </form>
  )
}
