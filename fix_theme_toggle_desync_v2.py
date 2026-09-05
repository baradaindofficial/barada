"""
fix_theme_toggle_desync_v2.py
Sprint 4.4d Phase 1 — theme toggle desync, second fix attempt

The first fix (lazy useState initializer reading data-theme directly)
was verified NOT sufficient: confirmed via direct DOM inspection that
document.documentElement.getAttribute('data-theme') correctly returns
'dark' after refresh, yet the toggle icon still showed the wrong state
(moon instead of sun). This means the underlying theme mechanism is
correct — the bug is isolated to a hydration-timing edge case in how
the icon reads that value on first render.

Fix: adopt the standard, battle-tested pattern (used by next-themes and
similar libraries) — don't render the theme-dependent icon at all until
the component has fully mounted on the client. Before mount, render a
neutral placeholder (identical on server and client, so no mismatch is
possible). After mount (a plain React state update, not tied to
hydration reconciliation), swap to the real icon. This sidesteps the
timing issue structurally rather than trying to out-guess it.

Single source of truth is unchanged: the data-theme DOM attribute /
localStorage. This only changes WHEN the icon is allowed to render
based on it.

Run from repo root: py fix_theme_toggle_desync_v2.py
"""
import os

def w(rel, content):
    path = os.path.join(*rel.split('/'))
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Wrote: {rel}')

print("Applying v2 fix: mount-gated theme icon rendering...")

w('context/ThemeContext.tsx', r"""'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'barada-theme'

function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

/**
 * Theme provider for the dashboard. Single source of truth: the
 * data-theme attribute on <html> (backed by localStorage), set
 * synchronously before hydration by the blocking script in
 * app/layout.tsx.
 *
 * Exposes `mounted` so consumers that render a theme-dependent icon
 * (sun/moon) can wait until after mount to do so — avoiding a
 * hydration-timing edge case where the icon can briefly (or, in
 * practice, persistently on some renders) disagree with the actually
 * applied theme. Before mount, consumers should render a neutral
 * placeholder identical on server and client.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Re-confirm the real value once mounted, in case it changed
    // between initial render and this effect (defensive, cheap).
    setThemeState(getInitialTheme())
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
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: applyTheme, mounted }}>
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

w('components/dashboard/DashboardHeader.tsx', r"""'use client'

import { useTheme } from '@/context/ThemeContext'

interface DashboardHeaderProps {
  learnerName: string
  avatarUrl?: string | null
  onMenuClick: () => void
}

export default function DashboardHeader({ learnerName, avatarUrl, onMenuClick }: DashboardHeaderProps) {
  const { theme, toggleTheme, mounted } = useTheme()

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
        {/* Rendered only after mount — before that, a neutral placeholder
            (identical on server and client, so hydration can't mismatch
            it) occupies the same space to avoid layout shift. */}
        {mounted ? (
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
        ) : (
          <div
            aria-hidden="true"
            style={{
              background: 'var(--color-surface-alt)',
              border: '1px solid var(--color-border)',
              borderRadius: 999,
              width: 38,
              height: 38,
            }}
          />
        )}

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

print("\nDone.")
print("Next: npm run type-check, npm run lint, npm test, then browser verification")
