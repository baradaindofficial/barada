/**
 * app/api/auth/signout/route.ts
 * POST /api/auth/signout — Signs out the current user and clears session cookies.
 * Called from the sign-out form in the dashboard.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Verify there is an active session before signing out
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  // Always redirect to home — even if no session existed
  return NextResponse.redirect(new URL('/', request.url), { status: 302 })
}
