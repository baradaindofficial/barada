'use client'

import { useTheme } from '@/context/ThemeContext'
import { getLearnerInitial } from '@/lib/utils/learner-display'

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
            {getLearnerInitial({ name: learnerName })}
          </div>
        )}
      </div>
    </header>
  )
}
