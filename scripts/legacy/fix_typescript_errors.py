#!/usr/bin/env python3
"""
Barada Academy — TypeScript Error Fix Script
Run this from inside your ~/barada-nextjs folder:
    cd ~/barada-nextjs
    python3 fix_typescript_errors.py
"""
import os, sys

BASE = os.path.dirname(os.path.abspath(__file__))

def write(rel, content):
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f'  ✅ Fixed: {rel}')

# ─────────────────────────────────────────────────────────────────────
# FIX 1: types/database.ts
# Root cause: @supabase/supabase-js v2.45+ requires CompositeTypes field
# ─────────────────────────────────────────────────────────────────────
write('types/database.ts', r"""/**
 * types/database.ts
 * Updated for @supabase/supabase-js v2.45+
 * which requires CompositeTypes in every schema definition.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      learners: {
        Row: {
          learner_id: string
          name: string
          email: string
          avatar_url: string | null
          bio: string | null
          profession: string | null
          linkedin_url: string | null
          status: 'active' | 'suspended' | 'pending_verification'
          created_at: string
          updated_at: string
        }
        Insert: {
          learner_id: string
          name: string
          email: string
          avatar_url?: string | null
          bio?: string | null
          profession?: string | null
          linkedin_url?: string | null
          status?: 'active' | 'suspended' | 'pending_verification'
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          avatar_url?: string | null
          bio?: string | null
          profession?: string | null
          linkedin_url?: string | null
          status?: 'active' | 'suspended' | 'pending_verification'
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          enrollment_id: string
          learner_id: string
          course_slug: string
          status: 'active' | 'completed' | 'paused'
          completion_percentage: number
          enrolled_at: string
          last_accessed_at: string | null
          completed_at: string | null
        }
        Insert: {
          enrollment_id?: string
          learner_id: string
          course_slug: string
          status?: 'active' | 'completed' | 'paused'
          completion_percentage?: number
          enrolled_at?: string
          last_accessed_at?: string | null
          completed_at?: string | null
        }
        Update: {
          status?: 'active' | 'completed' | 'paused'
          completion_percentage?: number
          last_accessed_at?: string | null
          completed_at?: string | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          progress_id: string
          learner_id: string
          course_slug: string
          module_number: number
          lesson_number: number
          is_completed: boolean
          completed_at: string | null
          watched_seconds: number
          last_watched_at: string | null
        }
        Insert: {
          progress_id?: string
          learner_id: string
          course_slug: string
          module_number: number
          lesson_number: number
          is_completed?: boolean
          completed_at?: string | null
          watched_seconds?: number
          last_watched_at?: string | null
        }
        Update: {
          is_completed?: boolean
          completed_at?: string | null
          watched_seconds?: number
          last_watched_at?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          attempt_id: string
          learner_id: string
          course_slug: string
          answers: number[]
          score: number
          passed: boolean
          attempted_at: string
          attempt_number: number
        }
        Insert: {
          attempt_id?: string
          learner_id: string
          course_slug: string
          answers: number[]
          score: number
          passed: boolean
          attempted_at?: string
          attempt_number?: number
        }
        Update: never
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_id: string
          learner_id: string
          course_slug: string
          learner_name: string
          course_title: string
          issued_at: string
          status: 'pending_payment' | 'issued' | 'revoked'
          verification_url: string
          payment_id: string | null
        }
        Insert: {
          certificate_id: string
          learner_id: string
          course_slug: string
          learner_name: string
          course_title: string
          issued_at?: string
          status?: 'pending_payment' | 'issued' | 'revoked'
          verification_url: string
          payment_id?: string | null
        }
        Update: {
          status?: 'pending_payment' | 'issued' | 'revoked'
          payment_id?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          admin_id: string
          learner_id: string
          role: 'super_admin' | 'content_admin' | 'support'
          created_at: string
        }
        Insert: {
          admin_id?: string
          learner_id: string
          role: 'super_admin' | 'content_admin' | 'support'
        }
        Update: {
          role?: 'super_admin' | 'content_admin' | 'support'
        }
        Relationships: []
      }
      config_settings: {
        Row: {
          key: string
          value: string
          description: string
          updated_at: string
        }
        Insert: {
          key: string
          value: string
          description?: string
          updated_at?: string
        }
        Update: {
          value?: string
          description?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          log_id: string
          actor_id: string | null
          actor_type: 'admin' | 'learner' | 'system'
          action: string
          target_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          log_id?: string
          actor_id?: string | null
          actor_type: 'admin' | 'learner' | 'system'
          action: string
          target_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: never
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_learner_stats: {
        Args: { p_learner_id: string }
        Returns: Array<{
          enrolled_count: number
          completed_count: number
          certificate_count: number
          total_watch_seconds: number
        }>
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_certificate: {
        Args: { p_certificate_id: string }
        Returns: Array<{
          certificate_id: string
          learner_name: string
          course_title: string
          issued_at: string
          status: string
        }>
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
""")

# ─────────────────────────────────────────────────────────────────────
# FIX 2: lib/supabase/server.ts
# Root cause: cookiesToSet parameter had implicit 'any' type
# ─────────────────────────────────────────────────────────────────────
write('lib/supabase/server.ts', r"""/**
 * lib/supabase/server.ts
 * Server-side Supabase clients.
 * Use in Server Components, Route Handlers, and middleware only.
 */
import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

type CookieItem = { name: string; value: string; options?: Record<string, unknown> }

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieItem[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cookieStore.set(name, value, options as any)
            })
          } catch {
            // Called from a Server Component — read-only, safe to ignore.
          }
        },
      },
    }
  )
}

/** Admin client — bypasses RLS. Server-side only. Never expose to client. */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  }
  return createSupabaseClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
""")

# ─────────────────────────────────────────────────────────────────────
# FIX 3: middleware.ts
# Root cause: cookiesToSet parameter had implicit 'any' type
# ─────────────────────────────────────────────────────────────────────
write('middleware.ts', r"""/**
 * middleware.ts — Edge route protection for Barada Academy
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieItem = { name: string; value: string; options?: Record<string, unknown> }

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieItem[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            supabaseResponse.cookies.set(name, value, options as any)
          )
        },
      },
    }
  )

  // IMPORTANT: Always use getUser() — validates JWT server-side.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/learn')

  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    if (pathname.startsWith('/') && !pathname.includes('://')) {
      loginUrl.searchParams.set('next', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/learn/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}
""")

# ─────────────────────────────────────────────────────────────────────
# FIX 4: context/AuthContext.tsx
# Root cause: useRef<SupabaseClient<Database>> generic mismatch
# Fix: use ReturnType<typeof createClient> for exact type inference
# ─────────────────────────────────────────────────────────────────────
write('context/AuthContext.tsx', r"""'use client'
/**
 * context/AuthContext.tsx — Global auth state provider
 *
 * Uses ReturnType<typeof createClient> to avoid SupabaseClient generic
 * mismatch introduced in @supabase/supabase-js v2.45+.
 */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { Learner } from '@/types'

type SupabaseClientType = ReturnType<typeof createClient>

interface AuthContextValue {
  user: User | null
  learner: Learner | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
  refreshLearner: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]           = useState<User | null>(null)
  const [learner, setLearner]     = useState<Learner | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Stable ref — one Supabase client for the lifetime of this provider
  const supabaseRef = useRef<SupabaseClientType | null>(null)
  if (!supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current

  const loadLearner = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('learners')
      .select('learner_id, name, email, avatar_url, bio, profession, linkedin_url, status, created_at')
      .eq('learner_id', userId)
      .single()

    if (error) {
      console.warn('[AuthContext] loadLearner:', error.message)
      return
    }

    if (data) {
      setLearner({
        learnerId:   data.learner_id,
        name:        data.name,
        email:       data.email,
        avatarUrl:   data.avatar_url,
        bio:         data.bio,
        profession:  data.profession,
        linkedinUrl: data.linkedin_url,
        status:      data.status,
        createdAt:   data.created_at,
      })
    }
  }, [supabase])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: initialUser } }) => {
      setUser(initialUser)
      if (initialUser) loadLearner(initialUser.id)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadLearner(session.user.id)
        } else {
          setLearner(null)
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, loadLearner])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setLearner(null)
  }, [supabase])

  const refreshLearner = useCallback(async () => {
    if (user) await loadLearner(user.id)
  }, [user, loadLearner])

  return (
    <AuthContext.Provider value={{
      user,
      learner,
      isLoading,
      isAuthenticated: !!user,
      signOut,
      refreshLearner,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth() must be called inside <AuthProvider>.')
  return ctx
}
""")

print('\nAll fixes applied successfully.')
print('Next step: run   npm run type-check')
