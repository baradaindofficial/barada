"""
fix_item3_greeting_firstname.py
Sprint 4.4d Item 3 — adjustment per CTO decision

Header greeting should show only the first word of the learner's name
("Barada"), while Profile's Full Name field continues to show the
complete canonical value ("Barada Satpathy"). Adds a new
getLearnerFirstName() function, used only for the dashboard/header
greeting. getLearnerDisplayName() (full name, used by Profile) and
getLearnerInitial() (avatar) are unchanged.

Files touched:
  lib/utils/learner-display.ts  — add getLearnerFirstName()
  app/(dashboard)/layout.tsx    — use getLearnerFirstName() for the
                                   greeting instead of getLearnerDisplayName()
  __tests__/utils/learner-display.test.ts — add tests for the new function

NOT touched: Profile page, DashboardHeader.tsx, dashboard/page.tsx (hero),
lib/db/learners.ts, theme, mobile nav — all already correct.

Run from repo root: py fix_item3_greeting_firstname.py
"""
import os

def w(rel, content):
    path = os.path.join(*rel.split('/'))
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Wrote: {rel}')

print("Adjusting Item 3: first-word greeting extraction...")

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
 * Resolves a learner's FULL display name for UI purposes (e.g. Profile's
 * Full Name field).
 *   valid, non-empty name  -> that name (trimmed), unmodified
 *   missing / empty / whitespace-only -> "Learner"
 */
export function getLearnerDisplayName(learner: LearnerIdentitySource | null | undefined): string {
  const name = learner?.name?.trim()
  return name && name.length > 0 ? name : FALLBACK_NAME
}

/**
 * Resolves just the FIRST WORD of the learner's name, for short-form
 * greetings (e.g. the dashboard header's "Welcome back, ___"). Reuses
 * getLearnerDisplayName()'s fallback, so a missing name still greets
 * with "Learner" rather than something blank or malformed.
 */
export function getLearnerFirstName(learner: LearnerIdentitySource | null | undefined): string {
  const fullName = getLearnerDisplayName(learner)
  return fullName.split(' ')[0]
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

w('app/(dashboard)/layout.tsx', r"""import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ThemeProvider } from '@/context/ThemeContext'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { getLearnerFirstName } from '@/lib/utils/learner-display'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard')

  // learners.learner_id is the actual auth-linking column — there is
  // no `id` column on this table (confirmed via schema inspection,
  // Sprint 4.4d Item 3).
  const { data: learnerRaw } = await supabase
    .from('learners')
    .select('*')
    .eq('learner_id', user.id)
    .maybeSingle()
  const learner = learnerRaw as any

  // Header greeting uses first-word only ("Barada"), matching the
  // hero card's existing short-form behavior. Profile shows the full
  // name separately via getLearnerDisplayName().
  const learnerName = getLearnerFirstName(learner)

  return (
    <ThemeProvider>
      <DashboardShell learnerName={learnerName} avatarUrl={learner?.avatar_url ?? null}>
        {children}
      </DashboardShell>
    </ThemeProvider>
  )
}
""")

w('__tests__/utils/learner-display.test.ts', r"""import { getLearnerDisplayName, getLearnerFirstName, getLearnerInitial } from '@/lib/utils/learner-display'

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

describe('getLearnerFirstName', () => {
  it('returns just the first word of a multi-word name', () => {
    expect(getLearnerFirstName({ name: 'Barada Satpathy' })).toBe('Barada')
  })

  it('returns the whole name when it is a single word', () => {
    expect(getLearnerFirstName({ name: 'Barada' })).toBe('Barada')
  })

  it('falls back to "Learner" when name is missing', () => {
    expect(getLearnerFirstName(null)).toBe('Learner')
    expect(getLearnerFirstName({})).toBe('Learner')
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

print("\nDone. 3 files updated.")
print("Next: npm run type-check, npm run lint, npm test, then browser re-verification")
