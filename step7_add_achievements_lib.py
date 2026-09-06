"""
Creates lib/db/achievements.ts -- calls the evaluate_and_award_achievements
RPC (must already exist in Supabase -- see award_achievements.sql), then
fetches all 8 achievement definitions joined against what this learner
has actually earned, for display.

Run from repo root: py step7_add_achievements_lib.py
"""
import os

FILE_PATH = "lib/db/achievements.ts"

CONTENT = """import { createClient } from '@/lib/supabase/server'

export interface AchievementDisplay {
  achievementId: string
  code: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedAt: string | null
}

/**
 * Runs the awarding engine for this learner (idempotent -- safe to call on
 * every dashboard load), then returns all 8 achievement definitions with
 * each one's earned/locked status for this learner.
 */
export async function getLearnerAchievements(learnerId: string): Promise<AchievementDisplay[]> {
  const supabase = await createClient()

  // Evaluate and award anything newly earned. Errors here are logged but
  // don't block the page -- a failed award check shouldn't break the
  // dashboard, it just means achievements won't be up to the second.
  const { error: awardError } = await (supabase as any).rpc('evaluate_and_award_achievements', {
    p_learner_id: learnerId,
  })
  if (awardError) {
    console.error('[getLearnerAchievements] award evaluation failed:', awardError.message)
  }

  const { data: allAchievements, error: achievementsError } = await (supabase as any)
    .from('achievements')
    .select('achievement_id, code, title, description, icon')
    .order('created_at', { ascending: true })

  if (achievementsError) {
    throw new Error(`[getLearnerAchievements] failed to load achievements: ${achievementsError.message}`)
  }

  const { data: earned, error: earnedError } = await (supabase as any)
    .from('user_achievements')
    .select('achievement_id, earned_at')
    .eq('learner_id', learnerId)

  if (earnedError) {
    throw new Error(`[getLearnerAchievements] failed to load earned achievements: ${earnedError.message}`)
  }

  const earnedMap = new Map((earned ?? []).map((e: any) => [e.achievement_id, e.earned_at]))

  return (allAchievements ?? []).map((a: any) => ({
    achievementId: a.achievement_id,
    code: a.code,
    title: a.title,
    description: a.description,
    icon: a.icon,
    earned: earnedMap.has(a.achievement_id),
    earnedAt: earnedMap.get(a.achievement_id) ?? null,
  }))
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
