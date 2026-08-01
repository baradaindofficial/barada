/**
 * lib/supabase/client.ts
 * Browser-side Supabase client — use in Client Components only
 * Uses @supabase/ssr for proper cookie-based session management
 */
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
