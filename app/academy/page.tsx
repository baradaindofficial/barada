import Link from 'next/link'
import type { Metadata } from 'next'
import Logo from '@/components/shared/Logo'
import { getAllPublishedCoursesWithCounts, getAcademyStats } from '@/lib/db/courses'
import { createClient } from '@/lib/supabase/server'
import CourseEnrollButton from '@/components/academy/CourseEnrollButton'

export const metadata: Metadata = {
  title: 'Barada Academy \u2014 Learn AI. Build the Future.',
  description: 'Structured, self-paced professional courses on AI tools, productivity, and career skills. Free to learn. Verified certificates available.',
  openGraph: {
    title: 'Barada Academy \u2014 Learn AI. Build the Future.',
    description: 'Structured, self-paced professional courses on AI tools, productivity, and career skills. Free to learn. Verified certificates available.',
    url: 'https://barada.in/academy',
    siteName: 'Barada',
    images: [{ url: '/logo/barada-logo.png', width: 1200, height: 630, alt: 'Barada Academy' }],
    locale: 'en_IN',
    type: 'website',
  },
}

const red = '#D11A1A'
const navy = '#0D183D'
const gold = '#D4AF37'

export default async function AcademyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user
  const courses = await getAllPublishedCoursesWithCounts()
  const stats = await getAcademyStats()

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: 0 }}>

      {/* ACADEMY NAV — intentionally distinct from corporate Header (Logo policy v3.0) */}
      <nav style={{ background: navy, padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 500 }}>&larr; Barada.in</Link>
          <Link href="/academy" style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
            <Logo variant="academy" height={40} />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          {/* Single "Courses" link — previously 4 links (Learning Paths,
              AI Tools, Certificates too) all pointed to this same /academy
              URL. Removed the fake distinct items rather than leave them —
              their intended destinations (app/(academy) scaffold) are
              empty; see BARADA_CORPORATE_WEBSITE_IMPLEMENTATION_BRIEF.md
              Section 10. Re-add as real links once those pages are built. */}
          <Link href="/academy" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.82rem' }}>Courses</Link>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.82rem' }}>Sign In</Link>
          <Link href="/register" style={{ background: red, color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700 }}>Start Free</Link>
        </div>
      </nav>

      <div style={{ background: red, padding: '0.625rem', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: '0.82rem', margin: 0 }}>
          <strong>Now Enrolling</strong> &mdash; All courses live &middot; Free to learn &middot; Certificate available &middot;{' '}
          <Link href="/register" style={{ color: gold, fontWeight: 700 }}>Start Today &rarr;</Link>
        </p>
      </div>

      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, #1A2B5E 100%)`, padding: '4.5rem 2rem 3.5rem', textAlign: 'center' }}>
        <p style={{ color: gold, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Barada Academy</p>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '0.5rem' }}>
          Learn AI.
        </h1>
        <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 900, color: gold, lineHeight: 1.15, marginBottom: '1.25rem' }}>
          Build the Future.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.85 }}>
          Structured, self-paced professional courses on AI tools, productivity, and career skills. Built by a practitioner. Immediately applicable to your work.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: red, color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>Start Learning Free &rarr;</Link>
          <Link href="/login" style={{ border: '2px solid rgba(255,255,255,0.25)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem' }}>Sign In</Link>
        </div>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
          {[['Free', 'To Enroll'], ['Self-Paced', 'No Deadlines'], ['\u20B9299', 'Per Certificate'], ['Practical', 'Immediately Applicable']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: gold, fontFamily: 'Poppins, sans-serif' }}>{v}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social-proof strip -- real, DB-computed numbers only (see
          lib/db/courses.ts:getAcademyStats). The learner-count line is
          withheld below a respectable threshold rather than shown small,
          since this is a new platform and a tiny live number would read
          as a weakness rather than a strength. */}
      <section style={{ background: '#fff', padding: '1.75rem 2rem', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', textAlign: 'center' }}>
          {[
            [String(stats.courseCount), 'Courses'],
            [String(stats.lessonCount), 'Lessons'],
            [`${stats.totalHours}+`, 'Hours of Content'],
            ...(stats.learnerCount >= 20 ? [[`${stats.learnerCount}+`, 'Professionals Learning']] : []),
          ].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: navy, fontFamily: 'Poppins, sans-serif' }}>{v}</div>
              <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#F9FAFB', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Course Catalogue</p>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: navy, margin: '0 0 0.5rem' }}>
              All courses &mdash; free to start
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Every course is free to enroll. Certificate available after passing the final assessment.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {courses.map((course) => (
              <div key={course.slug} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #E5E7EB', borderTop: `4px solid ${course.themeColor || red}` }}>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{course.icon}</span>
                    <span style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>&bull; Available Now</span>
                  </div>
                  <p style={{ color: '#6B7280', fontSize: '0.72rem', marginBottom: '0.25rem' }}>{course.category} &middot; {course.difficulty}</p>
                  <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: navy, fontSize: '0.95rem', marginBottom: '0.75rem', lineHeight: 1.4 }}>{course.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <span>{course.moduleCount} modules</span>
                    <span>{course.lessonCount} lessons</span>
                    {course.estimatedHours ? <span>{course.estimatedHours}h</span> : null}
                    <span>Certificate: ₹299</span>
                  </div>
                  <CourseEnrollButton slug={course.slug} isLoggedIn={isLoggedIn} />
                </div>
                <div style={{ background: 'rgba(22,163,74,0.05)', borderTop: '1px solid rgba(22,163,74,0.1)', padding: '0.5rem 1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>&#10003; Enroll instantly &middot; No payment required</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>FAQ</p>
            <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: navy, margin: 0 }}>
              Common questions
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              {
                q: 'Is it really free?',
                a: 'Yes. Every course is free to enroll in and complete -- all lessons, all modules, no subscription. The only paid step is optional: a ₹299 certificate once you pass a course\'s final assessment, if you want a verifiable credential for your resume or LinkedIn.',
              },
              {
                q: 'Is the certificate recognized by employers?',
                a: 'The certificate verifies that you completed the course and passed its assessment -- each one carries a unique ID you (or anyone you share it with) can check on our verification page. We don\'t claim formal accreditation, and whether it moves the needle for a given employer depends on the employer. We\'d rather be upfront about that than oversell it.',
              },
              {
                q: 'How long do I have to finish a course?',
                a: 'There\'s no deadline. Courses are self-paced -- start, pause, and resume whenever your schedule allows.',
              },
            ].map((item) => (
              <div key={item.q} style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, color: navy, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{item.q}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: navy, padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Ready to start learning?</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Create your free account and start any course today.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: gold, color: navy, padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 800 }}>Create Free Account &rarr;</Link>
          <Link href="/login" style={{ border: '2px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.875rem 2rem', borderRadius: 12, textDecoration: 'none', fontSize: '1rem' }}>Sign In</Link>
        </div>
      </section>

      <footer style={{ background: '#060b18', padding: '2rem', textAlign: 'center' }}>
        <Logo variant="academy" height={36} />
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', marginTop: '0.75rem' }}>&copy; 2026 Barada Academy &middot; A Barada Platform</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
          {[['Barada.in', '/'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>

    </div>
  )
}
