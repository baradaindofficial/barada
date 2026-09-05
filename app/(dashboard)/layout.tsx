import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ThemeProvider } from '@/context/ThemeContext'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { getLearnerFirstName } from '@/lib/utils/learner-display'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard')

  // learners.learner_id is the actual auth-linking column — there is
  // no `id` column on this table (confirmed via schema inspection,
  // Sprint 4.4d Item 3).
  const { data: learnerRaw } = await supabase
    .from('learners')
    .select('*')
    .eq('learner_id', user.id)
    .maybeSingle()
  const learner = learnerRaw as any

  // Header greeting uses first-word only ("Barada"), matching the
  // hero card's existing short-form behavior. Profile shows the full
  // name separately via getLearnerDisplayName().
  const learnerName = getLearnerFirstName(learner)

  return (
    <ThemeProvider>
      <DashboardShell learnerName={learnerName} avatarUrl={learner?.avatar_url ?? null}>
        {children}
      </DashboardShell>
    </ThemeProvider>
  )
}
