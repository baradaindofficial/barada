import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface Props {
  children: React.ReactNode
  params: { course: string }
}

/**
 * F002: Server-side enrollment guard for evaluation pages.
 * Unenrolled learners are redirected to the academy page.
 */
export default async function EvaluationLayout({ children, params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('enrollment_id')
    .eq('course_slug', params.course)
    .eq('learner_id', user.id)
    .maybeSingle()

  if (!enrollment) redirect(`/academy`)

  return <>{children}</>
}
