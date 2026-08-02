import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/resources/popular
 * Returns top 10 most downloaded resources.
 * Public endpoint — no auth required (aggregate data only).
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('asset_download_stats')
      .select('asset_id, title, asset_type, total_downloads, unique_learners')
      .order('total_downloads', { ascending: false })
      .limit(10)

    return NextResponse.json({ data: { popular: data || [] } })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch popular resources' }, { status: 500 })
  }
}
