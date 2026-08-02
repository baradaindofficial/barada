import { createClient } from '@/lib/supabase/server'

export interface AuthenticatedLearner {
  userId: string
  learnerId: string
}

/**
 * Returns the authenticated user and their learner record.
 * Returns null if unauthenticated or learner row not found.
 * Use this in every API route that requires a logged-in learner.
 */
export async function getAuthenticatedLearner(): Promise<AuthenticatedLearner | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('learners')
    .select('learner_id')
    .eq('id', user.id)
    .maybeSingle()

  if (!data) return null
  return { userId: user.id, learnerId: (data as any).learner_id }
}
