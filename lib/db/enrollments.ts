import { createClient } from '@/lib/supabase/server'

function mapEnrollment(d: any) {
  return { enrollmentId: d.enrollment_id, learnerId: d.learner_id, courseSlug: d.course_slug, courseId: d.course_id, status: d.status, enrolledAt: d.enrolled_at, lastAccessedAt: d.last_accessed_at, completedAt: d.completed_at }
}

export async function getEnrollment(learnerId: string, courseSlug: string) {
  const supabase = await createClient()
  const { data } = await (supabase as any).from('enrollments').select('*').eq('learner_id', learnerId).eq('course_slug', courseSlug).single()
  if (!data) return null
  return mapEnrollment(data)
}

export async function getLearnerEnrollments(learnerId: string) {
  const supabase = await createClient()
  const { data } = await (supabase as any).from('enrollments').select('*').eq('learner_id', learnerId).order('last_accessed_at', { ascending: false, nullsFirst: false })
  return (data ?? []).map(mapEnrollment)
}

/**
 * Enrolls a learner in a course. ALWAYS populates course_id — the FK column
 * has existed on this table but was silently left NULL by every insert
 * before this fix (found during Sprint 4.4 / ADR-008 investigation).
 */
export async function enrollLearner(learnerId: string, courseSlug: string) {
  const supabase = await createClient()

  const { data: course } = await (supabase as any)
    .from('courses')
    .select('course_id')
    .eq('slug', courseSlug)
    .maybeSingle()

  const { data, error } = await (supabase as any)
    .from('enrollments')
    .insert({
      learner_id: learnerId,
      course_slug: courseSlug,
      course_id: course?.course_id ?? null,
    })
    .select()
    .single()

  return { data, error }
}

export async function isEnrolled(learnerId: string, courseSlug: string): Promise<boolean> {
  const supabase = await createClient()
  const { count } = await (supabase as any).from('enrollments').select('*', { count: 'exact', head: true }).eq('learner_id', learnerId).eq('course_slug', courseSlug)
  return (count ?? 0) > 0
}

/**
 * Same check as isEnrolled(), but keyed by course_id (UUID) instead of slug.
 * Added for ADR-008-era code (Sprint 4.4+) that only has course_id on hand
 * (e.g. resolved from a lesson lookup), avoiding an extra slug round-trip.
 */
export async function isEnrolledByCourseId(learnerId: string, courseId: string): Promise<boolean> {
  const supabase = await createClient()
  const { count } = await (supabase as any).from('enrollments').select('*', { count: 'exact', head: true }).eq('learner_id', learnerId).eq('course_id', courseId)
  return (count ?? 0) > 0
}
