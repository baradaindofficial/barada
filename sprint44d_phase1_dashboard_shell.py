"""
sprint44d_phase1_dashboard_shell.py
Barada Digital Platform — Sprint 4.4d Phase 1: Dashboard Framework

Creates:
  context/ThemeContext.tsx                  — theme provider (light/dark, persisted)
  components/dashboard/DashboardShell.tsx   — responsive shell (sidebar + header + content)
  components/dashboard/Sidebar.tsx          — nav sidebar (desktop fixed, mobile drawer)
  components/dashboard/DashboardHeader.tsx  — header (greeting, theme toggle, avatar)

Modifies:
  app/globals.css      — appends theme tokens (light/dark CSS custom properties)
                          + 2 responsive helper classes (media queries only —
                          inline styles cannot express breakpoints)
  app/layout.tsx        — adds a beforeInteractive theme-init script (prevents
                          flash of wrong theme) + suppressHydrationWarning on <html>
  app/(dashboard)/layout.tsx — wraps children in ThemeProvider + DashboardShell

Design tokens per CTO approval (Sprint 4.4d):
  Brand Red: #E31E24 | Deep Navy: #0D183D | Gold: #D4AF37
  Poppins (display) / Inter (body) — reuses existing --font-display/--font-body

Run from repo root: py sprint44d_phase1_dashboard_shell.py
"""
import os

def w(rel, content):
    path = os.path.join(*rel.split('/'))
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Wrote: {rel}')

def append_anchor(rel, anchor, new_text):
    path = os.path.join(*rel.split('/'))
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if anchor not in content:
        print(f'  WARNING: anchor not found in {rel} — skipping (check manually)')
        return
    content = content.replace(anchor, anchor + new_text)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Updated: {rel}')

def replace_anchor(rel, old, new):
    path = os.path.join(*rel.split('/'))
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if old not in content:
        print(f'  WARNING: anchor not found in {rel} — skipping (check manually)')
        return
    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Updated: {rel}')

print("Sprint 4.4d Phase 1 — Dashboard Framework...")

# ============================================================================
# app/globals.css — append theme tokens + responsive helper classes
# ============================================================================
theme_css = r"""

/* ============================================================================
   Sprint 4.4d — Dashboard theme tokens
   Light values live on :root (default). Dark values override under
   [data-theme="dark"], set on <html> by the blocking script in app/layout.tsx
   and toggled at runtime by context/ThemeContext.tsx.
   Components consume these via inline style={{ background: 'var(--color-surface)' }}
   etc. — this file only defines the tokens and two responsive helper classes
   that inline styles cannot express (media queries).
   ============================================================================ */
:root {
  --color-bg: #F9FAFB;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F3F4F6;
  --color-border: #E5E7EB;
  --color-text-primary: #0D183D;
  --color-text-secondary: #6B7280;
  --color-text-muted: #9CA3AF;

  --color-brand-red: #E31E24;
  --color-brand-navy: #0D183D;
  --color-brand-gold: #D4AF37;

  --shadow-sm: 0 1px 2px rgba(13, 24, 61, 0.06);
  --shadow-md: 0 4px 16px rgba(13, 24, 61, 0.10);
  --shadow-lg: 0 12px 32px rgba(13, 24, 61, 0.16);

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
}

[data-theme="dark"] {
  --color-bg: #0B1120;
  --color-surface: #131B33;
  --color-surface-alt: #1A2547;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-text-primary: #F3F4F6;
  --color-text-secondary: #A3ACC2;
  --color-text-muted: #6B7280;

  /* Brand red/gold stay constant across themes for brand consistency.
     Navy lightens on dark surfaces — the literal brand navy (#0D183D) is
     too close to the dark background to read as an accent/text color. */
  --color-brand-red: #E31E24;
  --color-brand-navy: #7C89B8;
  --color-brand-gold: #D4AF37;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.6);
}

/* Responsive helpers — media queries cannot be expressed via inline styles */
.barada-sidebar-desktop { display: none; }
.barada-mobile-menu-btn { display: inline-flex; }
@media (min-width: 768px) {
  .barada-sidebar-desktop { display: block; }
  .barada-mobile-menu-btn { display: none; }
}
"""

with open(os.path.join("app", "globals.css"), "a", encoding="utf-8") as f:
    f.write(theme_css)
print("  Appended: app/globals.css (theme tokens + responsive helpers)")

# ============================================================================
# app/layout.tsx — theme-init script (prevents flash of wrong theme)
# ============================================================================
replace_anchor(
    'app/layout.tsx',
    "import type { Metadata, Viewport } from 'next'\nimport { Poppins, Inter } from 'next/font/google'",
    "import type { Metadata, Viewport } from 'next'\nimport { Poppins, Inter } from 'next/font/google'\nimport Script from 'next/script'"
)

replace_anchor(
    'app/layout.tsx',
    '    <html lang="en-IN" dir="ltr" className={`${poppins.variable} ${inter.variable}`}>\n      <body className="font-body antialiased bg-white text-gray-900">',
    '''    <html lang="en-IN" dir="ltr" className={`${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased bg-white text-gray-900">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var stored = localStorage.getItem('barada-theme');
                var theme = (stored === 'dark' || stored === 'light')
                  ? stored
                  : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            })();
          `}
        </Script>'''
)

# ============================================================================
# context/ThemeContext.tsx
# ============================================================================
w('context/ThemeContext.tsx', r"""'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'barada-theme'

/**
 * Theme provider for the dashboard. The actual initial theme is set
 * synchronously by the blocking script in app/layout.tsx (before React
 * hydrates, to avoid a flash of the wrong theme) — this provider reads
 * that already-applied value on mount and takes over for toggling.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as Theme | null
    if (current === 'dark' || current === 'light') {
      setThemeState(current)
    }
  }, [])

  const applyTheme = useCallback((next: Theme) => {
    setThemeState(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage unavailable (e.g. private browsing) — theme still
      // applies for this session, just won't persist across reloads.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, applyTheme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
""")

# ============================================================================
# components/dashboard/Sidebar.tsx
# ============================================================================
w('components/dashboard/Sidebar.tsx', r"""'use client'

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
""")

# ============================================================================
# components/dashboard/DashboardHeader.tsx
# ============================================================================
w('components/dashboard/DashboardHeader.tsx', r"""'use client'

import { useTheme } from '@/context/ThemeContext'

interface DashboardHeaderProps {
  learnerName: string
  avatarUrl?: string | null
  onMenuClick: () => void
}

export default function DashboardHeader({ learnerName, avatarUrl, onMenuClick }: DashboardHeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="barada-mobile-menu-btn"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.35rem',
            cursor: 'pointer',
            color: 'var(--color-text-primary)',
            padding: '0.25rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ☰
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
          Welcome back{learnerName ? `, ${learnerName}` : ''}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            background: 'var(--color-surface-alt)',
            border: '1px solid var(--color-border)',
            borderRadius: 999,
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.05rem',
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--color-brand-navy)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            {(learnerName || '?').charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  )
}
""")

# ============================================================================
# components/dashboard/DashboardShell.tsx
# ============================================================================
w('components/dashboard/DashboardShell.tsx', r"""'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import DashboardHeader from './DashboardHeader'

interface DashboardShellProps {
  learnerName: string
  avatarUrl?: string | null
  children: React.ReactNode
}

export default function DashboardShell({ learnerName, avatarUrl, children }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader learnerName={learnerName} avatarUrl={avatarUrl} onMenuClick={() => setMobileNavOpen(true)} />
        <main style={{ flex: 1, padding: 'clamp(1rem, 3vw, 2rem)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
""")

# ============================================================================
# app/(dashboard)/layout.tsx — wraps children in ThemeProvider + DashboardShell
# ============================================================================
w('app/(dashboard)/layout.tsx', r"""import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ThemeProvider } from '@/context/ThemeContext'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard')

  // Defensive select: this repo has shown schema drift between the
  // signup trigger (which only sets `name`) and other code (which reads
  // first_name/last_name). Selecting '*' and reading multiple possible
  // shapes avoids erroring on whichever one doesn't exist.
  const { data: learnerRaw } = await supabase
    .from('learners')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  const learner = learnerRaw as any

  const learnerName =
    learner?.first_name ||
    (learner?.name ? String(learner.name).split(' ')[0] : '') ||
    ''

  return (
    <ThemeProvider>
      <DashboardShell learnerName={learnerName} avatarUrl={learner?.avatar_url ?? null}>
        {children}
      </DashboardShell>
    </ThemeProvider>
  )
}
""")

print("\nDone. 7 files written/modified.")
print("Next: npm run type-check, npm run lint, npm test")
