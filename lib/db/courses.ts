import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CourseCatalogItem } from '@/types'

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

/**
 * Same as getAllPublishedCourses(), plus a published module/lesson count per
 * course -- used by the /academy catalog and dashboard recommendations,
 * which need a lesson count for card display. Mirrors the counting pattern
 * already used in app/api/courses/route.ts.
 */
function mapCourseCatalogItem(course: any, moduleCount: number, lessonCount: number): CourseCatalogItem {
  return {
    courseId: course.course_id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle ?? null,
    category: course.category,
    difficulty: course.difficulty,
    icon: course.icon ?? null,
    themeColor: course.theme_color ?? null,
    isFree: course.is_free,
    certPricePaise: course.cert_price_paise,
    sortOrder: course.sort_order,
    estimatedHours: course.estimated_hours ?? null,
    outcomes: course.outcomes ?? [],
    targetAudience: course.target_audience ?? [],
    moduleCount,
    lessonCount,
  }
}

export async function getAllPublishedCoursesWithCounts(): Promise<CourseCatalogItem[]> {
  const supabase = await createClient()
  const courses = await getAllPublishedCourses()

  // lessons RLS ("public: free preview lessons") only allows the anon/public
  // role to SELECT rows where is_free_preview = true, so a request-scoped
  // (anon) count of lessons undercounts every course down to its free-preview
  // lesson count. Catalog display needs the true published lesson total, not
  // per-lesson content, so the lesson count -- and only the count, via
  // head:true which returns zero rows -- runs through the service-role
  // client. Course/module RLS already allow public reads of published rows,
  // so those stay on the normal request-scoped client.
  const admin = createAdminClient()

  const enriched = await Promise.all(
    (courses || []).map(async (course: any) => {
      const { count: moduleCount } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', course.course_id)
        .eq('status', 'published')

      const { count: lessonCount } = await admin
        .from('lessons')
        .select('lesson_id', { count: 'exact', head: true })
        .eq('course_id', course.course_id)
        .eq('status', 'published')

      return mapCourseCatalogItem(course, moduleCount || 0, lessonCount || 0)
    })
  )

  return enriched
}

/**
 * Aggregate, catalog-wide stats for the /academy page's social-proof strip.
 * All real counts -- no fabricated numbers. Module/lesson/hour totals come
 * from the already-fetched published-course list (no extra DB round trip).
 * Enrollment count needs the service-role client: the `enrollments` table's
 * RLS ("learner: read own enrollments") restricts SELECT/count to the
 * learner's own rows, so the anon role would always see 0 -- same class of
 * issue as the lesson-count fix. Only a count is read; no enrollment rows
 * or learner identities are exposed.
 */
export async function getAcademyStats(): Promise<{
  courseCount: number
  lessonCount: number
  totalHours: number
  learnerCount: number
}> {
  const courses = await getAllPublishedCoursesWithCounts()
  const lessonCount = courses.reduce((sum, c) => sum + c.lessonCount, 0)
  const totalHours = Math.round(courses.reduce((sum, c) => sum + (c.estimatedHours || 0), 0))

  const admin = createAdminClient()
  const { count: learnerCount } = await admin
    .from('enrollments')
    .select('learner_id', { count: 'exact', head: true })

  return {
    courseCount: courses.length,
    lessonCount,
    totalHours,
    learnerCount: learnerCount || 0,
  }
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
