'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyForm() {
  const router = useRouter()
  const [id, setId] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = id.trim()
    if (v) router.push('/verify/' + encodeURIComponent(v))
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <label htmlFor="cert" style={{ position: 'absolute', left: '-9999px' }}>Certificate ID</label>
      <input
        id="cert"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Enter certificate ID"
        required
        style={{ flex: '1 1 260px', padding: '0.875rem 1rem', border: '1.5px solid #D1D5DB', borderRadius: 10, fontSize: '1rem', fontFamily: 'inherit' }}
      />
      <button type="submit" style={{ background: '#FF7A12', color: '#0A1A52', border: 'none', borderRadius: 10, padding: '0.875rem 1.75rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
        Verify
      </button>
    </form>
  )
}
