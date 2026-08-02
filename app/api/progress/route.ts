import { NextResponse } from 'next/server'

/**
 * RETIRED — per ADR-008 (Sprint 4.4).
 *
 * This endpoint wrote to the pre-ADR lesson_progress schema
 * (course_slug / module_number / lesson_number / is_completed), which no
 * longer exists after the Sprint 4.4 migration. No frontend caller was
 * found referencing this route at the time of retirement (verified via
 * repo-wide search). Returns 410 Gone rather than a silent 500/404 so any
 * caller we didn't find gets an explicit, actionable error.
 *
 * Replacement: POST /api/lessons/[id]/complete
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'This endpoint has been retired.',
      replacement: '/api/lessons/[id]/complete',
      reason: 'Superseded by Sprint 4.4 progress tracking (ADR-008).',
    },
    { status: 410 }
  )
}
