"""
sprint44_backend.py
Barada Digital Platform — Sprint 4.4 Backend: Learning Experience & Progress Tracking

Creates:
  lib/supabase/admin.ts              — service-role client (bypasses RLS)
  lib/services/streaks.ts            — streak calculation, server-only writes
  lib/services/achievements.ts       — achievement grant logic, server-only writes
  app/api/courses/progress/route.ts
  app/api/courses/[id]/progress/route.ts
  app/api/lessons/[id]/complete/route.ts
  app/api/lessons/[id]/resume/route.ts
  app/api/courses/[id]/bookmark/route.ts
  app/api/dashboard/learning/route.ts
  app/api/dashboard/streak/route.ts
  app/api/dashboard/achievements/route.ts
  app/api/dashboard/recent-learning/route.ts

Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (see chat for how to get it).

NOTE: assessment_master achievement queries `assessment_attempts` (current,
Sprint 4.2 table) — NOT `quiz_attempts` (legacy, course_slug-based, appears
unused by current code). Flag to CTO if quiz_attempts is still needed.

Run from repo root: py sprint44_backend.py
"""
import os

def w(rel, content):
    path = os.path.join(*rel.split('/'))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Created: {rel}')

print("Sprint 4.4 — writing backend files...")

# ============================================================================
# lib/supabase/admin.ts — SERVICE ROLE CLIENT
# ============================================================================
w('lib/supabase/admin.ts', r"""import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client. BYPASSES ROW LEVEL SECURITY.
 * Server-only. Never import this into client components.
 *
 * Use only for writes that must not be forgeable by the learner via a
 * direct API call — currently: learning_streaks, user_achievements.
 * All other reads/writes should go through the normal request-scoped
 * client in lib/supabase/server.ts, which respects RLS.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Missing Supabase admin credentials. Set SUPABASE_SERVICE_ROLE_KEY in .env.local ' +
      '(Supabase dashboard -> Project Settings -> API -> service_role key). Never commit this key.'
    )
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
""")

# ============================================================================
# lib/services/streaks.ts
# ============================================================================
w('lib/services/streaks.ts', r"""import { createAdminClient } from '@/lib/supabase/admin'

export interface StreakResult {
  current_streak_days: number
  longest_streak_days: number
}

/**
 * Recalculates and updates a learner's daily streak.
 * Server-only — writes via service role (bypasses RLS), so this must only
 * ever be called from trusted server code after a verified learning event
 * (e.g. lesson completion), never directly from a client-facing input.
 */
export async function updateLearningStreak(learnerId: string): Promise<StreakResult> {
  const admin = createAdminClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data: existing } = await admin
    .from('learning_streaks')
    .select('current_streak_days, longest_streak_days, last_activity_date, streak_started_at')
    .eq('learner_id', learnerId)
    .maybeSingle()

  const row = existing as any

  if (!row) {
    const { error } = await (admin.from('learning_streaks') as any).insert({
      learner_id: learnerId,
      current_streak_days: 1,
      longest_streak_days: 1,
      last_activity_date: today,
      streak_started_at: today,
    })
    if (error) throw error
    return { current_streak_days: 1, longest_streak_days: 1 }
  }

  if (row.last_activity_date === today) {
    return {
      current_streak_days: row.current_streak_days,
      longest_streak_days: row.longest_streak_days,
    }
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const consecutive = row.last_activity_date === yesterday

  const newCurrent = consecutive ? row.current_streak_days + 1 : 1
  const newLongest = Math.max(newCurrent, row.longest_streak_days)
  const newStreakStart = consecutive ? row.streak_started_at : today

  const { error } = await (admin.from('learning_streaks') as any)
    .update({
      current_streak_days: newCurrent,
      longest_streak_days: newLongest,
      last_activity_date: today,
      streak_started_at: newStreakStart,
      updated_at: new Date().toISOString(),
    })
    .eq('learner_id', learnerId)

  if (error) throw error
  return { current_streak_days: newCurrent, longest_streak_days: newLongest }
}
""")

# ============================================================================
# lib/services/achievements.ts
# ============================================================================
w('lib/services/achievements.ts', r"""import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

type AchievementCode =
  | 'first_lesson'
  | 'first_course'
  | 'streak_7'
  | 'streak_30'
  | 'lessons_100'
  | 'assessment_master'
  | 'course_completion'
  | 'top_learner'

const POSTGRES_UNIQUE_VIOLATION = '23505'

async function grantAchievement(
  admin: ReturnType<typeof createAdminClient>,
  learnerId: string,
  code: AchievementCode
): Promise<boolean> {
  const { data: achievement } = await admin
    .from('achievements')
    .select('achievement_id')
    .eq('code', code)
    .maybeSingle()

  if (!achievement) return false

  const { error } = await (admin.from('user_achievements') as any).insert({
    learner_id: learnerId,
    achievement_id: (achievement as any).achievement_id,
  })

  if (error) {
    if ((error as any).code === POSTGRES_UNIQUE_VIOLATION) return false // already earned
    await logger.error({
      error_type: 'achievement_grant_error',
      message: (error as any).message,
      route: 'lib/services/achievements',
    })
    return false
  }
  return true
}

/**
 * Checks current learner stats against all achievement criteria and grants
 * any newly-earned badges. Server-only — writes via service role.
 * Call after any learning event that could satisfy a criterion
 * (lesson complete, course complete, streak update, evaluation graded).
 *
 * Returns the list of achievement codes newly granted in this call
 * (empty array if none — most calls will grant nothing new).
 */
export async function checkAndGrantAchievements(learnerId: string): Promise<string[]> {
  const admin = createAdminClient()
  const granted: string[] = []

  const { count: lessonCount } = await admin
    .from('lesson_progress')
    .select('progress_id', { count: 'exact', head: true })
    .eq('learner_id', learnerId)
    .eq('status', 'completed')

  if ((lessonCount ?? 0) >= 1 && (await grantAchievement(admin, learnerId, 'first_lesson'))) {
    granted.push('first_lesson')
  }
  if ((lessonCount ?? 0) >= 100 && (await grantAchievement(admin, learnerId, 'lessons_100'))) {
    granted.push('lessons_100')
  }

  const { count: courseCount } = await admin
    .from('course_progress')
    .select('progress_id', { count: 'exact', head: true })
    .eq('learner_id', learnerId)
    .eq('status', 'completed')

  if ((courseCount ?? 0) >= 1 && (await grantAchievement(admin, learnerId, 'first_course'))) {
    granted.push('first_course')
  }
  if ((courseCount ?? 0) >= 5 && (await grantAchievement(admin, learnerId, 'course_completion'))) {
    granted.push('course_completion')
  }

  const { data: streak } = await admin
    .from('learning_streaks')
    .select('current_streak_days')
    .eq('learner_id', learnerId)
    .maybeSingle()

  const currentStreak = (streak as any)?.current_streak_days ?? 0
  if (currentStreak >= 7 && (await grantAchievement(admin, learnerId, 'streak_7'))) {
    granted.push('streak_7')
  }
  if (currentStreak >= 30 && (await grantAchievement(admin, learnerId, 'streak_30'))) {
    granted.push('streak_30')
  }

  // NOTE: queries assessment_attempts (current, Sprint 4.2 table).
  // quiz_attempts is a legacy table not used here — flag to CTO if wrong.
  const { count: highScoreCount } = await admin
    .from('assessment_attempts')
    .select('attempt_id', { count: 'exact', head: true })
    .eq('learner_id', learnerId)
    .gte('score', 90)

  if ((highScoreCount ?? 0) >= 5 && (await grantAchievement(admin, learnerId, 'assessment_master'))) {
    granted.push('assessment_master')
  }

  return granted
}
""")

# ============================================================================
# app/api/courses/progress/route.ts — GET all course progress for learner
# ============================================================================
w('app/api/courses/progress/route.ts', r"""import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function GET() {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('course_progress')
      .select('course_id, status, completion_percentage, lessons_completed, lessons_total, last_accessed_at, started_at, completed_at')
      .eq('learner_id', learner.learner_id)
      .order('last_accessed_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data: { courses: data } })
  } catch (e: any) {
    await logger.error({ error_type: 'course_progress_list_error', message: e?.message, route: '/api/courses/progress' })
    return NextResponse.json({ error: 'Failed to load course progress' }, { status: 500 })
  }
}
""")

# ============================================================================
# app/api/courses/[id]/progress/route.ts — GET single course progress
# ============================================================================
w('app/api/courses/[id]/progress/route.ts', r"""import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('learner_id', learner.learner_id)
      .eq('course_id', params.id)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return NextResponse.json({
        data: {
          course_id: params.id,
          status: 'not_started',
          completion_percentage: 0,
          lessons_completed: 0,
          lessons_total: 0,
        },
      })
    }

    return NextResponse.json({ data })
  } catch (e: any) {
    await logger.error({ error_type: 'course_progress_detail_error', message: e?.message, route: '/api/courses/[id]/progress' })
    return NextResponse.json({ error: 'Failed to load course progress' }, { status: 500 })
  }
}
""")

# ============================================================================
# app/api/lessons/[id]/complete/route.ts — POST mark lesson complete
# ============================================================================
w('app/api/lessons/[id]/complete/route.ts', r"""import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
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
    const now = new Date().toISOString()

    const { error: upsertError } = await (supabase.from('lesson_progress') as any)
      .upsert(
        {
          learner_id: learner.learner_id,
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
      .eq('learner_id', learner.learner_id)
      .eq('course_id', courseId)
      .eq('status', 'completed')

    const total = totalLessons ?? 0
    const completed = completedLessons ?? 0
    const pct = total > 0 ? Math.round((completed / total) * 10000) / 100 : 0
    const courseStatus = total > 0 && completed >= total ? 'completed' : completed > 0 ? 'in_progress' : 'not_started'

    const { data: existingCourseProgress } = await supabase
      .from('course_progress')
      .select('started_at')
      .eq('learner_id', learner.learner_id)
      .eq('course_id', courseId)
      .maybeSingle()

    const priorStartedAt = (existingCourseProgress as any)?.started_at

    await (supabase.from('course_progress') as any).upsert(
      {
        learner_id: learner.learner_id,
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

    const streak = await updateLearningStreak(learner.learner_id)
    const newAchievements = await checkAndGrantAchievements(learner.learner_id)

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

# ============================================================================
# app/api/lessons/[id]/resume/route.ts — POST save resume position
# ============================================================================
w('app/api/lessons/[id]/resume/route.ts', r"""import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
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
    const now = new Date().toISOString()

    const { data: existing } = await supabase
      .from('lesson_progress')
      .select('status, time_spent_seconds, started_at')
      .eq('learner_id', learner.learner_id)
      .eq('lesson_id', params.id)
      .maybeSingle()

    const existingRow = existing as any
    const newStatus = existingRow?.status === 'completed' ? 'completed' : 'in_progress'
    const priorTimeSpent = existingRow?.time_spent_seconds ?? 0

    const { error: upsertError } = await (supabase.from('lesson_progress') as any).upsert(
      {
        learner_id: learner.learner_id,
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
      .eq('learner_id', learner.learner_id)
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
# app/api/courses/[id]/bookmark/route.ts — POST/DELETE course bookmark
# (reuses public.bookmarks — no separate CourseBookmark table, per CTO decision)
# ============================================================================
w('app/api/courses/[id]/bookmark/route.ts', r"""import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('course_id, title')
      .eq('course_id', params.id)
      .maybeSingle()

    if (courseError) throw courseError
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    const c = course as any

    const { data, error } = await (supabase.from('bookmarks') as any)
      .upsert(
        {
          learner_id: learner.learner_id,
          entity_type: 'course',
          entity_id: params.id,
          entity_title: c.title,
          entity_url: `/learn/${params.id}`,
        },
        { onConflict: 'learner_id,entity_type,entity_id' }
      )
      .select('bookmark_id, entity_type, entity_id, entity_title, entity_url, created_at')
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (e: any) {
    await logger.error({ error_type: 'course_bookmark_error', message: e?.message, route: '/api/courses/[id]/bookmark' })
    return NextResponse.json({ error: 'Failed to bookmark course' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('learner_id', learner.learner_id)
      .eq('entity_type', 'course')
      .eq('entity_id', params.id)

    if (error) throw error
    return NextResponse.json({ data: { removed: true } })
  } catch (e: any) {
    await logger.error({ error_type: 'course_unbookmark_error', message: e?.message, route: '/api/courses/[id]/bookmark' })
    return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 })
  }
}
""")

# ============================================================================
# app/api/dashboard/learning/route.ts — GET overview stats
# ============================================================================
w('app/api/dashboard/learning/route.ts', r"""import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function GET() {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()

    const { data: courseProgress } = await supabase
      .from('course_progress')
      .select('status, completion_percentage, time_spent_seconds')
      .eq('learner_id', learner.learner_id)

    const rows = (courseProgress as any[]) ?? []
    const coursesInProgress = rows.filter((r) => r.status === 'in_progress').length
    const coursesCompleted = rows.filter((r) => r.status === 'completed').length
    const totalTimeSpentSeconds = rows.reduce((sum, r) => sum + (r.time_spent_seconds ?? 0), 0)

    const { data: streak } = await supabase
      .from('learning_streaks')
      .select('current_streak_days, longest_streak_days')
      .eq('learner_id', learner.learner_id)
      .maybeSingle()

    const { count: achievementsCount } = await supabase
      .from('user_achievements')
      .select('user_achievement_id', { count: 'exact', head: true })
      .eq('learner_id', learner.learner_id)

    return NextResponse.json({
      data: {
        coursesInProgress,
        coursesCompleted,
        totalCourses: rows.length,
        totalTimeSpentSeconds,
        currentStreakDays: (streak as any)?.current_streak_days ?? 0,
        longestStreakDays: (streak as any)?.longest_streak_days ?? 0,
        achievementsEarned: achievementsCount ?? 0,
      },
    })
  } catch (e: any) {
    await logger.error({ error_type: 'dashboard_learning_error', message: e?.message, route: '/api/dashboard/learning' })
    return NextResponse.json({ error: 'Failed to load learning dashboard' }, { status: 500 })
  }
}
""")

# ============================================================================
# app/api/dashboard/streak/route.ts — GET streak detail
# ============================================================================
w('app/api/dashboard/streak/route.ts', r"""import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function GET() {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('learning_streaks')
      .select('current_streak_days, longest_streak_days, last_activity_date, streak_started_at')
      .eq('learner_id', learner.learner_id)
      .maybeSingle()

    if (error) throw error

    return NextResponse.json({
      data: data ?? {
        current_streak_days: 0,
        longest_streak_days: 0,
        last_activity_date: null,
        streak_started_at: null,
      },
    })
  } catch (e: any) {
    await logger.error({ error_type: 'dashboard_streak_error', message: e?.message, route: '/api/dashboard/streak' })
    return NextResponse.json({ error: 'Failed to load streak' }, { status: 500 })
  }
}
""")

# ============================================================================
# app/api/dashboard/achievements/route.ts — GET all badges + earned status
# ============================================================================
w('app/api/dashboard/achievements/route.ts', r"""import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function GET() {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()

    const { data: allAchievements, error: allError } = await supabase
      .from('achievements')
      .select('achievement_id, code, title, description, icon, sort_order')
      .eq('is_active', true)
      .order('sort_order')

    if (allError) throw allError

    const { data: earned, error: earnedError } = await supabase
      .from('user_achievements')
      .select('achievement_id, earned_at')
      .eq('learner_id', learner.learner_id)

    if (earnedError) throw earnedError

    const earnedMap = new Map(((earned as any[]) ?? []).map((e) => [e.achievement_id, e.earned_at]))

    const combined = ((allAchievements as any[]) ?? []).map((a) => ({
      ...a,
      earned: earnedMap.has(a.achievement_id),
      earnedAt: earnedMap.get(a.achievement_id) ?? null,
    }))

    return NextResponse.json({ data: { achievements: combined } })
  } catch (e: any) {
    await logger.error({ error_type: 'dashboard_achievements_error', message: e?.message, route: '/api/dashboard/achievements' })
    return NextResponse.json({ error: 'Failed to load achievements' }, { status: 500 })
  }
}
""")

# ============================================================================
# app/api/dashboard/recent-learning/route.ts — GET continue-learning list
# ============================================================================
w('app/api/dashboard/recent-learning/route.ts', r"""import { NextResponse } from 'next/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export async function GET() {
  try {
    const learner = await getAuthenticatedLearner()
    if (!learner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('learner_recent_activity')
      .select('*')
      .eq('learner_id', learner.learner_id)
      .limit(10)

    if (error) throw error
    return NextResponse.json({ data: { recent: data } })
  } catch (e: any) {
    await logger.error({ error_type: 'dashboard_recent_learning_error', message: e?.message, route: '/api/dashboard/recent-learning' })
    return NextResponse.json({ error: 'Failed to load recent learning' }, { status: 500 })
  }
}
""")

print("\nDone. 11 files created.")
print("Next: npm run type-check")
