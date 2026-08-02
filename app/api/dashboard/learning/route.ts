import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function GET() {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()

    const { data: courseProgress } = await supabase
      .from('course_progress')
      .select('status, completion_percentage, time_spent_seconds')
      .eq('learner_id', learner.learnerId)

    const rows = (courseProgress as any[]) ?? []
    const coursesInProgress = rows.filter((r) => r.status === 'in_progress').length
    const coursesCompleted = rows.filter((r) => r.status === 'completed').length
    const totalTimeSpentSeconds = rows.reduce((sum, r) => sum + (r.time_spent_seconds ?? 0), 0)

    const { data: streak } = await supabase
      .from('learning_streaks')
      .select('current_streak_days, longest_streak_days')
      .eq('learner_id', learner.learnerId)
      .maybeSingle()

    const { count: achievementsCount } = await supabase
      .from('user_achievements')
      .select('user_achievement_id', { count: 'exact', head: true })
      .eq('learner_id', learner.learnerId)

    return NextResponse.json({
      data: {
        coursesInProgress,
        coursesCompleted,
        totalCourses: rows.length,
        totalTimeSpentSeconds,
        currentStreakDays: (streak as any)?.current_streak_days ?? 0,
        longestStreakDays: (streak as any)?.longest_streak_days ?? 0,
        achievementsEarned: achievementsCount ?? 0,
      },
    })
  } catch (e: any) {
    await logger.error({ error_type: 'dashboard_learning_error', message: e?.message, route: '/api/dashboard/learning' })
    return NextResponse.json({ error: 'Failed to load learning dashboard' }, { status: 500 })
  }
}
