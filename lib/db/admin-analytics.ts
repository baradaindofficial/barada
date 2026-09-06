import { createClient } from '@/lib/supabase/server'

export interface ActiveLearnersWeek {
  weekStart: string
  activeLearnerCount: number
}

export interface CoursePopularity {
  courseId: string
  title: string
  enrollmentCount: number
}

export interface CourseCompletionRate {
  courseId: string
  title: string
  totalEnrollments: number
  completedEnrollments: number
  completionRatePct: number
}

export interface RevenueEstimate {
  totalIssuedCertificates: number
  estimatedRevenueRupees: number
  byCourse: { courseId: string; title: string; certificatesIssued: number; revenueRupees: number }[]
}

/**
 * Distinct active learners (any lesson_progress activity) per week, last N weeks.
 */
export async function getActiveLearnersTrend(weeks: number = 8): Promise<ActiveLearnersWeek[]> {
  const supabase = await createClient()
  const since = new Date()
  since.setDate(since.getDate() - weeks * 7)

  const { data, error } = await (supabase as any)
    .from('lesson_progress')
    .select('learner_id, last_accessed_at')
    .gte('last_accessed_at', since.toISOString())

  if (error) {
    throw new Error(`[getActiveLearnersTrend] failed: ${error.message}`)
  }

  const buckets = new Map<string, Set<string>>()
  for (const row of data ?? []) {
    if (!row.last_accessed_at) continue
    const d = new Date(row.last_accessed_at)
    const day = d.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    const monday = new Date(d)
    monday.setDate(d.getDate() + diffToMonday)
    monday.setHours(0, 0, 0, 0)
    const key = monday.toISOString().slice(0, 10)

    if (!buckets.has(key)) buckets.set(key, new Set())
    buckets.get(key)!.add(row.learner_id)
  }

  return Array.from(buckets.entries())
    .map(([weekStart, learnerSet]) => ({ weekStart, activeLearnerCount: learnerSet.size }))
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart))
}

/**
 * Courses ranked by total enrollment count.
 */
export async function getCoursePopularity(): Promise<CoursePopularity[]> {
  const supabase = await createClient()

  const { data: courses, error: coursesError } = await (supabase as any)
    .from('courses')
    .select('course_id, title')

  if (coursesError) {
    throw new Error(`[getCoursePopularity] courses failed: ${coursesError.message}`)
  }

  const { data: enrollments, error: enrollmentsError } = await (supabase as any)
    .from('enrollments')
    .select('course_id')

  if (enrollmentsError) {
    throw new Error(`[getCoursePopularity] enrollments failed: ${enrollmentsError.message}`)
  }

  const countByCourseId = new Map<string, number>()
  for (const e of enrollments ?? []) {
    if (!e.course_id) continue
    countByCourseId.set(e.course_id, (countByCourseId.get(e.course_id) ?? 0) + 1)
  }

  return (courses ?? [])
    .map((c: any) => ({
      courseId: c.course_id,
      title: c.title,
      enrollmentCount: countByCourseId.get(c.course_id) ?? 0,
    }))
    .sort((a: any, b: any) => b.enrollmentCount - a.enrollmentCount)
}

/**
 * Completion rate per course: completed enrollments / total enrollments.
 */
export async function getCourseCompletionRates(): Promise<CourseCompletionRate[]> {
  const supabase = await createClient()

  const { data: courses, error: coursesError } = await (supabase as any)
    .from('courses')
    .select('course_id, title')

  if (coursesError) {
    throw new Error(`[getCourseCompletionRates] courses failed: ${coursesError.message}`)
  }

  const { data: enrollments, error: enrollmentsError } = await (supabase as any)
    .from('enrollments')
    .select('course_id, status')

  if (enrollmentsError) {
    throw new Error(`[getCourseCompletionRates] enrollments failed: ${enrollmentsError.message}`)
  }

  const statsByCourseId = new Map<string, { total: number; completed: number }>()
  for (const e of enrollments ?? []) {
    if (!e.course_id) continue
    const existing = statsByCourseId.get(e.course_id) ?? { total: 0, completed: 0 }
    existing.total += 1
    if (e.status === 'completed') existing.completed += 1
    statsByCourseId.set(e.course_id, existing)
  }

  return (courses ?? [])
    .map((c: any) => {
      const stats = statsByCourseId.get(c.course_id) ?? { total: 0, completed: 0 }
      return {
        courseId: c.course_id,
        title: c.title,
        totalEnrollments: stats.total,
        completedEnrollments: stats.completed,
        completionRatePct: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      }
    })
    .filter((c: any) => c.totalEnrollments > 0)
    .sort((a: any, b: any) => b.completionRatePct - a.completionRatePct)
}

/**
 * Estimated revenue: issued certificates x each course's list price
 * (cert_price_paise). This is an ESTIMATE, not verified transaction data --
 * there is no payments table in this schema to confirm actual payment.
 */
export async function getRevenueEstimate(): Promise<RevenueEstimate> {
  const supabase = await createClient()

  const { data: certificates, error: certsError } = await (supabase as any)
    .from('certificates')
    .select('course_id')
    .eq('status', 'issued')

  if (certsError) {
    throw new Error(`[getRevenueEstimate] certificates failed: ${certsError.message}`)
  }

  const { data: courses, error: coursesError } = await (supabase as any)
    .from('courses')
    .select('course_id, title, cert_price_paise')

  if (coursesError) {
    throw new Error(`[getRevenueEstimate] courses failed: ${coursesError.message}`)
  }

  const coursesById = new Map((courses ?? []).map((c: any) => [c.course_id, c]))
  const countByCourseId = new Map<string, number>()
  for (const cert of certificates ?? []) {
    if (!cert.course_id) continue
    countByCourseId.set(cert.course_id, (countByCourseId.get(cert.course_id) ?? 0) + 1)
  }

  const byCourse = Array.from(countByCourseId.entries()).map(([courseId, count]) => {
    const course: any = coursesById.get(courseId)
    const priceRupees = (course?.cert_price_paise ?? 0) / 100
    return {
      courseId,
      title: course?.title ?? 'Unknown course',
      certificatesIssued: count,
      revenueRupees: count * priceRupees,
    }
  }).sort((a, b) => b.revenueRupees - a.revenueRupees)

  return {
    totalIssuedCertificates: certificates?.length ?? 0,
    estimatedRevenueRupees: byCourse.reduce((sum, c) => sum + c.revenueRupees, 0),
    byCourse,
  }
}
