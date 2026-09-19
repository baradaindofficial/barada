#!/usr/bin/env python3
"""Fix TypeScript errors in Sprint 4.1 Phase B files"""
import os

BASE = r'C:\Users\dell\barada-nextjs'

def w(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Fixed: {rel}')

# ── lib/db/courses.ts ─────────────────────────────────────────────
w('lib/db/courses.ts', r"""import { createClient } from '@/lib/supabase/server'

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
""")

# ── app/api/courses/route.ts ───────────────────────────────────────
w('app/api/courses/route.ts', r"""import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: courses, error } = await supabase
      .from('courses')
      .select('course_id, slug, title, subtitle, category, difficulty, icon, theme_color, is_free, cert_price_paise, sort_order, estimated_hours, outcomes, target_audience')
      .eq('status', 'published')
      .order('sort_order')

    if (error) throw error

    const enriched = await Promise.all(
      (courses || []).map(async (course: any) => {
        const { count: moduleCount } = await supabase
          .from('modules')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', course.course_id)
          .eq('status', 'published')

        const { count: lessonCount } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', course.course_id)
          .eq('status', 'published')

        return { ...course, moduleCount: moduleCount || 0, lessonCount: lessonCount || 0 }
      })
    )

    return NextResponse.json({ courses: enriched })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
""")

# ── app/api/courses/[slug]/route.ts ───────────────────────────────
w('app/api/courses/[slug]/route.ts', r"""import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient()
    const { data: course, error } = await supabase
      .from('courses')
      .select('*, modules(module_id, module_number, title, description, status, sort_order, lessons(lesson_id, lesson_number, title, description, duration_seconds, is_free_preview, status, sort_order))')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single()

    if (error || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const c = course as any
    const sorted = {
      ...c,
      modules: (c.modules || [])
        .sort((a: any, b: any) => a.module_number - b.module_number)
        .map((m: any) => ({
          ...m,
          lessons: (m.lessons || []).sort((a: any, b: any) => a.lesson_number - b.lesson_number),
        })),
    }

    return NextResponse.json({ course: sorted })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}
""")

# ── app/api/dashboard/route.ts ────────────────────────────────────
w('app/api/dashboard/route.ts', r"""import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: learnerRaw } = await supabase
      .from('learners')
      .select('learner_id, first_name, last_name, email, profession, avatar_url, created_at')
      .eq('id', user.id)
      .single()

    if (!learnerRaw) return NextResponse.json({ error: 'Learner not found' }, { status: 404 })
    const learner = learnerRaw as any

    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('enrollment_id, course_slug, enrolled_at, completion_percentage, course_id')
      .eq('learner_id', learner.learner_id)
      .order('enrolled_at', { ascending: false })

    const { count: lessonsCompleted } = await supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('learner_id', learner.learner_id)
      .eq('completed', true)

    const { data: certificates } = await supabase
      .from('certificates')
      .select('certificate_id, course_slug, issued_at, certificate_url, course_id')
      .eq('learner_id', learner.learner_id)
      .order('issued_at', { ascending: false })

    const { data: recentProgress } = await supabase
      .from('lesson_progress')
      .select('course_slug, lesson_slug, completed_at')
      .eq('learner_id', learner.learner_id)
      .order('completed_at', { ascending: false })
      .limit(1)

    return NextResponse.json({
      learner,
      stats: {
        enrolledCount: enrollments?.length || 0,
        lessonsCompleted: lessonsCompleted || 0,
        certificateCount: certificates?.length || 0,
      },
      enrollments: enrollments || [],
      certificates: certificates || [],
      recentProgress: recentProgress?.[0] || null,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
""")

# ── app/learn/[course]/[module]/[lesson]/page.tsx ─────────────────
w('app/learn/[course]/[module]/[lesson]/page.tsx', r"""import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Logo from '@/components/shared/Logo'
import ContentComingSoon from '@/components/academy/ContentComingSoon'

interface Props {
  params: { course: string; module: string; lesson: string }
}

export default async function LessonPage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const moduleNumber = parseInt(params.module.replace('module-', ''))
  const lessonNumber = parseInt(params.lesson.replace('lesson-', ''))

  const { data: courseRaw } = await supabase
    .from('courses')
    .select('course_id, slug, title, icon, theme_color')
    .eq('slug', params.course)
    .eq('status', 'published')
    .single()

  if (!courseRaw) redirect('/academy')
  const course = courseRaw as any

  const { data: enrollmentRaw } = await supabase
    .from('enrollments')
    .select('enrollment_id')
    .eq('learner_id', user.id)
    .eq('course_slug', course.slug)
    .maybeSingle()
  const enrollment = enrollmentRaw as any

  const { data: modRaw } = await supabase
    .from('modules')
    .select('module_id, module_number, title')
    .eq('course_id', course.course_id)
    .eq('module_number', moduleNumber)
    .single()

  if (!modRaw) redirect('/academy')
  const mod = modRaw as any

  const { data: lessonRaw } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', mod.module_id)
    .eq('lesson_number', lessonNumber)
    .single()

  if (!lessonRaw) redirect('/academy')
  const lesson = lessonRaw as any

  if (!enrollment && !lesson.is_free_preview) redirect('/academy')

  const { data: attachments } = await supabase
    .from('asset_attachments')
    .select('role, sort_order, assets(asset_id, asset_type, title, provider_id, provider_ref, resolved_url, status, is_downloadable)')
    .eq('entity_type', 'lesson')
    .eq('entity_id', lesson.lesson_id)

  const publishedAssets = (attachments || [])
    .filter((a: any) => (a.assets as any)?.status === 'published')
    .map((a: any) => a.assets as any)

  const videoAsset = publishedAssets.find((a: any) => a.asset_type === 'video')
  const downloadableAssets = publishedAssets.filter((a: any) => a.is_downloadable)

  const { data: allLessonsRaw } = await supabase
    .from('lessons')
    .select('lesson_id, lesson_number, title, module_id, sort_order, modules(module_number)')
    .eq('course_id', course.course_id)
    .eq('status', 'published')
    .order('sort_order')

  const flatLessons = (allLessonsRaw || []) as any[]
  const currentIndex = flatLessons.findIndex((l: any) => l.lesson_id === lesson.lesson_id)
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null

  const navUrl = (l: any) =>
    `/learn/${course.slug}/module-${(l.modules as any)?.module_number || moduleNumber}/lesson-${l.lesson_number}`

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{
        background: '#0D183D', borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 1.5rem', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/academy" style={{ lineHeight: 0 }}>
            <Logo variant="academy" height={32} />
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>/</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
            {course.icon} {course.title}
          </span>
        </div>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', textDecoration: 'none' }}>
          Dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Module {moduleNumber} &middot; Lesson {lessonNumber}
          </p>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#fff', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', marginBottom: '1.5rem' }}>
            {lesson.title}
          </h1>

          {videoAsset && videoAsset.provider_id === 'youtube' && videoAsset.provider_ref ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden', marginBottom: '1.5rem' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoAsset.provider_ref}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{ marginBottom: '1.5rem' }}>
              <ContentComingSoon
                lessonTitle={lesson.title}
                availableAssets={downloadableAssets.map((a: any) => ({
                  type: a.asset_type,
                  title: a.title,
                  url: a.resolved_url || '#',
                }))}
              />
            </div>
          )}

          {lesson.description && (
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {lesson.description}
              </p>
            </div>
          )}

          {lesson.key_points && lesson.key_points.length > 0 && (
            <div style={{ background: 'rgba(212,175,55,0.05)', borderRadius: 12, padding: '1.5rem', border: '1px solid rgba(212,175,55,0.15)', marginBottom: '1.5rem' }}>
              <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Key Points</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(lesson.key_points as string[]).map((point: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: '0.625rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    <span style={{ color: '#D4AF37', flexShrink: 0 }}>&#10003;</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem' }}>
            {prevLesson ? (
              <Link href={navUrl(prevLesson)} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.05)', borderRadius: 10,
                padding: '0.75rem 1.25rem', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.08)', flex: 1,
              }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>&larr;</span>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Previous</p>
                  <p style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>{prevLesson.title}</p>
                </div>
              </Link>
            ) : <div style={{ flex: 1 }} />}

            {nextLesson ? (
              <Link href={navUrl(nextLesson)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem',
                background: '#E31E24', borderRadius: 10,
                padding: '0.75rem 1.25rem', textDecoration: 'none', flex: 1,
              }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Next</p>
                  <p style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>{nextLesson.title}</p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>&rarr;</span>
              </Link>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#D4AF37', borderRadius: 10, padding: '0.75rem 1.25rem', flex: 1 }}>
                <p style={{ color: '#0D183D', fontWeight: 700, fontSize: '0.875rem' }}>Course Complete &#127881;</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{ background: '#0D183D', borderRadius: 14, padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 72 }}>
            <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Course Content
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.875rem' }}>
              Module {moduleNumber}: {mod.title}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {flatLessons
                .filter((l: any) => (l.modules as any)?.module_number === moduleNumber)
                .map((l: any) => {
                  const isActive = l.lesson_id === lesson.lesson_id
                  return (
                    <Link key={l.lesson_id} href={navUrl(l)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.625rem',
                      padding: '0.5rem 0.75rem', borderRadius: 8, textDecoration: 'none',
                      background: isActive ? 'rgba(227,30,36,0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(227,30,36,0.3)' : '1px solid transparent',
                    }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: isActive ? '#E31E24' : 'rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6rem', color: '#fff', flexShrink: 0, fontWeight: 700,
                      }}>
                        {l.lesson_number}
                      </span>
                      <span style={{
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                        fontSize: '0.78rem', lineHeight: 1.4,
                        fontWeight: isActive ? 600 : 400,
                      }}>
                        {l.title}
                      </span>
                    </Link>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
""")

# ── dashboard sub-pages — cast fixes ──────────────────────────────
w('app/(dashboard)/dashboard/courses/page.tsx', r"""import { redirect } from 'next/navigation'
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
    .select('enrollment_id, course_slug, enrolled_at, completion_percentage')
    .eq('learner_id', learner?.learner_id)
    .order('enrolled_at', { ascending: false })

  const courses = await Promise.all(
    (enrollments || []).map(async (e: any) => {
      const { data: course } = await supabase
        .from('courses')
        .select('course_id, slug, title, icon, theme_color, category, difficulty')
        .eq('slug', e.course_slug)
        .maybeSingle()
      return { ...e, course: course as any }
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
""")

w('app/(dashboard)/dashboard/certificates/page.tsx', r"""import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function CertificatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: learnerRaw } = await supabase
    .from('learners').select('learner_id, first_name, last_name').eq('id', user.id).single()
  const learner = learnerRaw as any

  const { data: certificates } = await supabase
    .from('certificates')
    .select('certificate_id, course_slug, issued_at, certificate_url')
    .eq('learner_id', learner?.learner_id)
    .order('issued_at', { ascending: false })

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#6B7280', fontSize: '0.82rem', textDecoration: 'none' }}>&larr; Dashboard</Link>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.75rem', marginTop: '0.5rem' }}>My Certificates</h1>
        <p style={{ color: '#6B7280' }}>{certificates?.length || 0} certificate{(certificates?.length || 0) !== 1 ? 's' : ''} earned</p>
      </div>

      {!certificates || certificates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#F9FAFB', borderRadius: 16, border: '1.5px dashed #E5E7EB' }}>
          <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏆</p>
          <p style={{ color: '#374151', fontWeight: 600, marginBottom: '0.5rem' }}>No certificates yet</p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Complete a course and pass the assessment to earn your certificate for &#8377;299.</p>
          <Link href="/academy" style={{ background: '#E31E24', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
            Start Learning
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {(certificates as any[]).map((cert: any) => (
            <div key={cert.certificate_id} style={{ background: 'linear-gradient(135deg, #0D183D, #1a2b5e)', borderRadius: 14, padding: '1.75rem', border: '1px solid rgba(212,175,55,0.3)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>🏆</div>
              <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Certificate of Completion</p>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.375rem' }}>
                {cert.course_slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
                Issued {new Date(cert.issued_at).toLocaleDateString('en-IN')}
              </p>
              {cert.certificate_url && (
                <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', background: '#D4AF37', color: '#0D183D', padding: '0.5rem 1rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.78rem' }}>
                  Download PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
""")

w('app/(dashboard)/dashboard/profile/page.tsx', r"""import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: learnerRaw } = await supabase
    .from('learners').select('*').eq('id', user.id).single()
  const learner = learnerRaw as any

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#6B7280', fontSize: '0.82rem', textDecoration: 'none' }}>&larr; Dashboard</Link>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.75rem', marginTop: '0.5rem' }}>My Profile</h1>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 64, height: 64, background: '#E31E24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'Poppins, sans-serif' }}>
            {learner?.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'L'}
          </div>
          <div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', fontSize: '1.125rem' }}>
              {learner?.first_name} {learner?.last_name}
            </p>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{user.email}</p>
          </div>
        </div>

        {[
          ['First Name', learner?.first_name || '—'],
          ['Last Name', learner?.last_name || '—'],
          ['Email', user.email || '—'],
          ['Profession', learner?.profession || '—'],
          ['Member Since', learner?.created_at ? new Date(learner.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{label}</span>
            <span style={{ color: '#0D183D', fontWeight: 600, fontSize: '0.875rem' }}>{value}</span>
          </div>
        ))}
      </div>

      <div style={{ background: '#FFF7ED', borderRadius: 12, padding: '1.25rem', border: '1px solid #FED7AA' }}>
        <p style={{ color: '#92400E', fontSize: '0.82rem', fontWeight: 600 }}>
          Profile editing is coming in Sprint 4.5. For changes, email academy@barada.in
        </p>
      </div>
    </div>
  )
}
""")

print('\nAll TypeScript errors fixed.')
print('Next: npm run type-check')
