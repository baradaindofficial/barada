import { createClient as createSupabaseClient } from '@supabase/supabase-js'

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
