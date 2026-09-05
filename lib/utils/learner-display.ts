// Shared learner display-name / initial resolver.
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
