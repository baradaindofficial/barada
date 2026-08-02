import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function MyCoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: learnerRaw } = await supabase
    .from('learners').select('learner_id').eq('id', user.id).single()
  const learner = learnerRaw as any

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('enrollment_id, course_slug, course_id, enrolled_at')
    .eq('learner_id', learner?.learner_id)
    .order('enrolled_at', { ascending: false })

  // Completion % source of truth per ADR-008 — NOT enrollments.completion_percentage
  const { data: progressRows } = await supabase
    .from('course_progress')
    .select('course_id, completion_percentage')
    .eq('learner_id', learner?.learner_id)

  const progressByCourseId = new Map(
    ((progressRows as any[]) ?? []).map((p) => [p.course_id, p.completion_percentage])
  )

  const courses = await Promise.all(
    (enrollments || []).map(async (e: any) => {
      const { data: course } = await supabase
        .from('courses')
        .select('course_id, slug, title, icon, theme_color, category, difficulty')
        .eq('slug', e.course_slug)
        .maybeSingle()
      const resolvedCourseId = (course as any)?.course_id ?? e.course_id
      return {
        ...e,
        course: course as any,
        completion_percentage: progressByCourseId.get(resolvedCourseId) ?? 0,
      }
    })
  )

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#6B7280', fontSize: '0.82rem', textDecoration: 'none' }}>&larr; Dashboard</Link>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.75rem', marginTop: '0.5rem' }}>My Courses</h1>
        <p style={{ color: '#6B7280' }}>{courses.length} course{courses.length !== 1 ? 's' : ''} enrolled</p>
      </div>

      {courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#F9FAFB', borderRadius: 16, border: '1.5px dashed #E5E7EB' }}>
          <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</p>
          <p style={{ color: '#374151', fontWeight: 600, marginBottom: '0.5rem' }}>No courses yet</p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Browse the Academy and enroll in a course to get started.</p>
          <Link href="/academy" style={{ background: '#E31E24', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {courses.map(({ course, course_slug, completion_percentage, enrolled_at }: any) => (
            <div key={course_slug} style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', border: '1.5px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 52, height: 52, background: course?.theme_color || '#E31E24', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                {course?.icon || '📚'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  {course?.title || course_slug}
                </p>
                <p style={{ color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.625rem' }}>
                  {course?.category} &middot; {course?.difficulty} &middot; Enrolled {new Date(enrolled_at).toLocaleDateString('en-IN')}
                </p>
                <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${completion_percentage || 0}%`, background: '#E31E24', borderRadius: 2 }} />
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.72rem', marginTop: '0.25rem' }}>{completion_percentage || 0}% complete</p>
              </div>
              <Link href={`/learn/${course_slug}/module-1/lesson-1`} style={{ background: '#0D183D', color: '#fff', padding: '0.625rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>
                Continue &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
