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
      .from('course_progress')
      .select('course_id, status, completion_percentage, lessons_completed, lessons_total, last_accessed_at, started_at, completed_at')
      .eq('learner_id', learner.learnerId)
      .order('last_accessed_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data: { courses: data } })
  } catch (e: any) {
    await logger.error({ error_type: 'course_progress_list_error', message: e?.message, route: '/api/courses/progress' })
    return NextResponse.json({ error: 'Failed to load course progress' }, { status: 500 })
  }
}
