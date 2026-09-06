"""
Creates app/(dashboard)/dashboard/analytics/page.tsx -- learner-facing
analytics: weekly time-spent bar chart, lessons-per-week bar chart,
completion velocity stat, and a 90-day activity heatmap. All charts are
plain SVG (no charting library is installed in this project).

Run from repo root: py step11_add_learner_analytics_page.py
"""
import os

FILE_PATH = "app/(dashboard)/dashboard/analytics/page.tsx"

CONTENT = """import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getWeeklyActivity, getCompletionVelocity, getActivityHeatmap } from '@/lib/db/analytics'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Analytics',
  robots: { index: false },
}

function formatHours(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

function BarChart({ data, valueKey, label, color }: { data: any[]; valueKey: string; label: string; color: string }) {
  const max = Math.max(1, ...data.map((d) => d[valueKey]))
  return (
    <div>
      <div className="text-sm font-semibold text-[#0D183D] mb-3">{label}</div>
      {data.length === 0 ? (
        <div className="text-xs text-gray-400 py-8 text-center">No activity yet</div>
      ) : (
        <div className="flex items-end gap-2 h-32">
          {data.map((d, i) => {
            const heightPct = Math.max(4, (d[valueKey] / max) * 100)
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end h-24">
                  <div
                    className="w-full rounded-t"
                    style={{ height: `${heightPct}%`, background: color, minHeight: 2 }}
                    title={`${d.weekStart}: ${d[valueKey]}`}
                  />
                </div>
                <div className="text-[10px] text-gray-400">
                  {new Date(d.weekStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ActivityHeatmap({ data }: { data: { date: string; hasActivity: boolean; lessonsCompleted: number }[] }) {
  // Group into weeks (columns of 7 days) for a GitHub-style grid.
  const weeks: typeof data[] = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  function colorFor(count: number) {
    if (count === 0) return '#F1F5F9'
    if (count === 1) return '#BBF7D0'
    if (count <= 3) return '#4ADE80'
    return '#16A34A'
  }

  return (
    <div>
      <div className="text-sm font-semibold text-[#0D183D] mb-3">Activity (last 90 days)</div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.lessonsCompleted} lesson(s)`}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 2,
                  background: colorFor(day.lessonsCompleted),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard/analytics')

  const [weekly, velocity, heatmap] = await Promise.all([
    getWeeklyActivity(user.id, 8),
    getCompletionVelocity(user.id),
    getActivityHeatmap(user.id, 90),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">&larr; Dashboard</Link>
          <div className="font-display font-bold text-[#0D183D] text-lg">My Analytics</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm font-semibold text-[#0D183D] mb-1">Completion Pace</div>
          {velocity.averageDaysPerLesson === null ? (
            <div className="text-xs text-gray-400">Complete a few more lessons to see your pace.</div>
          ) : (
            <div className="text-2xl font-black text-[#0D183D]">
              {velocity.averageDaysPerLesson} <span className="text-sm font-normal text-gray-400">days per lesson on average</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <BarChart data={weekly} valueKey="totalSeconds" label="Weekly Time Spent" color="#D11A1A" />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <BarChart data={weekly} valueKey="lessonsCompleted" label="Lessons Completed per Week" color="#0D183D" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <ActivityHeatmap data={heatmap} />
        </div>
      </main>
    </div>
  )
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
