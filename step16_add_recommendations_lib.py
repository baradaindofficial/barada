"""
Creates lib/db/recommendations.ts -- rule-based course recommendations.
Logic: same category first, then any category not yet enrolled in,
excluding courses the learner is already enrolled in. No AI/LLM call --
there's no real usage history yet to justify one; this can be upgraded
later once real learner data exists.

Run from repo root: py step16_add_recommendations_lib.py
"""
import os

FILE_PATH = "lib/db/recommendations.ts"

CONTENT = """import { createClient } from '@/lib/supabase/server'
import { COURSES } from '@/data/courses'
import type { Course } from '@/types'

export interface RecommendedCourse {
  course: Course
  reason: string
}

/**
 * Rule-based course recommendations (no LLM call -- see lib/db/recommendations.ts
 * header comment for why). Recommends up to `limit` courses the learner is
 * NOT already enrolled in, prioritizing the same category as their most
 * recently accessed enrolled course.
 */
export async function getRecommendedCourses(learnerId: string, limit: number = 3): Promise<RecommendedCourse[]> {
  const supabase = await createClient()

  const { data: enrollments, error } = await (supabase as any)
    .from('enrollments')
    .select('course_slug, last_accessed_at')
    .eq('learner_id', learnerId)
    .order('last_accessed_at', { ascending: false, nullsFirst: false })

  if (error) {
    throw new Error(`[getRecommendedCourses] failed: ${error.message}`)
  }

  const enrolledSlugs = new Set((enrollments ?? []).map((e: any) => e.course_slug))
  const notEnrolled = COURSES.filter((c) => !enrolledSlugs.has(c.slug))

  if (notEnrolled.length === 0) {
    return []
  }

  const mostRecentSlug = enrollments?.[0]?.course_slug
  const mostRecentCourse = mostRecentSlug ? COURSES.find((c) => c.slug === mostRecentSlug) : null

  const recommendations: RecommendedCourse[] = []

  if (mostRecentCourse) {
    const sameCategory = notEnrolled.filter((c) => c.category === mostRecentCourse.category)
    for (const course of sameCategory) {
      if (recommendations.length >= limit) break
      recommendations.push({ course, reason: `Because you're taking ${mostRecentCourse.title}` })
    }
  }

  for (const course of notEnrolled) {
    if (recommendations.length >= limit) break
    if (recommendations.some((r) => r.course.slug === course.slug)) continue
    recommendations.push({ course, reason: 'Popular with professionals like you' })
  }

  return recommendations.slice(0, limit)
}
"""

def main():
    if os.path.exists(FILE_PATH):
        print(f"WARNING: {FILE_PATH} already exists. Not overwriting.")
        return
    os.makedirs(os.path.dirname(FILE_PATH), exist_ok=True)
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(CONTENT)
    print(f"SUCCESS: Created {FILE_PATH}")

if __name__ == "__main__":
    main()
