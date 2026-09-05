"""
fix_theme_toggle_desync.py
Sprint 4.4d Phase 1 — theme toggle desync fix

Root cause: ThemeProvider's React state defaulted to 'light' on every
mount and only corrected itself in a useEffect after first render. The
blocking script in app/layout.tsx already sets the real theme on <html>
before React runs — this fix reads that value synchronously via a lazy
useState initializer instead, so there's no "wrong, then maybe corrected"
window at all. Still a single state, single source of truth (the DOM
attribute / localStorage) — no second theme state introduced.

The one legitimate side effect: the toggle button's icon can now
legitimately differ between the server's blind guess ('light', since the
server has no access to the client's localStorage) and the client's
first real render. suppressHydrationWarning on that one button is the
standard, sanctioned way to handle this exact dark-mode-toggle case —
does not suppress warnings anywhere else.

Does NOT touch: dashboard content/cards theming (out of Phase 1 scope),
the "Welcome back" name bug (separate, untouched per instruction).

Run from repo root: py fix_theme_toggle_desync.py
"""
import os

def w(rel, content):
    path = os.path.join(*rel.split('/'))
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Wrote: {rel}')

def replace_in_file(rel, old, new, label):
    path = os.path.join(*rel.split('/'))
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if old not in content:
        print(f'  WARNING: {label} anchor not found in {rel} — skipping, check manually')
        return
    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Updated: {rel} ({label})')

print("Fixing theme toggle desync...")

w('context/ThemeContext.tsx', r"""'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'barada-theme'

// Reads the theme already applied to <html> by the blocking script in
// app/layout.tsx (which runs before hydration, before any React code).
// On the server, `document` doesn't exist — 'light' is the same
// SSR-safe fallback the blocking script itself uses.
function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

/**
 * Theme provider for the dashboard. Single source of truth: the
 * data-theme attribute on <html> (backed by localStorage). React state
 * is read directly from it via a lazy initializer on first render —
 * no separate "default then correct" effect, so the toggle icon can
 * never disagree with the actually-applied theme.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

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

replace_in_file(
    'components/dashboard/DashboardHeader.tsx',
    '''        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{''',
    '''        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          suppressHydrationWarning
          style={{''',
    'suppressHydrationWarning on theme toggle button'
)

print("\nDone.")
print("Next: npm run type-check, npm run lint, npm test, then browser verification")
