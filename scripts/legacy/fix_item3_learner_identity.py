"""
fix_item3_learner_identity.py
Sprint 4.4d Item 3 — learner identity display fix

Root cause confirmed via schema inspection: the `learners` table has no
`id` column and no `first_name`/`last_name` columns — only `learner_id`
(the actual auth-linking key) and `name`. Both
app/(dashboard)/layout.tsx and app/(dashboard)/dashboard/profile/page.tsx
queried `.eq('id', user.id)` (wrong column, matches nothing) and then
read `learner?.first_name` (a column that doesn't exist at all). Query
errors were never checked, so both failures were silent — explains the
empty header greeting, the "?" avatar, and Profile's blank fields as
ONE root cause with three visible symptoms.

Fix:
  1. lib/utils/learner-display.ts (NEW) — single shared resolver.
     Canonical source: learners.name (the only real identity field).
     name → use it | missing/empty → "Learner" | initial → first char
     of resolved name, uppercased | missing identity → "L".
  2. app/(dashboard)/layout.tsx — .eq('id',...) -> .eq('learner_id',...),
     use the resolver for the header greeting name.
  3. app/(dashboard)/dashboard/profile/page.tsx — same query fix;
     replaces nonexistent First Name / Last Name rows with one Full
     Name row sourced from the resolver; avatar initial via resolver.
     Page remains display-only (Sprint 4.5 note preserved verbatim).
  4. components/dashboard/DashboardHeader.tsx — one-line change: avatar
     initial now computed via the shared resolver instead of inline
     charAt(0) logic, so there is a single source of truth for initial
     extraction. Mount-gating / theme logic from the Item 1 fix is
     otherwise untouched.

NOT touched (per explicit instruction): dashboard/page.tsx (hero card —
already correct), lib/db/learners.ts (already correct), authentication,
database/migrations, theme implementation, mobile navigation.

Run from repo root: py fix_item3_learner_identity.py
"""
import os

def w(rel, content):
    path = os.path.join(*rel.split('/'))
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Wrote: {rel}')

print("Implementing Item 3 fix: learner identity display...")

# ============================================================================
# lib/utils/learner-display.ts — NEW shared resolver
# ============================================================================
w('lib/utils/learner-display.ts', r"""// Shared learner display-name / initial resolver.
//
// Canonical source: learners.name — the only learner identity field
// that exists in the current schema (learners.first_name / last_name
// do NOT exist; do not assume they do). Typed loosely on purpose so
// this keeps working unmodified if additional identity fields are
// ever added to the schema in the future — it will simply keep
// reading `name` until such a change is made deliberately.

export interface LearnerIdentitySource {
  name?: string | null
}

const FALLBACK_NAME = 'Learner'
const FALLBACK_INITIAL = 'L'

/**
 * Resolves a learner's display name for UI purposes.
 *   valid, non-empty name  -> that name (trimmed)
 *   missing / empty / whitespace-only -> "Learner"
 */
export function getLearnerDisplayName(learner: LearnerIdentitySource | null | undefined): string {
  const name = learner?.name?.trim()
  return name && name.length > 0 ? name : FALLBACK_NAME
}

/**
 * Resolves a single uppercase character for avatar-fallback display,
 * derived from the resolved display name (so it inherits the same
 * "Learner" fallback -> "L" behavior automatically).
 */
export function getLearnerInitial(learner: LearnerIdentitySource | null | undefined): string {
  const displayName = getLearnerDisplayName(learner)
  const firstChar = displayName.charAt(0)
  return firstChar ? firstChar.toUpperCase() : FALLBACK_INITIAL
}
""")

# ============================================================================
# app/(dashboard)/layout.tsx — fix query column, use resolver
# ============================================================================
w('app/(dashboard)/layout.tsx', r"""import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ThemeProvider } from '@/context/ThemeContext'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { getLearnerDisplayName } from '@/lib/utils/learner-display'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard')

  // learners.learner_id is the actual auth-linking column — there is
  // no `id` column on this table (confirmed via schema inspection,
  // Sprint 4.4d Item 3). Querying the wrong column previously failed
  // silently (error was never checked), leaving learner undefined.
  const { data: learnerRaw } = await supabase
    .from('learners')
    .select('*')
    .eq('learner_id', user.id)
    .maybeSingle()
  const learner = learnerRaw as any

  const learnerName = getLearnerDisplayName(learner)

  return (
    <ThemeProvider>
      <DashboardShell learnerName={learnerName} avatarUrl={learner?.avatar_url ?? null}>
        {children}
      </DashboardShell>
    </ThemeProvider>
  )
}
""")

# ============================================================================
# app/(dashboard)/dashboard/profile/page.tsx — fix query, Full Name field
# ============================================================================
w('app/(dashboard)/dashboard/profile/page.tsx', r"""import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getLearnerDisplayName, getLearnerInitial } from '@/lib/utils/learner-display'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // learners.learner_id is the actual auth-linking column (see
  // app/(dashboard)/layout.tsx for the same fix and full explanation).
  const { data: learnerRaw } = await supabase
    .from('learners').select('*').eq('learner_id', user.id).maybeSingle()
  const learner = learnerRaw as any

  const displayName = getLearnerDisplayName(learner)
  const initial = getLearnerInitial(learner)

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#6B7280', fontSize: '0.82rem', textDecoration: 'none' }}>&larr; Dashboard</Link>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.75rem', marginTop: '0.5rem' }}>My Profile</h1>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 64, height: 64, background: '#E31E24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'Poppins, sans-serif' }}>
            {initial}
          </div>
          <div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', fontSize: '1.125rem' }}>
              {displayName}
            </p>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{user.email}</p>
          </div>
        </div>
        {[
          ['Full Name', displayName],
          ['Email', user.email || '\u2014'],
          ['Profession', learner?.profession || '\u2014'],
          ['Member Since', learner?.created_at ? new Date(learner.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '\u2014'],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{label}</span>
            <span style={{ color: '#0D183D', fontWeight: 600, fontSize: '0.875rem' }}>{value}</span>
          </div>
        ))}
      </div>
      <div style={{ background: '#FFF7ED', borderRadius: 12, padding: '1.25rem', border: '1px solid #FED7AA' }}>
        <p style={{ color: '#92400E', fontSize: '0.82rem', fontWeight: 600 }}>
          Profile editing is coming in Sprint 4.5. For changes, email academy@barada.in
        </p>
      </div>
    </div>
  )
}
""")

# ============================================================================
# components/dashboard/DashboardHeader.tsx — one-line: use shared resolver
# for avatar initial instead of inline charAt(0). Theme/mount-gating logic
# from the Item 1 fix is otherwise byte-for-byte unchanged.
# ============================================================================
w('components/dashboard/DashboardHeader.tsx', r"""'use client'

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
""")

# ============================================================================
# __tests__/utils/learner-display.test.ts — NEW unit tests
# ============================================================================
w('__tests__/utils/learner-display.test.ts', r"""import { getLearnerDisplayName, getLearnerInitial } from '@/lib/utils/learner-display'

describe('getLearnerDisplayName', () => {
  it('returns the name when a valid name is present', () => {
    expect(getLearnerDisplayName({ name: 'Barada' })).toBe('Barada')
  })

  it('returns the full name unmodified (does not split or truncate)', () => {
    expect(getLearnerDisplayName({ name: 'Barada Satpathy' })).toBe('Barada Satpathy')
  })

  it('falls back to "Learner" when name is missing', () => {
    expect(getLearnerDisplayName({})).toBe('Learner')
    expect(getLearnerDisplayName(null)).toBe('Learner')
    expect(getLearnerDisplayName(undefined)).toBe('Learner')
  })

  it('falls back to "Learner" when name is an empty string', () => {
    expect(getLearnerDisplayName({ name: '' })).toBe('Learner')
  })

  it('trims whitespace and falls back when name is whitespace-only', () => {
    expect(getLearnerDisplayName({ name: '   ' })).toBe('Learner')
  })

  it('trims leading/trailing whitespace from a valid name', () => {
    expect(getLearnerDisplayName({ name: '  Barada  ' })).toBe('Barada')
  })
})

describe('getLearnerInitial', () => {
  it('extracts the first character, uppercased, from a valid name', () => {
    expect(getLearnerInitial({ name: 'barada' })).toBe('B')
  })

  it('extracts the first character from a multi-word name', () => {
    expect(getLearnerInitial({ name: 'Barada Satpathy' })).toBe('B')
  })

  it('falls back to "L" when identity is missing entirely', () => {
    expect(getLearnerInitial(null)).toBe('L')
    expect(getLearnerInitial(undefined)).toBe('L')
    expect(getLearnerInitial({})).toBe('L')
  })

  it('falls back to "L" when name is empty or whitespace-only', () => {
    expect(getLearnerInitial({ name: '' })).toBe('L')
    expect(getLearnerInitial({ name: '   ' })).toBe('L')
  })
})
""")

print("\nDone. 5 files written (1 new resolver, 1 new test file, 3 fixed).")
print("Next: npm run type-check, npm run lint, npm test, then browser verification")
