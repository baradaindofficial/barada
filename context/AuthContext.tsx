'use client'
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
