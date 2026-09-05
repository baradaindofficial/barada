'use client'

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
