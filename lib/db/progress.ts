import { createClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProgress(d: any) {
  return { courseSlug: d.course_slug, moduleNumber: d.module_number, lessonNumber: d.lesson_number, isCompleted: d.is_completed, completedAt: d.completed_at, watchedSeconds: d.watched_seconds }
}

export async function getCourseProgress(learnerId: string, courseSlug: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).from('lesson_progress').select('*').eq('learner_id', learnerId).eq('course_slug', courseSlug)
  return (data ?? []).map(mapProgress)
}

export async function markLessonComplete(learnerId: string, courseSlug: string, moduleNumber: number, lessonNumber: number) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('lesson_progress').upsert({ learner_id: learnerId, course_slug: courseSlug, module_number: moduleNumber, lesson_number: lessonNumber, is_completed: true, completed_at: new Date().toISOString() }, { onConflict: 'learner_id,course_slug,module_number,lesson_number' })
  return { error }
}

export async function updateWatchProgress(learnerId: string, courseSlug: string, moduleNumber: number, lessonNumber: number, watchedSeconds: number) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('lesson_progress').upsert({ learner_id: learnerId, course_slug: courseSlug, module_number: moduleNumber, lesson_number: lessonNumber, watched_seconds: watchedSeconds, last_watched_at: new Date().toISOString() }, { onConflict: 'learner_id,course_slug,module_number,lesson_number' })
  return { error }
}
