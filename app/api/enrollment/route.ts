/**
 * app/api/enrollment/route.ts
 * POST /api/enrollment — Enroll authenticated learner in a course
 * Body: { courseSlug: string }
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enrollLearner, isEnrolled } from '@/lib/db/enrollments'
import { z } from 'zod'

const EnrollSchema = z.object({ courseSlug: z.string().min(1).max(100) })

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const parsed = EnrollSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { courseSlug } = parsed.data

  // Check if already enrolled
  const alreadyEnrolled = await isEnrolled(user.id, courseSlug)
  if (alreadyEnrolled) {
    return NextResponse.json(
      { status: 'already_enrolled', message: 'You are already enrolled in this course' },
      { status: 200 }
    )
  }

  // Enroll
  const { data, error } = await enrollLearner(user.id, courseSlug)

  if (error) {
    console.error('Enrollment error:', error)
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 })
  }

  return NextResponse.json({ status: 'enrolled', enrollment: data }, { status: 201 })
}
