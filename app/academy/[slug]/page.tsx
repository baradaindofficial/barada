import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AcademyHeader from '@/components/academy/Header'
import CorporateFooter from '@/components/corporate/Footer'
import { createAdminClient } from '@/lib/supabase/admin'

export const revalidate = 3600

const navy = '#0A1A52'
const blue = '#0B63CE'
const orange = '#FF7A12'
const BASE = 'https://www.barada.in'

async function load(slug: string) {
  const admin = createAdminClient() as any
  const { data: course } = await admin
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (!course || course.visibility === 'private') return null
  const { data: modules } = await admin
    .from('modules')
    .select('module_id, module_number, title, description')
    .eq('course_id', course.course_id)
    .eq('status', 'published')
    .order('module_number')
  const { data: lessons } = await admin
    .from('lessons')
    .select('module_id, lesson_number, title')
    .eq('course_id', course.course_id)
    .eq('status', 'published')
    .order('lesson_number')
  return { course, modules: modules || [], lessons: lessons || [] }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const data = await load(slug)
  if (!data) return { title: 'Course not found' }
  const c = data.course
  const desc = (c.subtitle || c.description || `${c.title}: a practical course from QORVIAN by Barada.`).toString().slice(0, 155)
  return {
    title: { absolute: `${c.title} | QORVIAN by Barada` },
    description: desc,
    alternates: { canonical: `${BASE}/qorvian/${c.slug}` },
    openGraph: { title: c.title, description: desc, url: `${BASE}/qorvian/${c.slug}`, siteName: 'Barada', locale: 'en_IN', type: 'website' },
  }
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await load(slug)
  if (!data) notFound()
  const { course: c, modules, lessons } = data
  const outcomes: string[] = Array.isArray(c.outcomes) ? c.outcomes : []
  const audience: string[] = Array.isArray(c.target_audience) ? c.target_audience : []
  const accent = c.theme_color || blue

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: c.title,
    description: c.subtitle || c.description || c.title,
    url: `${BASE}/qorvian/${c.slug}`,
    inLanguage: 'en-IN',
    educationalLevel: c.difficulty,
    provider: { '@type': 'Organization', name: 'QORVIAN by Barada', sameAs: BASE },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', category: 'Free' },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: c.estimated_hours ? `PT${Math.round(c.estimated_hours)}H` : undefined },
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#F9FAFB' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AcademyHeader />
      <section style={{ background: `linear-gradient(135deg, ${navy}, #123C8F)`, padding: '4rem 1.5rem', borderBottom: `4px solid ${accent}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ color: orange, fontWeight: 700, fontSize: '0.875rem', margin: '0 0 0.5rem' }}>{c.category} &middot; {c.difficulty}</p>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: '#fff', margin: '0 0 1rem' }}>{c.title}</h1>
          {c.subtitle ? <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', margin: '0 0 1.5rem' }}>{c.subtitle}</p> : null}
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', margin: '0 0 1.5rem' }}>
            {modules.length} modules &middot; {lessons.length} lessons{c.estimated_hours ? ` · ${c.estimated_hours} hours` : ''} &middot; Free to learn &middot; Free certificate
          </p>
          <Link href="/register" style={{ display: 'inline-block', background: orange, color: navy, padding: '0.875rem 1.75rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>Start this course free</Link>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {c.description ? (
          <p style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.8, margin: '0 0 2rem' }}>{c.description}</p>
        ) : null}

        {outcomes.length > 0 && (
          <div style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: '1.75rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', color: navy, fontWeight: 700, fontSize: '1.25rem', margin: '0 0 0.75rem' }}>What you will learn</h2>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#374151', lineHeight: 1.8 }}>{outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
        )}

        {audience.length > 0 && (
          <div style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: '1.75rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', color: navy, fontWeight: 700, fontSize: '1.25rem', margin: '0 0 0.75rem' }}>Who it is for</h2>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#374151', lineHeight: 1.8 }}>{audience.map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
        )}

        <div style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: '1.75rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', color: navy, fontWeight: 700, fontSize: '1.25rem', margin: '0 0 1rem' }}>Course outline</h2>
          {modules.map((m: any) => (
            <div key={m.module_id} style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ color: navy, fontWeight: 700, fontSize: '1rem', margin: '0 0 0.375rem' }}>Module {m.module_number}: {m.title}</h3>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#4B5563', lineHeight: 1.7, fontSize: '0.875rem' }}>
                {lessons.filter((l: any) => l.module_id === m.module_id).map((l: any) => <li key={l.lesson_number}>{l.title}</li>)}
              </ol>
            </div>
          ))}
        </div>

        <p style={{ margin: '1.5rem 0 0' }}><Link href="/qorvian" style={{ color: blue, fontWeight: 600 }}>&larr; All courses</Link></p>
      </div>
      <CorporateFooter />
    </div>
  )
}
