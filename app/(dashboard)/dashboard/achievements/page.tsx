import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getLearnerAchievements } from '@/lib/db/achievements'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Achievements',
  robots: { index: false },
}

const ICON_MAP: Record<string, string> = {
  GraduationCap: '\uD83C\uDF93',
  Trophy: '\uD83C\uDFC6',
  Flame: '\uD83D\uDD25',
  BookOpen: '\uD83D\uDCD6',
  Award: '\uD83C\uDFC5',
  CheckCircle: '\u2705',
  Star: '\u2B50',
}

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard/achievements')

  const achievements = await getLearnerAchievements(user.id)
  const earnedCount = achievements.filter(a => a.earned).length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">&larr; Dashboard</Link>
            <div className="font-display font-bold text-[#0D183D] text-lg">Achievements</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-[#0D183D] mb-1">Your Achievements</h1>
          <p className="text-gray-500 text-sm">{earnedCount} of {achievements.length} unlocked</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((a) => (
            <div
              key={a.achievementId}
              className={`rounded-xl p-5 border text-center ${
                a.earned
                  ? 'bg-white border-gray-200 shadow-sm'
                  : 'bg-gray-100 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-4xl mb-3">{ICON_MAP[a.icon] ?? '\uD83C\uDFC5'}</div>
              <div className="font-bold text-sm text-[#0D183D] mb-1">{a.title}</div>
              <div className="text-xs text-gray-500 mb-2">{a.description}</div>
              {a.earned ? (
                <div className="text-xs font-semibold text-[#1A7F56]">
                  Earned {new Date(a.earnedAt!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              ) : (
                <div className="text-xs font-semibold text-gray-400">Locked</div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
