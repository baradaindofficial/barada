import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { logger } from '@/lib/utils/logger'

/**
 * GET  /api/bookmarks — returns learner's bookmarks
 * POST /api/bookmarks — creates a bookmark
 */
export async function GET() {
  try {
    const auth = await getAuthenticatedLearner()
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { data } = await supabase
      .from('bookmarks')
      .select('bookmark_id, entity_type, entity_id, entity_title, entity_url, notes, created_at')
      .eq('learner_id', auth.learnerId)
      .order('created_at', { ascending: false })

    return NextResponse.json({ data: { bookmarks: data || [] } })
  } catch (e: any) {
    await logger.error({ error_type: 'bookmark_fetch_error', message: e?.message, route: '/api/bookmarks' })
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthenticatedLearner()
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let body: any
    try { body = await req.json() } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { entityType, entityId, entityTitle, entityUrl, notes } = body
    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'entityType and entityId are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await (supabase as any)
      .from('bookmarks')
      .upsert({
        learner_id: auth.learnerId,
        entity_type: entityType,
        entity_id: entityId,
        entity_title: entityTitle || null,
        entity_url: entityUrl || null,
        notes: notes || null,
        app_id: 'academy',
        created_at: new Date().toISOString(),
      }, { onConflict: 'learner_id,entity_type,entity_id' })
      .select('bookmark_id')
      .single()

    if (error) throw error

    return NextResponse.json({ data: { bookmarkId: (data as any).bookmark_id } }, { status: 201 })
  } catch (e: any) {
    await logger.error({ error_type: 'bookmark_create_error', message: e?.message, route: '/api/bookmarks' })
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 })
  }
}
