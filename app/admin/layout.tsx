import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/admin/analytics')

  const { data: isAdmin, error } = await (supabase as any).rpc('is_admin')
  if (error) {
    console.error('[admin/layout] is_admin check failed:', error.message)
    redirect('/dashboard')
  }
  if (!isAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0D183D] text-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display font-bold">Barada Admin</span>
            <Link href="/admin/analytics" className="text-sm text-white/70 hover:text-white">Analytics</Link>
          </div>
          <Link href="/dashboard" className="text-sm text-white/70 hover:text-white">&larr; Back to learner view</Link>
        </div>
      </header>
      {children}
    </div>
  )
}
