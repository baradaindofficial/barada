"""
fix_adr008_enrollment_progress_separation.py
Barada Digital Platform — ADR-008 implementation (approved architecture decision)

ADR-008: enrollments = enrollment status/gating/access control.
         course_progress = sole source of truth for completion %, lesson
         progress, resume position, time spent, analytics, completion timestamps.
         completion_percentage is NOT duplicated in enrollments.

Fixes implemented:
  P0  lib/db/enrollments.ts       — enrollLearner() populates course_id FK;
                                     adds isEnrolledByCourseId()
  P0  app/api/dashboard/route.ts  — repairs broken old-schema lesson_progress
                                     queries; sources completion % from
                                     course_progress per ADR-008
  --  app/(dashboard)/dashboard/courses/page.tsx
                                  — reads completion from course_progress,
                                     not enrollments.completion_percentage
  --  app/api/lessons/[id]/complete/route.ts
      app/api/lessons/[id]/resume/route.ts
                                  — add enrollment check before writing progress
  --  app/api/progress/route.ts  — retired (410), zero live callers found,
                                     broken against current schema
  --  lib/db/progress.ts         — deleted, fully superseded, zero callers
  Docs docs/ARCHITECTURE.md      — ADR-008 appended
  Docs docs/CHANGELOG.md         — Unreleased entry added

Documentation Gap recorded (see CHANGELOG entry): BARADA_PLATFORM_BLUEPRINT.md
and the ADR-001–009 series referenced in prior chat sessions do not exist on
disk in this repo. docs/ARCHITECTURE.md is the only real, on-disk ADR log
(independently numbered 001–007); this fix continues that series as ADR-008.

Run from repo root: py fix_adr008_enrollment_progress_separation.py
"""
import os

def w(rel, content):
    path = os.path.join(*rel.split('/'))
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Wrote: {rel}')

def delete(rel):
    path = os.path.join(*rel.split('/'))
    if os.path.exists(path):
        os.remove(path)
        print(f'  Deleted: {rel}')
    else:
        print(f'  Already absent: {rel}')

def append_or_replace(rel, anchor, new_text, replace=False):
    path = os.path.join(*rel.split('/'))
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if anchor not in content:
        print(f'  WARNING: anchor not found in {rel} — skipping (check manually)')
        return
    if replace:
        content = content.replace(anchor, new_text)
    else:
        content = content.replace(anchor, anchor + new_text)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Updated: {rel}')

print("Implementing ADR-008: enrollment / progress separation...")

# ============================================================================
# FIX P0: lib/db/enrollments.ts — populate course_id, add isEnrolledByCourseId
# ============================================================================
w('lib/db/enrollments.ts', r"""import { createClient } from '@/lib/supabase/server'

function mapEnrollment(d: any) {
  return { enrollmentId: d.enrollment_id, learnerId: d.learner_id, courseSlug: d.course_slug, courseId: d.course_id, status: d.status, enrolledAt: d.enrolled_at, lastAccessedAt: d.last_accessed_at, completedAt: d.completed_at }
}

export async function getEnrollment(learnerId: string, courseSlug: string) {
  const supabase = await createClient()
  const { data } = await (supabase as any).from('enrollments').select('*').eq('learner_id', learnerId).eq('course_slug', courseSlug).single()
  if (!data) return null
  return mapEnrollment(data)
}

export async function getLearnerEnrollments(learnerId: string) {
  const supabase = await createClient()
  const { data } = await (supabase as any).from('enrollments').select('*').eq('learner_id', learnerId).order('last_accessed_at', { ascending: false, nullsFirst: false })
  return (data ?? []).map(mapEnrollment)
}

/**
 * Enrolls a learner in a course. ALWAYS populates course_id — the FK column
 * has existed on this table but was silently left NULL by every insert
 * before this fix (found during Sprint 4.4 / ADR-008 investigation).
 */
export async function enrollLearner(learnerId: string, courseSlug: string) {
  const supabase = await createClient()

  const { data: course } = await (supabase as any)
    .from('courses')
    .select('course_id')
    .eq('slug', courseSlug)
    .maybeSingle()

  const { data, error } = await (supabase as any)
    .from('enrollments')
    .insert({
      learner_id: learnerId,
      course_slug: courseSlug,
      course_id: course?.course_id ?? null,
    })
    .select()
    .single()

  return { data, error }
}

export async function isEnrolled(learnerId: string, courseSlug: string): Promise<boolean> {
  const supabase = await createClient()
  const { count } = await (supabase as any).from('enrollments').select('*', { count: 'exact', head: true }).eq('learner_id', learnerId).eq('course_slug', courseSlug)
  return (count ?? 0) > 0
}

/**
 * Same check as isEnrolled(), but keyed by course_id (UUID) instead of slug.
 * Added for ADR-008-era code (Sprint 4.4+) that only has course_id on hand
 * (e.g. resolved from a lesson lookup), avoiding an extra slug round-trip.
 */
export async function isEnrolledByCourseId(learnerId: string, courseId: string): Promise<boolean> {
  const supabase = await createClient()
  const { count } = await (supabase as any).from('enrollments').select('*', { count: 'exact', head: true }).eq('learner_id', learnerId).eq('course_id', courseId)
  return (count ?? 0) > 0
}
""")

# ============================================================================
# FIX P0: app/api/dashboard/route.ts — repair broken queries, ADR-008 sourcing
# ============================================================================
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

    // enrollments = status/gating only, per ADR-008. Does NOT carry completion %.
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('enrollment_id, course_slug, course_id, status, enrolled_at')
      .eq('learner_id', learner.learner_id)
      .order('enrolled_at', { ascending: false })

    // course_progress = sole source of truth for completion %, per ADR-008.
    const { data: courseProgress } = await supabase
      .from('course_progress')
      .select('course_id, completion_percentage, status')
      .eq('learner_id', learner.learner_id)

    const progressByCourseId = new Map(
      ((courseProgress as any[]) ?? []).map((p) => [p.course_id, p])
    )

    const enrollmentsWithProgress = ((enrollments as any[]) ?? []).map((e) => ({
      ...e,
      completion_percentage: progressByCourseId.get(e.course_id)?.completion_percentage ?? 0,
    }))

    const { count: lessonsCompleted } = await supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('learner_id', learner.learner_id)
      .eq('status', 'completed')

    const { data: certificates } = await supabase
      .from('certificates')
      .select('certificate_id, course_slug, issued_at, certificate_url, course_id')
      .eq('learner_id', learner.learner_id)
      .order('issued_at', { ascending: false })

    const { data: recentProgress } = await supabase
      .from('lesson_progress')
      .select('course_id, lesson_id, last_accessed_at')
      .eq('learner_id', learner.learner_id)
      .order('last_accessed_at', { ascending: false })
      .limit(1)

    return NextResponse.json({
      learner,
      stats: {
        enrolledCount: enrollments?.length || 0,
        lessonsCompleted: lessonsCompleted || 0,
        certificateCount: certificates?.length || 0,
      },
      enrollments: enrollmentsWithProgress,
      certificates: certificates || [],
      recentProgress: recentProgress?.[0] || null,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
""")

# ============================================================================
# app/(dashboard)/dashboard/courses/page.tsx — read completion from course_progress
# ============================================================================
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
""")

# ============================================================================
# Retire app/api/progress/route.ts (410, zero live callers, broken schema)
# ============================================================================
w('app/api/progress/route.ts', r"""import { NextResponse } from 'next/server'

/**
 * RETIRED — per ADR-008 (Sprint 4.4).
 *
 * This endpoint wrote to the pre-ADR lesson_progress schema
 * (course_slug / module_number / lesson_number / is_completed), which no
 * longer exists after the Sprint 4.4 migration. No frontend caller was
 * found referencing this route at the time of retirement (verified via
 * repo-wide search). Returns 410 Gone rather than a silent 500/404 so any
 * caller we didn't find gets an explicit, actionable error.
 *
 * Replacement: POST /api/lessons/[id]/complete
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'This endpoint has been retired.',
      replacement: '/api/lessons/[id]/complete',
      reason: 'Superseded by Sprint 4.4 progress tracking (ADR-008).',
    },
    { status: 410 }
  )
}
""")

# ============================================================================
# Delete lib/db/progress.ts — fully superseded, zero callers
# ============================================================================
delete('lib/db/progress.ts')

# ============================================================================
# Add enrollment check to lesson complete/resume routes
# ============================================================================
w('app/api/lessons/[id]/complete/route.ts', r"""import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { isEnrolledByCourseId } from '@/lib/db/enrollments'
import { updateLearningStreak } from '@/lib/services/streaks'
import { checkAndGrantAchievements } from '@/lib/services/achievements'
import { logger } from '@/lib/utils/logger'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const videoCompleted = body.videoCompleted ?? true
    const readingCompleted = body.readingCompleted ?? true
    const quizCompleted = body.quizCompleted ?? true
    const timeSpentSeconds = body.timeSpentSeconds ?? 0

    const supabase = await createClient()

    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('lesson_id, course_id')
      .eq('lesson_id', params.id)
      .maybeSingle()

    if (lessonError) throw lessonError
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })

    const courseId = (lesson as any).course_id

    const enrolled = await isEnrolledByCourseId(learner.learnerId, courseId)
    if (!enrolled) {
      return NextResponse.json({ error: 'You must be enrolled in this course to track progress' }, { status: 403 })
    }

    const now = new Date().toISOString()

    const { error: upsertError } = await (supabase.from('lesson_progress') as any)
      .upsert(
        {
          learner_id: learner.learnerId,
          lesson_id: params.id,
          course_id: courseId,
          status: 'completed',
          video_completed: videoCompleted,
          reading_completed: readingCompleted,
          quiz_completed: quizCompleted,
          time_spent_seconds: timeSpentSeconds,
          completed_at: now,
          last_accessed_at: now,
          updated_at: now,
        },
        { onConflict: 'learner_id,lesson_id' }
      )

    if (upsertError) throw upsertError

    const { count: totalLessons } = await supabase
      .from('lessons')
      .select('lesson_id', { count: 'exact', head: true })
      .eq('course_id', courseId)

    const { count: completedLessons } = await supabase
      .from('lesson_progress')
      .select('progress_id', { count: 'exact', head: true })
      .eq('learner_id', learner.learnerId)
      .eq('course_id', courseId)
      .eq('status', 'completed')

    const total = totalLessons ?? 0
    const completed = completedLessons ?? 0
    const pct = total > 0 ? Math.round((completed / total) * 10000) / 100 : 0
    const courseStatus = total > 0 && completed >= total ? 'completed' : completed > 0 ? 'in_progress' : 'not_started'

    const { data: existingCourseProgress } = await supabase
      .from('course_progress')
      .select('started_at')
      .eq('learner_id', learner.learnerId)
      .eq('course_id', courseId)
      .maybeSingle()

    const priorStartedAt = (existingCourseProgress as any)?.started_at

    await (supabase.from('course_progress') as any).upsert(
      {
        learner_id: learner.learnerId,
        course_id: courseId,
        status: courseStatus,
        completion_percentage: pct,
        lessons_completed: completed,
        lessons_total: total,
        last_accessed_lesson_id: params.id,
        last_accessed_at: now,
        started_at: priorStartedAt ?? now,
        completed_at: courseStatus === 'completed' ? now : null,
        updated_at: now,
      },
      { onConflict: 'learner_id,course_id' }
    )

    const streak = await updateLearningStreak(learner.learnerId)
    const newAchievements = await checkAndGrantAchievements(learner.learnerId)

    return NextResponse.json({
      data: {
        lessonId: params.id,
        courseId,
        courseCompletionPercentage: pct,
        courseStatus,
        streak,
        newAchievements,
      },
    })
  } catch (e: any) {
    await logger.error({ error_type: 'lesson_complete_error', message: e?.message, route: '/api/lessons/[id]/complete' })
    return NextResponse.json({ error: 'Failed to mark lesson complete' }, { status: 500 })
  }
}
""")

w('app/api/lessons/[id]/resume/route.ts', r"""import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { isEnrolledByCourseId } from '@/lib/db/enrollments'
import { logger } from '@/lib/utils/logger'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const resumePositionSeconds = body.resumePositionSeconds ?? 0
    const timeSpentSeconds = body.timeSpentSeconds ?? 0

    const supabase = await createClient()

    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('lesson_id, course_id')
      .eq('lesson_id', params.id)
      .maybeSingle()

    if (lessonError) throw lessonError
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })

    const courseId = (lesson as any).course_id

    const enrolled = await isEnrolledByCourseId(learner.learnerId, courseId)
    if (!enrolled) {
      return NextResponse.json({ error: 'You must be enrolled in this course to track progress' }, { status: 403 })
    }

    const now = new Date().toISOString()

    const { data: existing } = await supabase
      .from('lesson_progress')
      .select('status, time_spent_seconds, started_at')
      .eq('learner_id', learner.learnerId)
      .eq('lesson_id', params.id)
      .maybeSingle()

    const existingRow = existing as any
    const newStatus = existingRow?.status === 'completed' ? 'completed' : 'in_progress'
    const priorTimeSpent = existingRow?.time_spent_seconds ?? 0

    const { error: upsertError } = await (supabase.from('lesson_progress') as any).upsert(
      {
        learner_id: learner.learnerId,
        lesson_id: params.id,
        course_id: courseId,
        status: newStatus,
        resume_position_seconds: resumePositionSeconds,
        time_spent_seconds: priorTimeSpent + timeSpentSeconds,
        started_at: existingRow?.started_at ?? now,
        last_accessed_at: now,
        updated_at: now,
      },
      { onConflict: 'learner_id,lesson_id' }
    )

    if (upsertError) throw upsertError

    await (supabase.from('course_progress') as any)
      .update({ last_accessed_lesson_id: params.id, last_accessed_at: now })
      .eq('learner_id', learner.learnerId)
      .eq('course_id', courseId)

    return NextResponse.json({
      data: { lessonId: params.id, resumePositionSeconds, status: newStatus },
    })
  } catch (e: any) {
    await logger.error({ error_type: 'lesson_resume_error', message: e?.message, route: '/api/lessons/[id]/resume' })
    return NextResponse.json({ error: 'Failed to save resume position' }, { status: 500 })
  }
}
""")

# ============================================================================
# Documentation: ADR-008 appended to docs/ARCHITECTURE.md
# ============================================================================
adr_008 = r"""

### ADR-008: `course_progress` as sole source of truth for completion tracking; `enrollments` restricted to status/gating

**Decision:** `enrollments` remains authoritative for enrollment status, enrollment date, access control, and purchase/enrollment metadata. `course_progress` (and `lesson_progress`, introduced Sprint 4.4) becomes the sole source of truth for completion percentage, lesson progress, resume position, time spent, learning analytics, and completion timestamps. `completion_percentage` is NOT duplicated in `enrollments`.

**Context:** Investigation during Sprint 4.4 found `enrollments.completion_percentage` was kept in sync by a database trigger (`update_enrollment_on_lesson_complete`, defined in `003_triggers.sql`) bound to the pre-Sprint-4.4 `lesson_progress` schema (`course_slug`, `is_completed`, `module_number`). That schema was replaced during Sprint 4.4's migration; the `DROP TABLE ... CASCADE` on the old `lesson_progress` table removed the trigger binding as a side effect. The `enrollments.course_id` FK column existed but was never populated by `enrollLearner()` — fixed as part of this ADR.

**Reason:** A single number (completion %) maintained in two places by two different write paths (an enrollment service function vs. a lesson-completion service function) is a drift risk with no compensating benefit — `course_progress` already recomputes and stores this correctly on every lesson completion. Separating "is this learner allowed here" (enrollments) from "how far have they gotten" (course_progress) is also a cleaner domain boundary going forward.

**Trade-off:** Any code still reading `enrollments.completion_percentage` for display must be updated to read `course_progress` instead, joined by `course_id`. Two call sites were found and updated: `app/(dashboard)/dashboard/courses/page.tsx` and `app/api/dashboard/route.ts`.

**Related fixes (same investigation, same commit):**
- `lib/db/enrollments.ts`: `enrollLearner()` now populates `course_id` on every insert (was previously always left NULL); added `isEnrolledByCourseId()`.
- `app/api/dashboard/route.ts`: repaired — was querying old-schema `lesson_progress` columns (`completed`, `course_slug`, `lesson_slug`) that no longer exist after the Sprint 4.4 migration, and would have errored at runtime.
- `app/api/progress/route.ts` and `lib/db/progress.ts`: retired. Both were built against the pre-ADR-008 schema, had zero live frontend callers (verified by repo-wide search), and are fully superseded by `POST /api/lessons/[id]/complete` (Sprint 4.4). The route now returns `410 Gone` with a pointer to the replacement rather than being silently deleted.
- `app/api/lessons/[id]/complete/route.ts`, `app/api/lessons/[id]/resume/route.ts`: added an enrollment check (`isEnrolledByCourseId`) before writing progress — previously these routes would record progress for a course the learner was never enrolled in.

**Documentation gap noted:** `BARADA_PLATFORM_BLUEPRINT.md` and an independent ADR-001–009 series (covering platform/schema decisions — SQL migrations over Prisma, the `domains` rename, the assets pattern, etc.) have been referenced across prior working sessions on this project, but do not exist as files in this repository. This document (`docs/ARCHITECTURE.md`) is the only ADR log confirmed to exist on disk, with its own independently-numbered series (001–007, tech-stack decisions). This entry continues that series as ADR-008. Reconciling the two ADR numbering series, if the Blueprint document is recovered or rewritten, is a follow-up task — not resolved by this fix.
"""

append_or_replace(
    'docs/ARCHITECTURE.md',
    '**Future option:** Migrate to Mux or Cloudflare Stream for DRM-level protection when course content is commercially sensitive',
    adr_008
)

# ============================================================================
# Documentation: CHANGELOG.md entry
# ============================================================================
changelog_entry = r"""
### Fixed — Sprint 4.4 / ADR-008 (August 2026)

- **[P0]** `lib/db/enrollments.ts`: `enrollLearner()` now populates the `course_id` FK on every insert (previously always NULL, silently, since the column was added)
- **[P0]** `app/api/dashboard/route.ts`: repaired — was querying `lesson_progress` columns removed by the Sprint 4.4 migration (`completed`, `course_slug`, `lesson_slug`); would have returned 500 at runtime
- `app/(dashboard)/dashboard/courses/page.tsx`: completion % now read from `course_progress`, not `enrollments.completion_percentage`, per ADR-008
- `app/api/lessons/[id]/complete/route.ts`, `.../resume/route.ts`: added enrollment verification before writing progress (previously missing)

### Removed

- `app/api/progress/route.ts`: retired (returns 410), superseded by `POST /api/lessons/[id]/complete`. Zero live callers found.
- `lib/db/progress.ts`: deleted — built against pre-Sprint-4.4 schema, fully superseded, zero callers.

### Documentation Gap (recorded, not resolved)

`BARADA_PLATFORM_BLUEPRINT.md` and an ADR-001–009 series covering platform/schema decisions (SQL migrations over Prisma, `domains` rename, assets pattern, etc.) have been referenced in prior working sessions on this project but do not exist in this repository. `docs/ARCHITECTURE.md`'s own independent ADR series (001–007) is the only ADR log confirmed to exist on disk; ADR-008 (this entry) continues that series. `docs/DATABASE.md` and `docs/API.md` also predate Sprint 4.4's new tables/routes and are now stale — flagged for a follow-up documentation pass, not addressed in this fix.
"""

append_or_replace(
    'docs/CHANGELOG.md',
    '## [Unreleased]\n\nChanges merged to `main` but not yet tagged as a release.\n',
    changelog_entry
)

print("\nDone.")
print("Next: npm run type-check, npm run lint, npm test")
