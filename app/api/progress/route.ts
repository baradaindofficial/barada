/**
 * app/api/progress/route.ts
 * POST /api/progress — Mark a lesson as complete for the authenticated learner.
 *
 * Validates: auth session, request body shape, and that the courseSlug
 * maps to a real course before writing to the database.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { markLessonComplete } from '@/lib/db/progress'
import { COURSES } from '@/data/courses'
import { z } from 'zod'

const ProgressSchema = z.object({
  courseSlug:    z.string().min(1).max(100),
  moduleNumber:  z.number().int().min(1).max(10),
  lessonNumber:  z.number().int().min(1).max(30),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = ProgressSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid body', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { courseSlug, moduleNumber, lessonNumber } = parsed.data

  // Validate courseSlug is a real course — prevents junk data in the DB
  const courseExists = COURSES.some(c => c.slug === courseSlug)
  if (!courseExists) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  const { error } = await markLessonComplete(user.id, courseSlug, moduleNumber, lessonNumber)

  if (error) {
    console.error('[progress] DB error:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }

  return NextResponse.json({ status: 'progress_saved' })
}
