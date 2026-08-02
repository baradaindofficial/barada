import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { updateLearningStreak } from '@/lib/services/streaks'
import { checkAndGrantAchievements } from '@/lib/services/achievements'
import { logger } from '@/lib/utils/logger'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const videoCompleted = body.videoCompleted ?? true
    const readingCompleted = body.readingCompleted ?? true
    const quizCompleted = body.quizCompleted ?? true
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

    const { error: upsertError } = await (supabase.from('lesson_progress') as any)
      .upsert(
        {
          learner_id: learner.learnerId,
          lesson_id: params.id,
          course_id: courseId,
          status: 'completed',
          video_completed: videoCompleted,
          reading_completed: readingCompleted,
          quiz_completed: quizCompleted,
          time_spent_seconds: timeSpentSeconds,
          completed_at: now,
          last_accessed_at: now,
          updated_at: now,
        },
        { onConflict: 'learner_id,lesson_id' }
      )

    if (upsertError) throw upsertError

    const { count: totalLessons } = await supabase
      .from('lessons')
      .select('lesson_id', { count: 'exact', head: true })
      .eq('course_id', courseId)

    const { count: completedLessons } = await supabase
      .from('lesson_progress')
      .select('progress_id', { count: 'exact', head: true })
      .eq('learner_id', learner.learnerId)
      .eq('course_id', courseId)
      .eq('status', 'completed')

    const total = totalLessons ?? 0
    const completed = completedLessons ?? 0
    const pct = total > 0 ? Math.round((completed / total) * 10000) / 100 : 0
    const courseStatus = total > 0 && completed >= total ? 'completed' : completed > 0 ? 'in_progress' : 'not_started'

    const { data: existingCourseProgress } = await supabase
      .from('course_progress')
      .select('started_at')
      .eq('learner_id', learner.learnerId)
      .eq('course_id', courseId)
      .maybeSingle()

    const priorStartedAt = (existingCourseProgress as any)?.started_at

    await (supabase.from('course_progress') as any).upsert(
      {
        learner_id: learner.learnerId,
        course_id: courseId,
        status: courseStatus,
        completion_percentage: pct,
        lessons_completed: completed,
        lessons_total: total,
        last_accessed_lesson_id: params.id,
        last_accessed_at: now,
        started_at: priorStartedAt ?? now,
        completed_at: courseStatus === 'completed' ? now : null,
        updated_at: now,
      },
      { onConflict: 'learner_id,course_id' }
    )

    const streak = await updateLearningStreak(learner.learnerId)
    const newAchievements = await checkAndGrantAchievements(learner.learnerId)

    return NextResponse.json({
      data: {
        lessonId: params.id,
        courseId,
        courseCompletionPercentage: pct,
        courseStatus,
        streak,
        newAchievements,
      },
    })
  } catch (e: any) {
    await logger.error({ error_type: 'lesson_complete_error', message: e?.message, route: '/api/lessons/[id]/complete' })
    return NextResponse.json({ error: 'Failed to mark lesson complete' }, { status: 500 })
  }
}
