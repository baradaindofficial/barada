import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { logger } from '@/lib/utils/logger'

/**
 * DELETE /api/bookmarks/[bookmarkId] — removes a bookmark
 * Learner can only delete their own bookmarks.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { bookmarkId: string } }
) {
  try {
    const auth = await getAuthenticatedLearner()
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('bookmark_id', params.bookmarkId)
      .eq('learner_id', auth.learnerId) // strict ownership

    if (error) throw error
    return NextResponse.json({ data: { deleted: true } })
  } catch (e: any) {
    await logger.error({ error_type: 'bookmark_delete_error', message: e?.message })
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 })
  }
}
