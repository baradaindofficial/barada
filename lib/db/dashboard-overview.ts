// lib/db/dashboard-overview.ts
// Single source of truth for dashboard data. Routes/pages call this —
// they do not run their own duplicate queries (see: learner_id bug,
// which spread across 3 files before being caught).

import { createClient } from '@/lib/supabase/server'

export interface EnrollmentWithProgress {
  enrollmentId: string
  courseId: string
  courseTitle: string
  completionPercentage: number
  status: string
  lastAccessedAt: string | null
}

export interface ContinueLearningItem {
  courseId: string
  courseTitle: string
  completionPercentage: number
  lastAccessedAt: string
}

export interface RecentActivityItem {
  sessionId: string
  courseId: string
  courseTitle: string
  occurredAt: string
}

export interface CertificateItem {
  certificateId: string
  courseSlug: string
  courseId: string
  issuedAt: string
  certificateUrl: string
}

export interface DashboardOverview {
  activeEnrollments: EnrollmentWithProgress[]
  continueLearning: ContinueLearningItem | null
  streak: { current: number; longest: number }
  achievementCount: number
  recentActivity: RecentActivityItem[]
  certificates: CertificateItem[]
  stats: {
    enrolledCount: number
    coursesInProgress: number
    coursesCompleted: number
    lessonsCompleted: number
    certificateCount: number
  }
}

export async function getDashboardOverview(learnerId: string): Promise<DashboardOverview> {
  const supabase = await createClient()

  const { data: enrollments, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select(`enrollment_id, course_id, status, enrolled_at, courses ( title )`)
    .eq('learner_id', learnerId)

  if (enrollmentsError) {
    throw new Error(`[getDashboardOverview] enrollments failed for ${learnerId}: ${enrollmentsError.message}`)
  }
  const enrollmentList = enrollments ?? []

 const { data: streakData, error: streakError } = await supabase
  .from('learning_streaks')
  .select('current_streak_days, longest_streak_days')
  .eq('learner_id', learnerId)
  .maybeSingle()
  const streak = {
  current: streakData?.current_streak_days ?? 0,
  longest: streakData?.longest_streak_days ?? 0,
}
  if (streakError) {
    throw new Error(`[getDashboardOverview] streak failed for ${learnerId}: ${streakError.message}`)
  }
  
  const { count: achievementCount, error: achievementError } = await supabase
    .from('user_achievements')
    .select('*', { count: 'exact', head: true })
    .eq('learner_id', learnerId)
  if (achievementError) {
    throw new Error(`[getDashboardOverview] achievements failed for ${learnerId}: ${achievementError.message}`)
  }

  const { count: lessonsCompleted, error: lessonsError } = await supabase
    .from('lesson_progress')
    .select('*', { count: 'exact', head: true })
    .eq('learner_id', learnerId)
    .eq('status', 'completed')
  if (lessonsError) {
    throw new Error(`[getDashboardOverview] lesson count failed for ${learnerId}: ${lessonsError.message}`)
  }

  const { data: certificates, error: certificatesError } = await supabase
    .from('certificates')
    .select('certificate_id, course_slug, course_id, issued_at, verification_url')
    .eq('learner_id', learnerId)
    .order('issued_at', { ascending: false })
  if (certificatesError) {
    throw new Error(`[getDashboardOverview] certificates failed for ${learnerId}: ${certificatesError.message}`)
  }
  const certificateList: CertificateItem[] = (certificates ?? []).map((c: any) => ({
    certificateId: c.certificate_id,
    courseSlug: c.course_slug,
    courseId: c.course_id,
    issuedAt: c.issued_at,
    certificateUrl: c.verification_url,
  }))

  const baseStats = {
    enrolledCount: enrollmentList.length,
    lessonsCompleted: lessonsCompleted ?? 0,
    certificateCount: certificateList.length,
  }

  if (enrollmentList.length === 0) {
    return {
      activeEnrollments: [],
      continueLearning: null,
      streak,
      achievementCount: achievementCount ?? 0,
      recentActivity: [],
      certificates: certificateList,
      stats: { ...baseStats, coursesInProgress: 0, coursesCompleted: 0 },
    }
  }

  const courseIds = enrollmentList.map((e: any) => e.course_id)

  const { data: progressRows, error: progressError } = await supabase
    .from('course_progress')
    .select('course_id, completion_percentage, updated_at')
    .eq('learner_id', learnerId)
    .in('course_id', courseIds)
  if (progressError) {
    throw new Error(`[getDashboardOverview] course_progress failed for ${learnerId}: ${progressError.message}`)
  }
  const progressByCourse = new Map((progressRows ?? []).map((row: any) => [row.course_id, row]))

  const activeEnrollments: EnrollmentWithProgress[] = enrollmentList.map((e: any) => {
    const progress = progressByCourse.get(e.course_id) as any
    return {
      enrollmentId: e.enrollment_id,
      courseId: e.course_id,
      courseTitle: e.courses?.title ?? 'Untitled course',
      completionPercentage: progress?.completion_percentage ?? 0,
      status: e.status,
      lastAccessedAt: progress?.updated_at ?? null,
    }
  })

  const continueLearningCandidate = [...activeEnrollments]
    .filter((e) => e.lastAccessedAt)
    .sort((a, b) => new Date(b.lastAccessedAt!).getTime() - new Date(a.lastAccessedAt!).getTime())[0]

  const continueLearning: ContinueLearningItem | null = continueLearningCandidate
    ? {
        courseId: continueLearningCandidate.courseId,
        courseTitle: continueLearningCandidate.courseTitle,
        completionPercentage: continueLearningCandidate.completionPercentage,
        lastAccessedAt: continueLearningCandidate.lastAccessedAt!,
      }
    : null

  const { data: sessions, error: sessionsError } = await supabase
    .from('learning_sessions')
    .select('id, course_id, occurred_at, courses ( title )')
    .eq('learner_id', learnerId)
    .order('occurred_at', { ascending: false })
    .limit(10)
  if (sessionsError) {
    throw new Error(`[getDashboardOverview] sessions failed for ${learnerId}: ${sessionsError.message}`)
  }
  const recentActivity: RecentActivityItem[] = (sessions ?? []).map((s: any) => ({
    sessionId: s.id,
    courseId: s.course_id,
    courseTitle: s.courses?.title ?? 'Untitled course',
    occurredAt: s.occurred_at,
  }))

  const coursesCompleted = activeEnrollments.filter((e) => e.completionPercentage >= 100).length
  const coursesInProgress = activeEnrollments.filter(
    (e) => e.completionPercentage > 0 && e.completionPercentage < 100
  ).length

  return {
    activeEnrollments,
    continueLearning,
    streak,
    achievementCount: achievementCount ?? 0,
    recentActivity,
    certificates: certificateList,
    stats: { ...baseStats, coursesInProgress, coursesCompleted },
  }
}