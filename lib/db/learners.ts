import { createClient } from '@/lib/supabase/server'

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
