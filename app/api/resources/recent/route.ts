import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'

/**
 * GET /api/resources/recent
 * Returns learner's 10 most recently downloaded resources.
 */
export async function GET() {
  try {
    const auth = await getAuthenticatedLearner()
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { data } = await supabase
      .from('download_history')
      .select(`
        download_id, downloaded_at, entity_type, entity_id,
        assets(asset_id, asset_type, title, is_downloadable)
      `)
      .eq('learner_id', auth.learnerId)
      .order('downloaded_at', { ascending: false })
      .limit(10)

    const recent = (data || []).map((d: any) => ({
      downloadId: d.download_id,
      downloadedAt: d.downloaded_at,
      entityType: d.entity_type,
      entityId: d.entity_id,
      asset: d.assets,
    }))

    return NextResponse.json({ data: { recent } })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch recent downloads' }, { status: 500 })
  }
}
