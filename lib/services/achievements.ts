import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

type AchievementCode =
  | 'first_lesson'
  | 'first_course'
  | 'streak_7'
  | 'streak_30'
  | 'lessons_100'
  | 'assessment_master'
  | 'course_completion'
  | 'top_learner'

const POSTGRES_UNIQUE_VIOLATION = '23505'

async function grantAchievement(
  admin: ReturnType<typeof createAdminClient>,
  learnerId: string,
  code: AchievementCode
): Promise<boolean> {
  const { data: achievement } = await admin
    .from('achievements')
    .select('achievement_id')
    .eq('code', code)
    .maybeSingle()

  if (!achievement) return false

  const { error } = await (admin.from('user_achievements') as any).insert({
    learner_id: learnerId,
    achievement_id: (achievement as any).achievement_id,
  })

  if (error) {
    if ((error as any).code === POSTGRES_UNIQUE_VIOLATION) return false // already earned
    await logger.error({
      error_type: 'achievement_grant_error',
      message: (error as any).message,
      route: 'lib/services/achievements',
    })
    return false
  }
  return true
}

/**
 * Checks current learner stats against all achievement criteria and grants
 * any newly-earned badges. Server-only — writes via service role.
 * Call after any learning event that could satisfy a criterion
 * (lesson complete, course complete, streak update, evaluation graded).
 *
 * Returns the list of achievement codes newly granted in this call
 * (empty array if none — most calls will grant nothing new).
 */
export async function checkAndGrantAchievements(learnerId: string): Promise<string[]> {
  const admin = createAdminClient()
  const granted: string[] = []

  const { count: lessonCount } = await admin
    .from('lesson_progress')
    .select('progress_id', { count: 'exact', head: true })
    .eq('learner_id', learnerId)
    .eq('status', 'completed')

  if ((lessonCount ?? 0) >= 1 && (await grantAchievement(admin, learnerId, 'first_lesson'))) {
    granted.push('first_lesson')
  }
  if ((lessonCount ?? 0) >= 100 && (await grantAchievement(admin, learnerId, 'lessons_100'))) {
    granted.push('lessons_100')
  }

  const { count: courseCount } = await admin
    .from('course_progress')
    .select('progress_id', { count: 'exact', head: true })
    .eq('learner_id', learnerId)
    .eq('status', 'completed')

  if ((courseCount ?? 0) >= 1 && (await grantAchievement(admin, learnerId, 'first_course'))) {
    granted.push('first_course')
  }
  if ((courseCount ?? 0) >= 5 && (await grantAchievement(admin, learnerId, 'course_completion'))) {
    granted.push('course_completion')
  }

  const { data: streak } = await admin
    .from('learning_streaks')
    .select('current_streak_days')
    .eq('learner_id', learnerId)
    .maybeSingle()

  const currentStreak = (streak as any)?.current_streak_days ?? 0
  if (currentStreak >= 7 && (await grantAchievement(admin, learnerId, 'streak_7'))) {
    granted.push('streak_7')
  }
  if (currentStreak >= 30 && (await grantAchievement(admin, learnerId, 'streak_30'))) {
    granted.push('streak_30')
  }

  // NOTE: queries assessment_attempts (current, Sprint 4.2 table).
  // quiz_attempts is a legacy table not used here — flag to CTO if wrong.
  const { count: highScoreCount } = await admin
    .from('assessment_attempts')
    .select('attempt_id', { count: 'exact', head: true })
    .eq('learner_id', learnerId)
    .gte('score', 90)

  if ((highScoreCount ?? 0) >= 5 && (await grantAchievement(admin, learnerId, 'assessment_master'))) {
    granted.push('assessment_master')
  }

  return granted
}
