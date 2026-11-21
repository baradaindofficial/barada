'use client'

import { useState } from 'react'

export default function ClaimCertificateButton({ courseSlug }: { courseSlug: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  const [url, setUrl] = useState('')
  const [msg, setMsg] = useState('')

  async function claim() {
    setState('busy')
    setMsg('')
    try {
      const res = await fetch('/api/certificates/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setUrl(data.certificateUrl)
      setState('done')
    } catch (e: any) {
      setMsg(e.message)
      setState('error')
    }
  }

  const btn = { display: 'inline-block', background: '#FF7A12', color: '#0A1A52', padding: '0.7rem 1.4rem', borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer', textDecoration: 'none' } as const

  return (
    <div>
      {state === 'done' ? (
        <div>
          <a href={url} target="_blank" rel="noopener noreferrer" style={btn}>Download your certificate</a>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
            Also saved in your dashboard under My Certificates.
          </p>
        </div>
      ) : (
        <>
          <button onClick={claim} disabled={state === 'busy'} style={{ ...btn, opacity: state === 'busy' ? 0.7 : 1 }}>
            {state === 'busy' ? 'Preparing your certificate…' : 'Claim your free certificate'}
          </button>
          {state === 'error' && <p style={{ color: '#f87171', fontSize: '0.875rem', marginTop: '0.75rem' }}>{msg}</p>}
        </>
      )}
    </div>
  )
}
