'use client'

import { useState } from 'react'
import Link from 'next/link'
import BaradaMark from '@/components/shared/BaradaMark'

// Shared corporate nav — used by Home, About, Services, Contact, Ecosystem.
// Academy keeps its own distinct branded nav on its own pages (see the
// documented "Logo policy (Architecture v3.0)" comment in
// components/shared/Logo.tsx) and does not use this component.
//
// CTO reversal (2026-10-03): the 2026-09-27 decision to keep Academy out of
// primary navigation is superseded. Academy is Barada's clearest, most
// concrete live offering and now gets a direct nav link and header CTA so
// visitors can reach it in one click from every corporate page, including
// the homepage.
//
// /resources and /community are intentionally NOT linked here — they are
// not yet built (BARADA_CORPORATE_WEBSITE_IMPLEMENTATION_BRIEF.md, FUTURE).
// Re-add once real pages exist.
const NAV_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: 'QORVIAN', href: '/qorvian' },
  { label: 'Partnerschaft', href: 'https://partnerschaft.in', external: true },
  { label: 'Services', href: '/services' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'About', href: '/about' },
]

const navLinkStyle = { color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 } as const

export default function CorporateHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{ background: '#0A1A52', position: 'sticky', top: 0, zIndex: 100 }}
      className="px-4 md:px-8"
    >
      <div className="flex items-center justify-between" style={{ height: 64, maxWidth: 1200, margin: '0 auto' }}>
        <Link href="/" aria-label="Barada home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <BaradaMark size={40} />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '0.14em' }}>BARADA</span>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', marginTop: 4, color: '#FF7A12' }}>CONNECT. BUILD. GROW.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{ gap: '1.5rem', alignItems: 'center' }}>
          {NAV_LINKS.map(({ label, href, external }) =>
            external ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={navLinkStyle}>{label} &#8599;</a>
            ) : (
              <Link key={label} href={href} style={navLinkStyle}>{label}</Link>
            ),
          )}
          <Link
            href="/contact"
            style={{ background: '#FF7A12', color: '#0A1A52', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}
          >
            Contact
          </Link>
        </div>

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          className="md:hidden flex"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="corporate-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            padding: 8,
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
          id="corporate-mobile-menu"
          className="md:hidden"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '0.75rem',
            paddingBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {NAV_LINKS.map(({ label, href, external }) => {
            const style = { color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, padding: '0.6rem 0.25rem' } as const
            return external ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} style={style}>{label} &#8599;</a>
            ) : (
              <Link key={label} href={href} onClick={() => setMenuOpen(false)} style={style}>{label}</Link>
            )
          })}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            style={{
              background: '#FF7A12',
              color: '#0A1A52',
              padding: '0.65rem 1.25rem',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              textAlign: 'center',
              marginTop: '0.5rem',
            }}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  )
}
