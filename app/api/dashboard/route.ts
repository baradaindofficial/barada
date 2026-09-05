import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDashboardOverview } from '@/lib/db/dashboard-overview'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: learner, error: learnerError } = await supabase
    .from('learners')
    .select('learner_id, name, email, profession, avatar_url, created_at')
    .eq('learner_id', user.id)
    .single()

  if (learnerError || !learner) {
    console.error('[api/dashboard] learner lookup failed:', learnerError?.message)
    return NextResponse.json({ error: 'Learner not found' }, { status: 404 })
  }

  try {
    const overview = await getDashboardOverview(learner.learner_id)
    return NextResponse.json({ learner, ...overview })
  } catch (err) {
    console.error('[api/dashboard] overview failed:', err)
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}