import { createClient } from '@/lib/supabase/server'
import { getAllPublishedCoursesWithCounts } from '@/lib/db/courses'
import type { CourseCatalogItem } from '@/types'

export interface RecommendedCourse {
  course: CourseCatalogItem
  reason: string
}

/**
 * Rule-based course recommendations (no LLM call -- see lib/db/recommendations.ts
 * header comment for why). Recommends up to `limit` courses the learner is
 * NOT already enrolled in, prioritizing the same category as their most
 * recently accessed enrolled course.
 *
 * Course source: Supabase `courses` table (published only), via
 * getAllPublishedCoursesWithCounts() -- replaces the legacy static
 * data/courses.ts lookup so newly published courses appear automatically.
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

  const allCourses = await getAllPublishedCoursesWithCounts()
  const enrolledSlugs = new Set((enrollments ?? []).map((e: any) => e.course_slug))
  const notEnrolled = allCourses.filter((c) => !enrolledSlugs.has(c.slug))

  if (notEnrolled.length === 0) {
    return []
  }

  const mostRecentSlug = enrollments?.[0]?.course_slug
  const mostRecentCourse = mostRecentSlug ? allCourses.find((c) => c.slug === mostRecentSlug) : null

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
