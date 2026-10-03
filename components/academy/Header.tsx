'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'

// Academy's own nav — intentionally distinct from the corporate Header
// (Logo policy v3.0). Previously inlined directly in app/academy/page.tsx
// as a single non-wrapping flex row with no mobile breakpoint, which
// overflowed ~22px at 375px (see "Mobile Overflow Backlog — 375px",
// 2026-10-03). Extracted here as a client component so it can carry its
// own responsive hamburger state, matching the pattern already used by
// components/corporate/Header.tsx.
const red = '#E31E24'
const navy = '#0D183D'

export default function AcademyHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{ background: navy, padding: '0 1rem', position: 'sticky', top: 0, zIndex: 100 }} className="md:px-8">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }} className="md:gap-6">
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 500, flexShrink: 0 }} className="hidden md:inline">&larr; Barada.in</Link>
          <Link href="/academy" style={{ display: 'flex', alignItems: 'center', lineHeight: 0, minWidth: 0 }}>
            <Logo variant="academy" height={36} />
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{ gap: '1.25rem', alignItems: 'center' }}>
          <Link href="/academy" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.82rem' }}>Courses</Link>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.82rem' }}>Sign In</Link>
          <Link href="/register" style={{ background: red, color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700 }}>Start Free</Link>
        </div>

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          className="md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="academy-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            padding: 8,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          id="academy-mobile-menu"
          className="md:hidden"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '0.75rem',
            paddingBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.9rem', padding: '0.6rem 0.25rem' }}>&larr; Barada.in</Link>
          <Link href="/academy" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, padding: '0.6rem 0.25rem' }}>Courses</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, padding: '0.6rem 0.25rem' }}>Sign In</Link>
          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            style={{
              background: red,
              color: '#fff',
              padding: '0.65rem 1.25rem',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              textAlign: 'center',
              marginTop: '0.5rem',
            }}
          >
            Start Free
          </Link>
        </div>
      )}
    </nav>
  )
}
