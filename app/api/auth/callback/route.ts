/**
 * app/api/auth/callback/route.ts
 * Handles Supabase Auth email verification and OAuth callbacks.
 *
 * SECURITY: The `next` param is sanitised to only allow relative paths,
 * preventing open-redirect attacks where an attacker crafts a link like:
 *   /api/auth/callback?code=xxx&next=https://evil.com
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/** Only allow safe relative redirect targets — no protocol, no external hosts */
function sanitiseNext(raw: string | null): string {
  if (!raw) return '/dashboard'
  // Must start with / and must not contain :// (rules out http://, https://, etc.)
  if (raw.startsWith('/') && !raw.includes('://') && !raw.startsWith('//')) {
    // Strip any double-slashes that could be used as //evil.com
    return raw.replace(/\/+/g, '/').slice(0, 200)
  }
  return '/dashboard'
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const next  = sanitiseNext(searchParams.get('next'))
  const error = searchParams.get('error')

  // Supabase returned an explicit error (e.g. expired link)
  if (error) {
    const url = new URL('/login', origin)
    url.searchParams.set('error', 'link_expired')
    return NextResponse.redirect(url)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      // Successful auth — redirect to validated relative path only
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  const url = new URL('/login', origin)
  url.searchParams.set('error', 'auth_callback_failed')
  return NextResponse.redirect(url)
}
