#!/usr/bin/env python3
"""
Sprint 4.1 Phase B — Full implementation
API routes, lesson player, dashboard, auth pages
Run from: C:\\Users\\dell\\barada-nextjs
"""
import os

BASE = r'C:\Users\dell\barada-nextjs'

def w(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Created: {rel}')

# ── lib/db/courses.ts ─────────────────────────────────────────────
w('lib/db/courses.ts', r"""import { createClient } from '@/lib/supabase/server'

export async function getAllPublishedCourses() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select(`
      course_id, slug, title, subtitle, category, difficulty,
      icon, theme_color, is_free, cert_price_paise, sort_order,
      estimated_hours, status, outcomes, target_audience,
      domain_id,
      modules(count),
      lessons(count)
    `)
    .eq('status', 'published')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      modules(
        module_id, module_number, title, description, status,
        lessons(
          lesson_id, lesson_number, title, description,
          duration_seconds, is_free_preview, status, sort_order
        )
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) throw error
  return data
}

export async function getLessonWithAssets(
  courseSlug: string,
  moduleNumber: number,
  lessonNumber: number
) {
  const supabase = await createClient()

  // Get course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('course_id, slug, title')
    .eq('slug', courseSlug)
    .single()
  if (courseError || !course) return null

  // Get module
  const { data: mod, error: modError } = await supabase
    .from('modules')
    .select('module_id, module_number, title')
    .eq('course_id', course.course_id)
    .eq('module_number', moduleNumber)
    .single()
  if (modError || !mod) return null

  // Get lesson
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', mod.module_id)
    .eq('lesson_number', lessonNumber)
    .single()
  if (lessonError || !lesson) return null

  // Get assets attached to this lesson
  const { data: attachments } = await supabase
    .from('asset_attachments')
    .select(`
      role, sort_order,
      assets(
        asset_id, asset_type, title, provider_id,
        provider_ref, resolved_url, status,
        is_downloadable, duration_seconds, mime_type
      )
    `)
    .eq('entity_type', 'lesson')
    .eq('entity_id', lesson.lesson_id)

  // Get all lessons in course for navigation
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('lesson_id, lesson_number, title, module_id, sort_order')
    .eq('course_id', course.course_id)
    .eq('status', 'published')
    .order('sort_order')

  return {
    course,
    module: mod,
    lesson,
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
      .select(`
        course_id, slug, title, subtitle, category, difficulty,
        icon, theme_color, is_free, cert_price_paise, sort_order,
        estimated_hours, outcomes, target_audience
      `)
      .eq('status', 'published')
      .order('sort_order')

    if (error) throw error

    // Get module and lesson counts per course
    const enriched = await Promise.all(
      (courses || []).map(async (course) => {
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

        return {
          ...course,
          moduleCount: moduleCount || 0,
          lessonCount: lessonCount || 0,
        }
      })
    )

    return NextResponse.json({ courses: enriched })
  } catch (error) {
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
      .select(`
        *,
        modules(
          module_id, module_number, title, description, status, sort_order,
          lessons(
            lesson_id, lesson_number, title, description,
            duration_seconds, is_free_preview, status, sort_order
          )
        )
      `)
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single()

    if (error || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Sort modules and lessons
    const sorted = {
      ...course,
      modules: (course.modules || [])
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

    // Get learner profile
    const { data: learner } = await supabase
      .from('learners')
      .select('learner_id, first_name, last_name, email, profession, avatar_url, created_at')
      .eq('id', user.id)
      .single()

    if (!learner) return NextResponse.json({ error: 'Learner not found' }, { status: 404 })

    // Get enrollments with course data
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        enrollment_id, course_slug, enrolled_at, completion_percentage,
        course_id,
        courses(course_id, slug, title, icon, theme_color, category)
      `)
      .eq('learner_id', learner.learner_id)
      .order('enrolled_at', { ascending: false })

    // Get lesson progress count
    const { count: lessonsCompleted } = await supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('learner_id', learner.learner_id)
      .eq('completed', true)

    // Get certificates
    const { data: certificates } = await supabase
      .from('certificates')
      .select('certificate_id, course_slug, issued_at, certificate_url, course_id')
      .eq('learner_id', learner.learner_id)
      .order('issued_at', { ascending: false })

    // Get most recent lesson progress for "Continue Learning"
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

# ── components/academy/ContentComingSoon.tsx ──────────────────────
w('components/academy/ContentComingSoon.tsx', r"""'use client'

interface ContentComingSoonProps {
  lessonTitle: string
  availableAssets?: { type: string; title: string; url: string }[]
}

export default function ContentComingSoon({ lessonTitle, availableAssets = [] }: ContentComingSoonProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0D183D, #1a2b5e)',
      borderRadius: 16,
      padding: '3rem 2rem',
      textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.08)',
      minHeight: 360,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.25rem',
    }}>
      <div style={{
        width: 72, height: 72,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        🎬
      </div>
      <div>
        <p style={{
          color: '#D4AF37', fontWeight: 700,
          fontSize: '0.72rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: '0.5rem',
        }}>
          Content Being Prepared
        </p>
        <h3 style={{
          fontFamily: 'Poppins, system-ui, sans-serif',
          fontWeight: 700, color: '#fff',
          fontSize: '1.125rem', marginBottom: '0.5rem',
        }}>
          {lessonTitle}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', maxWidth: 420, margin: '0 auto' }}>
          This lesson video is being produced. We publish new content regularly — check back soon.
        </p>
      </div>
      {availableAssets.length > 0 && (
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: 400 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Available Now
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {availableAssets.map((asset, i) => (
              <a key={i} href={asset.url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 8, padding: '0.625rem 1rem',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)',
                }}>
                <span style={{ fontSize: '1rem' }}>
                  {asset.type === 'pdf' ? '📄' : asset.type === 'ppt' ? '📽️' : '⬇️'}
                </span>
                <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>{asset.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
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

  // Get course
  const { data: course } = await supabase
    .from('courses')
    .select('course_id, slug, title, icon, theme_color')
    .eq('slug', params.course)
    .eq('status', 'published')
    .single()

  if (!course) redirect('/academy')

  // Check enrollment or free preview
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('enrollment_id')
    .eq('learner_id', user.id)
    .or(`course_slug.eq.${course.slug},course_id.eq.${course.course_id}`)
    .single()

  // Get module
  const { data: mod } = await supabase
    .from('modules')
    .select('module_id, module_number, title')
    .eq('course_id', course.course_id)
    .eq('module_number', moduleNumber)
    .single()

  if (!mod) redirect(`/academy`)

  // Get lesson
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', mod.module_id)
    .eq('lesson_number', lessonNumber)
    .single()

  if (!lesson) redirect(`/academy`)

  // If not enrolled and not free preview, redirect
  if (!enrollment && !lesson.is_free_preview) redirect(`/academy`)

  // Get published assets for this lesson
  const { data: attachments } = await supabase
    .from('asset_attachments')
    .select(`
      role, sort_order,
      assets(asset_id, asset_type, title, provider_id, provider_ref, resolved_url, status, is_downloadable)
    `)
    .eq('entity_type', 'lesson')
    .eq('entity_id', lesson.lesson_id)

  const publishedAssets = (attachments || [])
    .filter((a: any) => a.assets?.status === 'published')
    .map((a: any) => a.assets)

  const videoAsset = publishedAssets.find((a: any) => a.asset_type === 'video')
  const downloadableAssets = publishedAssets.filter((a: any) => a.is_downloadable)

  // Get all lessons for navigation
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('lesson_id, lesson_number, title, module_id, sort_order, modules(module_number)')
    .eq('course_id', course.course_id)
    .eq('status', 'published')
    .order('sort_order')

  const flatLessons = (allLessons || []) as any[]
  const currentIndex = flatLessons.findIndex(l => l.lesson_id === lesson.lesson_id)
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null

  const navUrl = (l: any) =>
    `/learn/${course.slug}/module-${l.modules?.module_number || moduleNumber}/lesson-${l.lesson_number}`

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top nav */}
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
          <Link href={`/academy`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textDecoration: 'none' }}>
            {course.icon} {course.title}
          </Link>
        </div>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', textDecoration: 'none' }}>
          Dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>

        {/* Main content */}
        <div>
          {/* Module breadcrumb */}
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Module {moduleNumber} &middot; Lesson {lessonNumber}
          </p>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#fff', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', marginBottom: '1.5rem' }}>
            {lesson.title}
          </h1>

          {/* Video player or coming soon */}
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

          {/* Lesson body */}
          {lesson.description && (
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {lesson.description}
              </p>
            </div>
          )}

          {/* Key points */}
          {lesson.key_points && lesson.key_points.length > 0 && (
            <div style={{ background: 'rgba(212,175,55,0.05)', borderRadius: 12, padding: '1.5rem', border: '1px solid rgba(212,175,55,0.15)', marginBottom: '1.5rem' }}>
              <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Key Points</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {lesson.key_points.map((point: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: '0.625rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    <span style={{ color: '#D4AF37', flexShrink: 0 }}>✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem' }}>
            {prevLesson ? (
              <Link href={navUrl(prevLesson)} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.05)', borderRadius: 10,
                padding: '0.75rem 1.25rem', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.08)', flex: 1,
              }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>&larr;</span>
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
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>&rarr;</span>
              </Link>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#D4AF37', borderRadius: 10,
                padding: '0.75rem 1.25rem', flex: 1,
              }}>
                <p style={{ color: '#0D183D', fontWeight: 700, fontSize: '0.875rem' }}>Course Complete</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — lesson list */}
        <div>
          <div style={{ background: '#0D183D', borderRadius: 14, padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 72 }}>
            <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Course Content
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '1rem' }}>
              Module {moduleNumber}: {mod.title}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {flatLessons
                .filter((l: any) => l.modules?.module_number === moduleNumber)
                .map((l: any) => {
                  const isActive = l.lesson_id === lesson.lesson_id
                  return (
                    <Link
                      key={l.lesson_id}
                      href={navUrl(l)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                        padding: '0.5rem 0.75rem', borderRadius: 8, textDecoration: 'none',
                        background: isActive ? 'rgba(227,30,36,0.15)' : 'transparent',
                        border: isActive ? '1px solid rgba(227,30,36,0.3)' : '1px solid transparent',
                      }}
                    >
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

# ── app/(auth)/forgot-password/page.tsx ───────────────────────────
w('app/(auth)/forgot-password/page.tsx', r"""'use client'
import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/academy" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            <Logo variant="academy" height={40} />
          </Link>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Reset your password
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Enter your email and we will send you a reset link.
          </p>
        </div>

        {sent ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', fontSize: '1.125rem', marginBottom: '0.5rem' }}>Check your email</h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7 }}>
              We sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
            </p>
            <Link href="/login" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#E31E24', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#374151', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem' }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              {error && <p style={{ color: '#E31E24', fontSize: '0.82rem' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ background: '#E31E24', color: '#fff', border: 'none', borderRadius: 10, padding: '0.875rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#6B7280', fontSize: '0.875rem' }}>
              Remember your password?{' '}
              <Link href="/login" style={{ color: '#E31E24', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
""")

# ── app/(auth)/reset-password/page.tsx ────────────────────────────
w('app/(auth)/reset-password/page.tsx', r"""'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/academy" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            <Logo variant="academy" height={40} />
          </Link>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Set new password
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Choose a strong password for your account.</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem' }}>New password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required minLength={8}
                placeholder="Minimum 8 characters"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem' }}>Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Repeat password"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {error && <p style={{ color: '#E31E24', fontSize: '0.82rem' }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ background: '#E31E24', color: '#fff', border: 'none', borderRadius: 10, padding: '0.875rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
""")

# ── app/(auth)/verify-email/page.tsx ──────────────────────────────
w('app/(auth)/verify-email/page.tsx', r"""import Link from 'next/link'
import Logo from '@/components/shared/Logo'

export default function VerifyEmailPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <Link href="/academy" style={{ display: 'inline-block', marginBottom: '2rem' }}>
          <Logo variant="academy" height={40} />
        </Link>
        <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', border: '1.5px solid #E5E7EB' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            Check your inbox
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
            We sent you a verification email. Click the link in the email to activate your Barada Academy account and start learning.
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginBottom: '1.5rem' }}>
            Did not receive it? Check your spam folder, or{' '}
            <Link href="/register" style={{ color: '#E31E24', fontWeight: 700, textDecoration: 'none' }}>try again</Link>.
          </p>
          <Link
            href="/login"
            style={{ display: 'inline-block', background: '#0D183D', color: '#fff', padding: '0.75rem 2rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
""")

# ── app/(dashboard)/dashboard/courses/page.tsx ────────────────────
w('app/(dashboard)/dashboard/courses/page.tsx', r"""import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function MyCoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: learner } = await supabase
    .from('learners').select('learner_id').eq('id', user.id).single()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('enrollment_id, course_slug, enrolled_at, completion_percentage')
    .eq('learner_id', learner?.learner_id)
    .order('enrolled_at', { ascending: false })

  // Fetch course details for each enrollment
  const courses = await Promise.all(
    (enrollments || []).map(async (e) => {
      const { data: course } = await supabase
        .from('courses')
        .select('course_id, slug, title, icon, theme_color, category, difficulty')
        .eq('slug', e.course_slug)
        .single()
      return { ...e, course }
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
          {courses.map(({ course, course_slug, completion_percentage, enrolled_at }) => (
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

# ── app/(dashboard)/dashboard/certificates/page.tsx ───────────────
w('app/(dashboard)/dashboard/certificates/page.tsx', r"""import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function CertificatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: learner } = await supabase
    .from('learners').select('learner_id, first_name, last_name').eq('id', user.id).single()

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
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Complete a course and pass the assessment to earn your certificate for Rs 299.</p>
          <Link href="/academy" style={{ background: '#E31E24', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
            Start Learning
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {certificates.map((cert) => (
            <div key={cert.certificate_id} style={{ background: 'linear-gradient(135deg, #0D183D, #1a2b5e)', borderRadius: 14, padding: '1.75rem', border: '1px solid rgba(212,175,55,0.3)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>🏆</div>
              <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Certificate of Completion</p>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.375rem' }}>{cert.course_slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '1.25rem' }}>Issued {new Date(cert.issued_at).toLocaleDateString('en-IN')}</p>
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

# ── app/(dashboard)/dashboard/profile/page.tsx ────────────────────
w('app/(dashboard)/dashboard/profile/page.tsx', r"""import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: learner } = await supabase
    .from('learners')
    .select('*')
    .eq('id', user.id)
    .single()

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

print('\nSprint 4.1 Phase B complete.')
print('Files created:')
print('  lib/db/courses.ts')
print('  app/api/courses/route.ts')
print('  app/api/courses/[slug]/route.ts')
print('  app/api/dashboard/route.ts')
print('  components/academy/ContentComingSoon.tsx')
print('  app/learn/[course]/[module]/[lesson]/page.tsx')
print('  app/(auth)/forgot-password/page.tsx')
print('  app/(auth)/reset-password/page.tsx')
print('  app/(auth)/verify-email/page.tsx')
print('  app/(dashboard)/dashboard/courses/page.tsx')
print('  app/(dashboard)/dashboard/certificates/page.tsx')
print('  app/(dashboard)/dashboard/profile/page.tsx')
print('\nNext: npm run type-check')
