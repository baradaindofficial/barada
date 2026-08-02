import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function GET() {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()

    const { data: allAchievements, error: allError } = await supabase
      .from('achievements')
      .select('achievement_id, code, title, description, icon, sort_order')
      .eq('is_active', true)
      .order('sort_order')

    if (allError) throw allError

    const { data: earned, error: earnedError } = await supabase
      .from('user_achievements')
      .select('achievement_id, earned_at')
      .eq('learner_id', learner.learnerId)

    if (earnedError) throw earnedError

    const earnedMap = new Map(((earned as any[]) ?? []).map((e) => [e.achievement_id, e.earned_at]))

    const combined = ((allAchievements as any[]) ?? []).map((a) => ({
      ...a,
      earned: earnedMap.has(a.achievement_id),
      earnedAt: earnedMap.get(a.achievement_id) ?? null,
    }))

    return NextResponse.json({ data: { achievements: combined } })
  } catch (e: any) {
    await logger.error({ error_type: 'dashboard_achievements_error', message: e?.message, route: '/api/dashboard/achievements' })
    return NextResponse.json({ error: 'Failed to load achievements' }, { status: 500 })
  }
}
