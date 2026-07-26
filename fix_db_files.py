import os

BASE = r'C:\Users\dell\barada-nextjs'

def w(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print('Fixed: ' + rel)

w('lib/db/learners.ts', """import { createClient } from '@/lib/supabase/server'

export async function getLearner(learnerId: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).from('learners').select('*').eq('learner_id', learnerId).single()
  if (!data) return null
  return { learnerId: data.learner_id, name: data.name, email: data.email, avatarUrl: data.avatar_url, bio: data.bio, profession: data.profession, linkedinUrl: data.linkedin_url, status: data.status, createdAt: data.created_at }
}

export async function getLearnerStats(learnerId: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).rpc('get_learner_stats', { p_learner_id: learnerId })
  const row = (data as Record<string, unknown>[])?.[0] ?? {}
  return { enrolledCount: Number(row.enrolled_count ?? 0), completedCount: Number(row.completed_count ?? 0), certificateCount: Number(row.certificate_count ?? 0), totalWatchSeconds: Number(row.total_watch_seconds ?? 0) }
}

export async function updateLearner(learnerId: string, updates: { name?: string; bio?: string; profession?: string; linkedinUrl?: string }) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('learners').update({ name: updates.name, bio: updates.bio, profession: updates.profession, linkedin_url: updates.linkedinUrl }).eq('learner_id', learnerId)
  return { error }
}
""")

w('lib/db/enrollments.ts', """import { createClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEnrollment(d: any) {
  return { enrollmentId: d.enrollment_id, learnerId: d.learner_id, courseSlug: d.course_slug, status: d.status, completionPercentage: d.completion_percentage, enrolledAt: d.enrolled_at, lastAccessedAt: d.last_accessed_at, completedAt: d.completed_at }
}

export async function getEnrollment(learnerId: string, courseSlug: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).from('enrollments').select('*').eq('learner_id', learnerId).eq('course_slug', courseSlug).single()
  if (!data) return null
  return mapEnrollment(data)
}

export async function getLearnerEnrollments(learnerId: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).from('enrollments').select('*').eq('learner_id', learnerId).order('last_accessed_at', { ascending: false, nullsFirst: false })
  return (data ?? []).map(mapEnrollment)
}

export async function enrollLearner(learnerId: string, courseSlug: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).from('enrollments').insert({ learner_id: learnerId, course_slug: courseSlug }).select().single()
  return { data, error }
}

export async function isEnrolled(learnerId: string, courseSlug: string): Promise<boolean> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (supabase as any).from('enrollments').select('*', { count: 'exact', head: true }).eq('learner_id', learnerId).eq('course_slug', courseSlug)
  return (count ?? 0) > 0
}
""")

w('lib/db/progress.ts', """import { createClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProgress(d: any) {
  return { courseSlug: d.course_slug, moduleNumber: d.module_number, lessonNumber: d.lesson_number, isCompleted: d.is_completed, completedAt: d.completed_at, watchedSeconds: d.watched_seconds }
}

export async function getCourseProgress(learnerId: string, courseSlug: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).from('lesson_progress').select('*').eq('learner_id', learnerId).eq('course_slug', courseSlug)
  return (data ?? []).map(mapProgress)
}

export async function markLessonComplete(learnerId: string, courseSlug: string, moduleNumber: number, lessonNumber: number) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('lesson_progress').upsert({ learner_id: learnerId, course_slug: courseSlug, module_number: moduleNumber, lesson_number: lessonNumber, is_completed: true, completed_at: new Date().toISOString() }, { onConflict: 'learner_id,course_slug,module_number,lesson_number' })
  return { error }
}

export async function updateWatchProgress(learnerId: string, courseSlug: string, moduleNumber: number, lessonNumber: number, watchedSeconds: number) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('lesson_progress').upsert({ learner_id: learnerId, course_slug: courseSlug, module_number: moduleNumber, lesson_number: lessonNumber, watched_seconds: watchedSeconds, last_watched_at: new Date().toISOString() }, { onConflict: 'learner_id,course_slug,module_number,lesson_number' })
  return { error }
}
""")

w('context/AuthContext.tsx', """'use client'
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [learner, setLearner] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseRef = useRef<any>(null)
  if (!supabaseRef.current) supabaseRef.current = createClient()
  const supabase = supabaseRef.current

  const loadLearner = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from('learners').select('learner_id, name, email, avatar_url, bio, profession, linkedin_url, status, created_at').eq('learner_id', userId).single()
    if (error || !data) { console.warn('[AuthContext] loadLearner:', error?.message); return }
    setLearner({ learnerId: data.learner_id, name: data.name, email: data.email, avatarUrl: data.avatar_url, bio: data.bio, profession: data.profession, linkedinUrl: data.linkedin_url, status: data.status, createdAt: data.created_at })
  }, [supabase])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }: { data: { user: User | null } }) => { setUser(u); if (u) loadLearner(u.id); setIsLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e: string, session: { user: User } | null) => { setUser(session?.user ?? null); if (session?.user) await loadLearner(session.user.id); else setLearner(null); setIsLoading(false) })
    return () => subscription.unsubscribe()
  }, [supabase, loadLearner])

  const signOut = useCallback(async () => { await supabase.auth.signOut(); setUser(null); setLearner(null) }, [supabase])
  const refreshLearner = useCallback(async () => { if (user) await loadLearner(user.id) }, [user, loadLearner])

  return <AuthContext.Provider value={{ user, learner, isLoading, isAuthenticated: !!user, signOut, refreshLearner }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth() must be called inside <AuthProvider>.')
  return ctx
}
""")

print('All 4 files fixed.')
