'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

// Only routes confirmed to resolve today are linked. Progress/Settings
// folders exist but have no page.tsx yet — will be added in a later phase
// rather than linking to a 404 now.
const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: '🏠' },
  { href: '/dashboard/courses', label: 'My Courses', icon: '📚' },
  { href: '/dashboard/downloads', label: 'Downloads', icon: '📥' },
  { href: '/dashboard/certificates', label: 'Certificates', icon: '🏆' },
  { href: '/dashboard/achievements', label: 'Achievements', icon: '🏅' },
  { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
]

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const navList = (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.75rem' }}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.9rem',
              borderRadius: 10,
              fontSize: '0.875rem',
              fontWeight: active ? 700 : 500,
              color: active ? 'var(--color-brand-red)' : 'var(--color-text-secondary)',
              background: active ? 'var(--color-surface-alt)' : 'transparent',
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar — visibility controlled by .barada-sidebar-desktop in globals.css */}
      <aside
        className="barada-sidebar-desktop"
        style={{
          width: 240,
          flexShrink: 0,
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          padding: '1.5rem 0',
        }}
      >
        <div style={{ padding: '0 1.25rem', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-brand-navy)' }}>
            Barada Academy
          </span>
        </div>
        {navList}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div
            onClick={onClose}
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}
          />
          <aside
            style={{
              position: 'relative',
              width: 260,
              maxWidth: '80vw',
              height: '100%',
              background: 'var(--color-surface)',
              padding: '1.5rem 0',
              boxShadow: 'var(--shadow-lg)',
              overflowY: 'auto',
            }}
          >
            <div style={{ padding: '0 1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-brand-navy)' }}>
                Barada Academy
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
              >
                ✕
              </button>
            </div>
            {navList}
          </aside>
        </div>
      )}
    </>
  )
}
