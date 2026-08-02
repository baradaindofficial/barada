import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function GET() {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('learning_streaks')
      .select('current_streak_days, longest_streak_days, last_activity_date, streak_started_at')
      .eq('learner_id', learner.learnerId)
      .maybeSingle()

    if (error) throw error

    return NextResponse.json({
      data: data ?? {
        current_streak_days: 0,
        longest_streak_days: 0,
        last_activity_date: null,
        streak_started_at: null,
      },
    })
  } catch (e: any) {
    await logger.error({ error_type: 'dashboard_streak_error', message: e?.message, route: '/api/dashboard/streak' })
    return NextResponse.json({ error: 'Failed to load streak' }, { status: 500 })
  }
}
