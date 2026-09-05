"""
Creates lib/db/learner-engagement.ts -- streak and achievement-count lookups,
using the real schema column names (current_streak_days, longest_streak_days)
confirmed via Supabase during this session.

Run from repo root: py step3_add_engagement_file.py
"""
import os

FILE_PATH = "lib/db/learner-engagement.ts"

CONTENT = '''import { createClient } from '@/lib/supabase/server'

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
'''

def main():
    if os.path.exists(FILE_PATH):
        print(f"WARNING: {FILE_PATH} already exists. Not overwriting.")
        print("Delete it manually first if you want to regenerate it.")
        return

    os.makedirs(os.path.dirname(FILE_PATH), exist_ok=True)
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(CONTENT)
    print(f"SUCCESS: Created {FILE_PATH}")

if __name__ == "__main__":
    main()
