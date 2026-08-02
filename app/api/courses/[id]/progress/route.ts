import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('learner_id', learner.learnerId)
      .eq('course_id', params.id)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return NextResponse.json({
        data: {
          course_id: params.id,
          status: 'not_started',
          completion_percentage: 0,
          lessons_completed: 0,
          lessons_total: 0,
        },
      })
    }

    return NextResponse.json({ data })
  } catch (e: any) {
    await logger.error({ error_type: 'course_progress_detail_error', message: e?.message, route: '/api/courses/[id]/progress' })
    return NextResponse.json({ error: 'Failed to load course progress' }, { status: 500 })
  }
}
