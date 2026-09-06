"""
Creates app/admin/layout.tsx -- gates the entire /admin section using the
existing is_admin() Postgres function (checks admin_users table via
auth.uid()). Anyone not in admin_users gets redirected to /dashboard.

Run from repo root: py step13_add_admin_layout.py
"""
import os

FILE_PATH = "app/admin/layout.tsx"

CONTENT = """import { redirect } from 'next/navigation'
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
"""

def main():
    if os.path.exists(FILE_PATH):
        print(f"WARNING: {FILE_PATH} already exists. Not overwriting.")
        return
    os.makedirs(os.path.dirname(FILE_PATH), exist_ok=True)
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(CONTENT)
    print(f"SUCCESS: Created {FILE_PATH}")

if __name__ == "__main__":
    main()
