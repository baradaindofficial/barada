import { createAdminClient } from '@/lib/supabase/admin'

export interface StreakResult {
  current_streak_days: number
  longest_streak_days: number
}

/**
 * Recalculates and updates a learner's daily streak.
 * Server-only — writes via service role (bypasses RLS), so this must only
 * ever be called from trusted server code after a verified learning event
 * (e.g. lesson completion), never directly from a client-facing input.
 */
export async function updateLearningStreak(learnerId: string): Promise<StreakResult> {
  const admin = createAdminClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data: existing } = await admin
    .from('learning_streaks')
    .select('current_streak_days, longest_streak_days, last_activity_date, streak_started_at')
    .eq('learner_id', learnerId)
    .maybeSingle()

  const row = existing as any

  if (!row) {
    const { error } = await (admin.from('learning_streaks') as any).insert({
      learner_id: learnerId,
      current_streak_days: 1,
      longest_streak_days: 1,
      last_activity_date: today,
      streak_started_at: today,
    })
    if (error) throw error
    return { current_streak_days: 1, longest_streak_days: 1 }
  }

  if (row.last_activity_date === today) {
    return {
      current_streak_days: row.current_streak_days,
      longest_streak_days: row.longest_streak_days,
    }
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const consecutive = row.last_activity_date === yesterday

  const newCurrent = consecutive ? row.current_streak_days + 1 : 1
  const newLongest = Math.max(newCurrent, row.longest_streak_days)
  const newStreakStart = consecutive ? row.streak_started_at : today

  const { error } = await (admin.from('learning_streaks') as any)
    .update({
      current_streak_days: newCurrent,
      longest_streak_days: newLongest,
      last_activity_date: today,
      streak_started_at: newStreakStart,
      updated_at: new Date().toISOString(),
    })
    .eq('learner_id', learnerId)

  if (error) throw error
  return { current_streak_days: newCurrent, longest_streak_days: newLongest }
}
