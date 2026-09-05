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
