"""
Updates app/(dashboard)/dashboard/page.tsx to add:
  - a streak badge in the Welcome section (shown only if streak.current > 0)
  - an Achievements stat card in the stats grid

Preserves everything else in the file exactly as-is.

Run from repo root: py step4_update_dashboard_page.py
"""

FILE_PATH = "app/(dashboard)/dashboard/page.tsx"
EXPECTED_OLD_MARKER = "getLearnerEnrollments } from '@/lib/db/enrollments'"

NEW_CONTENT = """import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getLearner, getLearnerStats } from '@/lib/db/learners'
import { getLearnerEnrollments } from '@/lib/db/enrollments'
import { getLearnerStreak, getAchievementCount } from '@/lib/db/learner-engagement'
import { COURSES } from '@/data/courses'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard')

  const [learner, stats, enrollments, streak, achievementCount] = await Promise.all([
    getLearner(user.id),
    getLearnerStats(user.id),
    getLearnerEnrollments(user.id),
    getLearnerStreak(user.id),
    getAchievementCount(user.id),
  ])

  const enrolledCourses = enrollments.map((e: any) => ({
    enrollment: e,
    course: COURSES.find(c => c.slug === e.courseSlug),
  })).filter((x: any) => x.course)

  const firstName = learner?.name.split(' ')[0] ?? 'there'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="font-display font-bold text-[#0D183D] text-lg">Dashboard</div>
            <div className="text-gray-400 text-xs">Barada Academy</div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/academy" className="text-sm text-gray-600 hover:text-[#0D183D] font-medium">Browse Courses</Link>
            <form action="/api/auth/signout" method="POST">
              <button className="text-sm text-gray-400 hover:text-gray-600">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="bg-gradient-to-br from-[#0D183D] to-[#1A2B5E] rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <p className="text-white/50 text-sm">Good to see you 👋</p>
            {streak.current > 0 && (
              <span className="inline-flex items-center gap-1 bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">
                🔥 {streak.current} day{streak.current > 1 ? 's' : ''} streak
              </span>
            )}
          </div>
          <h1 className="font-display font-bold text-2xl mb-2">Welcome back, {firstName}.</h1>
          {enrolledCourses.length > 0 ? (
            <p className="text-white/60 text-sm mb-4">
              You have {enrolledCourses.length} course{enrolledCourses.length > 1 ? 's' : ''} in progress.
            </p>
          ) : (
            <p className="text-white/60 text-sm mb-4">Start your first course today — free to learn.</p>
          )}
          <Link href="/academy" className="inline-block bg-[#D4AF37] text-[#0D183D] font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#c4a030] transition-colors">
            {enrolledCourses.length > 0 ? 'Continue Learning →' : 'Browse Courses →'}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { value: stats.enrolledCount.toString(),    label: 'Courses Enrolled' },
            { value: stats.completedCount.toString(),   label: 'Courses Completed' },
            { value: stats.certificateCount.toString(), label: 'Certificates' },
            { value: formatTime(stats.totalWatchSeconds), label: 'Time Learning' },
            { value: achievementCount.toString(),       label: 'Achievements' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="font-display font-black text-2xl text-[#0D183D] mb-1">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-[#0D183D]">My Courses</h2>
            <Link href="/academy" className="text-sm font-semibold text-[#0D183D] hover:underline">Browse all →</Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-[#0D183D] mb-2">No courses yet</h3>
              <p className="text-gray-500 text-sm mb-4">Browse our 10 flagship courses — all free to start.</p>
              <Link href="/academy" className="inline-block bg-[#0D183D] text-white px-5 py-2 rounded-lg font-bold text-sm">Browse Courses</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrolledCourses.map(({ enrollment, course }: any) => (
                <div key={enrollment.courseSlug} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${course!.themeColor}22` }}>
                    {course!.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#0D183D] text-sm mb-1 truncate">{course!.title}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#D11A1A]" style={{ width: `${enrollment.completionPercentage}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{enrollment.completionPercentage}%</span>
                    </div>
                  </div>
                  <Link href={`/learn/${enrollment.courseSlug}/module-1/lesson-1`}
                    className="flex-shrink-0 bg-[#0D183D] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#1a2b5e] transition-colors">
                    {enrollment.completionPercentage > 0 ? 'Continue' : 'Start'} →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function formatTime(seconds: number) {
  if (seconds < 60) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
"""

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: Could not find {FILE_PATH}")
        return

    if EXPECTED_OLD_MARKER not in content:
        print("WARNING: File doesn't match the expected known content.")
        print("Not overwriting -- please check the file manually before proceeding.")
        return

    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(NEW_CONTENT)

    print(f"SUCCESS: {FILE_PATH} updated with streak badge + achievements stat.")

if __name__ == "__main__":
    main()
