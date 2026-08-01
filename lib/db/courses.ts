import { createClient } from '@/lib/supabase/server'

export async function getAllPublishedCourses() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('course_id, slug, title, subtitle, category, difficulty, icon, theme_color, is_free, cert_price_paise, sort_order, estimated_hours, status, outcomes, target_audience, domain_id')
    .eq('status', 'published')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*, modules(module_id, module_number, title, description, status, lessons(lesson_id, lesson_number, title, description, duration_seconds, is_free_preview, status, sort_order))')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) throw error
  return data as any
}

export async function getLessonWithAssets(
  courseSlug: string,
  moduleNumber: number,
  lessonNumber: number
) {
  const supabase = await createClient()

  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('course_id, slug, title')
    .eq('slug', courseSlug)
    .single()
  if (courseError || !course) return null
  const c = course as any

  const { data: mod, error: modError } = await supabase
    .from('modules')
    .select('module_id, module_number, title')
    .eq('course_id', c.course_id)
    .eq('module_number', moduleNumber)
    .single()
  if (modError || !mod) return null
  const m = mod as any

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', m.module_id)
    .eq('lesson_number', lessonNumber)
    .single()
  if (lessonError || !lesson) return null
  const l = lesson as any

  const { data: attachments } = await supabase
    .from('asset_attachments')
    .select('role, sort_order, assets(asset_id, asset_type, title, provider_id, provider_ref, resolved_url, status, is_downloadable, duration_seconds, mime_type)')
    .eq('entity_type', 'lesson')
    .eq('entity_id', l.lesson_id)

  const { data: allLessons } = await supabase
    .from('lessons')
    .select('lesson_id, lesson_number, title, module_id, sort_order')
    .eq('course_id', c.course_id)
    .eq('status', 'published')
    .order('sort_order')

  return {
    course: c,
    module: m,
    lesson: l,
    attachments: attachments || [],
    allLessons: allLessons || [],
  }
}
