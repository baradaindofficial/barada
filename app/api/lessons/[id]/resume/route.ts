import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const resumePositionSeconds = body.resumePositionSeconds ?? 0
    const timeSpentSeconds = body.timeSpentSeconds ?? 0

    const supabase = await createClient()

    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('lesson_id, course_id')
      .eq('lesson_id', params.id)
      .maybeSingle()

    if (lessonError) throw lessonError
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })

    const courseId = (lesson as any).course_id
    const now = new Date().toISOString()

    const { data: existing } = await supabase
      .from('lesson_progress')
      .select('status, time_spent_seconds, started_at')
      .eq('learner_id', learner.learnerId)
      .eq('lesson_id', params.id)
      .maybeSingle()

    const existingRow = existing as any
    const newStatus = existingRow?.status === 'completed' ? 'completed' : 'in_progress'
    const priorTimeSpent = existingRow?.time_spent_seconds ?? 0

    const { error: upsertError } = await (supabase.from('lesson_progress') as any).upsert(
      {
        learner_id: learner.learnerId,
        lesson_id: params.id,
        course_id: courseId,
        status: newStatus,
        resume_position_seconds: resumePositionSeconds,
        time_spent_seconds: priorTimeSpent + timeSpentSeconds,
        started_at: existingRow?.started_at ?? now,
        last_accessed_at: now,
        updated_at: now,
      },
      { onConflict: 'learner_id,lesson_id' }
    )

    if (upsertError) throw upsertError

    await (supabase.from('course_progress') as any)
      .update({ last_accessed_lesson_id: params.id, last_accessed_at: now })
      .eq('learner_id', learner.learnerId)
      .eq('course_id', courseId)

    return NextResponse.json({
      data: { lessonId: params.id, resumePositionSeconds, status: newStatus },
    })
  } catch (e: any) {
    await logger.error({ error_type: 'lesson_resume_error', message: e?.message, route: '/api/lessons/[id]/resume' })
    return NextResponse.json({ error: 'Failed to save resume position' }, { status: 500 })
  }
}
