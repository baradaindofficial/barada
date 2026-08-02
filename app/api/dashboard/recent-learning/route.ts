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
      .from('learner_recent_activity')
      .select('*')
      .eq('learner_id', learner.learnerId)
      .limit(10)

    if (error) throw error
    return NextResponse.json({ data: { recent: data } })
  } catch (e: any) {
    await logger.error({ error_type: 'dashboard_recent_learning_error', message: e?.message, route: '/api/dashboard/recent-learning' })
    return NextResponse.json({ error: 'Failed to load recent learning' }, { status: 500 })
  }
}
