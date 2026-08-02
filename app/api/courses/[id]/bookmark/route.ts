import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('course_id, title')
      .eq('course_id', params.id)
      .maybeSingle()

    if (courseError) throw courseError
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    const c = course as any

    const { data, error } = await (supabase.from('bookmarks') as any)
      .upsert(
        {
          learner_id: learner.learnerId,
          entity_type: 'course',
          entity_id: params.id,
          entity_title: c.title,
          entity_url: `/learn/${params.id}`,
        },
        { onConflict: 'learner_id,entity_type,entity_id' }
      )
      .select('bookmark_id, entity_type, entity_id, entity_title, entity_url, created_at')
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (e: any) {
    await logger.error({ error_type: 'course_bookmark_error', message: e?.message, route: '/api/courses/[id]/bookmark' })
    return NextResponse.json({ error: 'Failed to bookmark course' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('learner_id', learner.learnerId)
      .eq('entity_type', 'course')
      .eq('entity_id', params.id)

    if (error) throw error
    return NextResponse.json({ data: { removed: true } })
  } catch (e: any) {
    await logger.error({ error_type: 'course_unbookmark_error', message: e?.message, route: '/api/courses/[id]/bookmark' })
    return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 })
  }
}
