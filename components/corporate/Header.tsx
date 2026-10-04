'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'

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
const NAV_LINKS = [
  { label: 'Academy', href: '/academy' },
  { label: 'Services', href: '/services' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function CorporateHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{ background: '#0D183D', position: 'sticky', top: 0, zIndex: 100 }}
      className="px-4 md:px-8"
    >
      <div className="flex items-center justify-between" style={{ height: 64 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
          <Logo variant="corporate" height={40} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{ gap: '1.5rem', alignItems: 'center' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/academy"
            style={{ background: '#E31E24', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}
          >
            Explore Academy
          </Link>
        </div>

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          className="md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="corporate-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            padding: 8,
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
          id="corporate-mobile-menu"
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
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                padding: '0.6rem 0.25rem',
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/academy"
            onClick={() => setMenuOpen(false)}
            style={{
              background: '#E31E24',
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
            Explore Academy
          </Link>
        </div>
      )}
    </nav>
  )
}
