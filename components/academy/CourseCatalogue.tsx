'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import CourseEnrollButton from '@/components/academy/CourseEnrollButton'

// Searchable, filterable course catalogue for /academy, with an
// Individuals / Teams switcher. Filters are built only from the values
// that exist in the published courses, so nothing is invented. Team
// workshops are described as planned, in line with /services.

const red = '#E31E24'
const navy = '#0D183D'

export type CatalogueCourse = {
  slug: string
  title: string
  subtitle: string | null
  category: string
  difficulty: string
  icon: string | null
  themeColor: string | null
  moduleCount: number
  lessonCount: number
  estimatedHours: number | null
  enrollmentPaused: boolean
  enrollmentPausedReason: string | null
}

const chip = (active: boolean): React.CSSProperties => ({
  padding: '0.45rem 0.9rem',
  minHeight: 40,
  borderRadius: 999,
  border: `1.5px solid ${active ? navy : '#D1D5DB'}`,
  background: active ? navy : '#fff',
  color: active ? '#fff' : '#374151',
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
})

export default function CourseCatalogue({
  courses,
  isLoggedIn,
}: {
  courses: CatalogueCourse[]
  isLoggedIn: boolean
}) {
  const [audience, setAudience] = useState<'individuals' | 'teams'>('individuals')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')

  const categories = useMemo(() => ['All', ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean)))], [courses])
  const levels = useMemo(() => ['All', ...Array.from(new Set(courses.map((c) => c.difficulty).filter(Boolean)))], [courses])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return courses.filter((c) => {
      if (category !== 'All' && c.category !== category) return false
      if (level !== 'All' && c.difficulty !== level) return false
      if (!q) return true
      return [c.title, c.subtitle ?? '', c.category, c.difficulty].some((t) => t.toLowerCase().includes(q))
    })
  }, [courses, query, category, level])

  const filtered = query.trim() !== '' || category !== 'All' || level !== 'All'

  function clear() {
    setQuery('')
    setCategory('All')
    setLevel('All')
  }

  return (
    <div>
      {/* Audience switcher */}
      <div role="group" aria-label="Who is this for?" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button type="button" aria-pressed={audience === 'individuals'} onClick={() => setAudience('individuals')} style={chip(audience === 'individuals')}>For individuals</button>
        <button type="button" aria-pressed={audience === 'teams'} onClick={() => setAudience('teams')} style={chip(audience === 'teams')}>For teams</button>
      </div>

      {audience === 'teams' ? (
        <div style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: '2rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: navy, fontSize: '1.15rem', margin: '0 0 0.75rem' }}>Team training is being planned</h3>
          <p style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: 1.75, margin: '0 0 1.25rem' }}>
            Team workshops are not yet open for bookings. Register your interest and we will be in touch. In the meantime, each person on your team can start any course below for free.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/services#professional-workshops" style={{ background: red, color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700 }}>Register your interest &rarr;</Link>
            <button type="button" onClick={() => setAudience('individuals')} style={{ ...chip(false), padding: '0.75rem 1.5rem', borderRadius: 10, fontSize: '0.9rem' }}>Browse courses</button>
          </div>
        </div>
      ) : (
        <>
          {/* Search + filters */}
          <div style={{ maxWidth: 900, margin: '0 auto 1.5rem' }}>
            <label htmlFor="course-search" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: navy, marginBottom: '0.4rem' }}>Search courses</label>
            <input
              id="course-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try a tool or topic, for example Excel or ChatGPT"
              style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem', minHeight: 44, borderRadius: 10, border: '1.5px solid #D1D5DB', fontSize: '1rem', fontFamily: 'inherit', background: '#fff', color: '#111' }}
            />
            {categories.length > 2 && (
              <div role="group" aria-label="Filter by category" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {categories.map((c) => (
                  <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} style={chip(category === c)}>{c === 'All' ? 'All topics' : c}</button>
                ))}
              </div>
            )}
            {levels.length > 2 && (
              <div role="group" aria-label="Filter by level" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                {levels.map((l) => (
                  <button key={l} type="button" aria-pressed={level === l} onClick={() => setLevel(l)} style={chip(level === l)}>{l === 'All' ? 'All levels' : l}</button>
                ))}
              </div>
            )}
            <p aria-live="polite" style={{ color: '#6B7280', fontSize: '0.82rem', margin: '1rem 0 0' }}>
              Showing {shown.length} of {courses.length} courses
              {filtered && (
                <button type="button" onClick={clear} style={{ marginLeft: '0.75rem', background: 'none', border: 'none', color: red, fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', textDecoration: 'underline', padding: '0.5rem 0' }}>Clear filters</button>
              )}
            </p>
          </div>

          {shown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#4B5563' }}>
              <p style={{ margin: '0 0 0.75rem' }}>No courses match your search.</p>
              <button type="button" onClick={clear} style={{ ...chip(true), padding: '0.6rem 1.25rem' }}>Show all courses</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.25rem' }}>
              {shown.map((course) => (
                <div key={course.slug} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #E5E7EB', borderTop: `4px solid ${course.themeColor || red}` }}>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>{course.icon}</span>
                      {course.enrollmentPaused ? (
                        <span style={{ background: 'rgba(212,175,55,0.15)', color: '#8A6D1E', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>&bull; Content Being Completed</span>
                      ) : (
                        <span style={{ background: 'rgba(22,163,74,0.1)', color: '#15803d', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>&bull; Available Now</span>
                      )}
                    </div>
                    <p style={{ color: '#6B7280', fontSize: '0.72rem', marginBottom: '0.25rem' }}>{course.category} &middot; {course.difficulty}</p>
                    <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: navy, fontSize: '0.95rem', marginBottom: '0.75rem', lineHeight: 1.4 }}>{course.title}</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6B7280', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                      <span>{course.moduleCount} modules</span>
                      <span>{course.lessonCount} lessons</span>
                      {course.estimatedHours ? <span>{course.estimatedHours}h</span> : null}
                      <span>Certificate: ₹299</span>
                    </div>
                    <CourseEnrollButton
                      slug={course.slug}
                      isLoggedIn={isLoggedIn}
                      enrollmentPaused={course.enrollmentPaused}
                      enrollmentPausedReason={course.enrollmentPausedReason}
                    />
                  </div>
                  {course.enrollmentPaused ? (
                    <div style={{ background: 'rgba(212,175,55,0.08)', borderTop: '1px solid rgba(212,175,55,0.2)', padding: '0.5rem 1.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#8A6D1E', fontWeight: 700 }}>Content being completed &mdash; new enrolments temporarily paused.</span>
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(22,163,74,0.05)', borderTop: '1px solid rgba(22,163,74,0.1)', padding: '0.5rem 1.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700 }}>&#10003; Enroll instantly &middot; No payment required</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
