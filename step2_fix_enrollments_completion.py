"""
Extends lib/db/enrollments.ts so getEnrollment/getLearnerEnrollments return
a real completionPercentage, sourced from course_progress (the sole source
of truth per ADR-008). Fixes a latent bug: dashboard/page.tsx already reads
enrollment.completionPercentage, but the old mapEnrollment() never set it.

Run from repo root: py step2_fix_enrollments_completion.py
"""

FILE_PATH = "lib/db/enrollments.ts"

EXPECTED_OLD_MARKER = "function mapEnrollment(d: any) {"

NEW_CONTENT = '''import { createClient } from '@/lib/supabase/server'

function mapEnrollment(d: any, completionPercentage: number = 0) {
  return { enrollmentId: d.enrollment_id, learnerId: d.learner_id, courseSlug: d.course_slug, courseId: d.course_id, status: d.status, enrolledAt: d.enrolled_at, lastAccessedAt: d.last_accessed_at, completedAt: d.completed_at, completionPercentage }
}

export async function getEnrollment(learnerId: string, courseSlug: string) {
  const supabase = await createClient()
  const { data } = await (supabase as any).from('enrollments').select('*').eq('learner_id', learnerId).eq('course_slug', courseSlug).single()
  if (!data) return null

  let completionPercentage = 0
  if (data.course_id) {
    const { data: progress } = await (supabase as any)
      .from('course_progress')
      .select('completion_percentage')
      .eq('learner_id', learnerId)
      .eq('course_id', data.course_id)
      .maybeSingle()
    completionPercentage = progress?.completion_percentage ?? 0
  }

  return mapEnrollment(data, completionPercentage)
}

export async function getLearnerEnrollments(learnerId: string) {
  const supabase = await createClient()
  const { data } = await (supabase as any).from('enrollments').select('*').eq('learner_id', learnerId).order('last_accessed_at', { ascending: false, nullsFirst: false })
  const enrollments = data ?? []
  if (enrollments.length === 0) return []

  const courseIds = enrollments.map((e: any) => e.course_id).filter(Boolean)
  let progressByCourseId = new Map<string, number>()
  if (courseIds.length > 0) {
    const { data: progressRows } = await (supabase as any)
      .from('course_progress')
      .select('course_id, completion_percentage')
      .eq('learner_id', learnerId)
      .in('course_id', courseIds)
    progressByCourseId = new Map((progressRows ?? []).map((p: any) => [p.course_id, p.completion_percentage]))
  }

  return enrollments.map((e: any) => mapEnrollment(e, progressByCourseId.get(e.course_id) ?? 0))
}

/**
 * Enrolls a learner in a course. ALWAYS populates course_id -- the FK column
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
'''

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: Could not find {FILE_PATH}")
        return

    if EXPECTED_OLD_MARKER not in content:
        print("WARNING: File doesn't match the expected known content.")
        print("Not overwriting -- please check the file manually before proceeding.")
        return

    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(NEW_CONTENT)

    print(f"SUCCESS: {FILE_PATH} updated with completionPercentage support.")

if __name__ == "__main__":
    main()
