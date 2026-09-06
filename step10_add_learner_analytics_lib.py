"""
Creates lib/db/analytics.ts -- learner-facing analytics data functions:
weekly time-spent, completion velocity, streak activity heatmap data,
lessons completed per week. All derived from lesson_progress, since
learning_streaks only stores running totals, not day-by-day history.

Run from repo root: py step10_add_learner_analytics_lib.py
"""
import os

FILE_PATH = "lib/db/analytics.ts"

CONTENT = """import { createClient } from '@/lib/supabase/server'

export interface WeeklyDataPoint {
  weekStart: string
  totalSeconds: number
  lessonsCompleted: number
}

export interface DailyActivity {
  date: string
  hasActivity: boolean
  lessonsCompleted: number
}

export interface CompletionVelocity {
  averageDaysPerLesson: number | null
  totalLessonsCompleted: number
  firstActivityDate: string | null
  lastActivityDate: string | null
}

/**
 * Time spent and lessons completed, grouped by week, for the last N weeks.
 * Used for the "weekly time-spent trend" and "lessons completed per week" charts.
 */
export async function getWeeklyActivity(learnerId: string, weeks: number = 8): Promise<WeeklyDataPoint[]> {
  const supabase = await createClient()
  const since = new Date()
  since.setDate(since.getDate() - weeks * 7)

  const { data, error } = await (supabase as any)
    .from('lesson_progress')
    .select('time_spent_seconds, last_accessed_at, status')
    .eq('learner_id', learnerId)
    .gte('last_accessed_at', since.toISOString())

  if (error) {
    throw new Error(`[getWeeklyActivity] failed: ${error.message}`)
  }

  // Bucket into week-start (Monday) keys.
  const buckets = new Map<string, { totalSeconds: number; lessonsCompleted: number }>()

  for (const row of data ?? []) {
    if (!row.last_accessed_at) continue
    const d = new Date(row.last_accessed_at)
    const day = d.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    const monday = new Date(d)
    monday.setDate(d.getDate() + diffToMonday)
    monday.setHours(0, 0, 0, 0)
    const key = monday.toISOString().slice(0, 10)

    const existing = buckets.get(key) ?? { totalSeconds: 0, lessonsCompleted: 0 }
    existing.totalSeconds += row.time_spent_seconds ?? 0
    if (row.status === 'completed') existing.lessonsCompleted += 1
    buckets.set(key, existing)
  }

  return Array.from(buckets.entries())
    .map(([weekStart, v]) => ({ weekStart, ...v }))
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart))
}

/**
 * Average days between lesson completions -- a simple "pace" metric.
 * Null if fewer than 2 completed lessons (not enough data for a rate).
 */
export async function getCompletionVelocity(learnerId: string): Promise<CompletionVelocity> {
  const supabase = await createClient()
  const { data, error } = await (supabase as any)
    .from('lesson_progress')
    .select('completed_at')
    .eq('learner_id', learnerId)
    .eq('status', 'completed')
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: true })

  if (error) {
    throw new Error(`[getCompletionVelocity] failed: ${error.message}`)
  }

  const dates = (data ?? []).map((r: any) => new Date(r.completed_at))
  if (dates.length < 2) {
    return {
      averageDaysPerLesson: null,
      totalLessonsCompleted: dates.length,
      firstActivityDate: dates[0]?.toISOString() ?? null,
      lastActivityDate: dates[0]?.toISOString() ?? null,
    }
  }

  const first = dates[0]
  const last = dates[dates.length - 1]
  const totalDays = (last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
  const averageDaysPerLesson = totalDays / (dates.length - 1)

  return {
    averageDaysPerLesson: Math.round(averageDaysPerLesson * 10) / 10,
    totalLessonsCompleted: dates.length,
    firstActivityDate: first.toISOString(),
    lastActivityDate: last.toISOString(),
  }
}

/**
 * Day-by-day activity for the last N days, for a GitHub-style heatmap.
 * "Activity" = any lesson_progress row last_accessed_at that day.
 */
export async function getActivityHeatmap(learnerId: string, days: number = 90): Promise<DailyActivity[]> {
  const supabase = await createClient()
  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  const { data, error } = await (supabase as any)
    .from('lesson_progress')
    .select('last_accessed_at, status')
    .eq('learner_id', learnerId)
    .gte('last_accessed_at', since.toISOString())

  if (error) {
    throw new Error(`[getActivityHeatmap] failed: ${error.message}`)
  }

  const byDate = new Map<string, number>()
  for (const row of data ?? []) {
    if (!row.last_accessed_at) continue
    const key = new Date(row.last_accessed_at).toISOString().slice(0, 10)
    if (row.status === 'completed') {
      byDate.set(key, (byDate.get(key) ?? 0) + 1)
    } else if (!byDate.has(key)) {
      byDate.set(key, 0)
    }
  }

  const result: DailyActivity[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    result.push({
      date: key,
      hasActivity: byDate.has(key),
      lessonsCompleted: byDate.get(key) ?? 0,
    })
  }
  return result
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
