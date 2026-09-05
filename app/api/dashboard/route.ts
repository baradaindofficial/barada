import { NextResponse } from 'next/server'

// This route had no callers anywhere in the app (confirmed via repo-wide
// search) and duplicated logic that lives in lib/db/learners.ts and
// lib/db/enrollments.ts, the actual data layer used by app/(dashboard)/dashboard/page.tsx.
// Kept as a stub rather than deleted outright in case something external
// depends on this path existing.
export async function GET() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
