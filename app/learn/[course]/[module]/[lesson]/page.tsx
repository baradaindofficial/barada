import { redirect } from 'next/navigation'
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
                background: '#D11A1A', borderRadius: 10,
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
                        background: isActive ? '#D11A1A' : 'rgba(255,255,255,0.08)',
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
