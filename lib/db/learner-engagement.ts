import { createClient } from '@/lib/supabase/server'

export async function getLearnerStreak(learnerId: string) {
  const supabase = await createClient()
  const { data } = await (supabase as any)
    .from('learning_streaks')
    .select('current_streak_days, longest_streak_days')
    .eq('learner_id', learnerId)
    .maybeSingle()
  return {
    current: data?.current_streak_days ?? 0,
    longest: data?.longest_streak_days ?? 0,
  }
}

export async function getAchievementCount(learnerId: string): Promise<number> {
  const supabase = await createClient()
  const { count } = await (supabase as any)
    .from('user_achievements')
    .select('*', { count: 'exact', head: true })
    .eq('learner_id', learnerId)
  return count ?? 0
}


export interface RecentActivityItem {
  lessonId: string
  courseId: string
  lessonTitle: string
  lessonNumber: number | null
  courseSlug: string | null
  courseTitle: string
  status: string
  lastAccessedAt: string
}

export async function getRecentActivity(learnerId: string, limit: number = 5): Promise<RecentActivityItem[]> {
  const supabase = await createClient()
  const { data } = await (supabase as any)
    .from('lesson_progress')
    .select('lesson_id, course_id, status, last_accessed_at, lessons ( title, lesson_number ), courses ( slug, title )')
    .eq('learner_id', learnerId)
    .not('last_accessed_at', 'is', null)
    .order('last_accessed_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map((d: any) => ({
    lessonId: d.lesson_id,
    courseId: d.course_id,
    lessonTitle: d.lessons?.title ?? 'Untitled lesson',
    lessonNumber: d.lessons?.lesson_number ?? null,
    courseSlug: d.courses?.slug ?? null,
    courseTitle: d.courses?.title ?? 'Untitled course',
    status: d.status,
    lastAccessedAt: d.last_accessed_at,
  }))
}
