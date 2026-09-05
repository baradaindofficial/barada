import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getLearnerDisplayName, getLearnerInitial } from '@/lib/utils/learner-display'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // learners.learner_id is the actual auth-linking column (see
  // app/(dashboard)/layout.tsx for the same fix and full explanation).
  const { data: learnerRaw } = await supabase
    .from('learners').select('*').eq('learner_id', user.id).maybeSingle()
  const learner = learnerRaw as any

  const displayName = getLearnerDisplayName(learner)
  const initial = getLearnerInitial(learner)

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#6B7280', fontSize: '0.82rem', textDecoration: 'none' }}>&larr; Dashboard</Link>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.75rem', marginTop: '0.5rem' }}>My Profile</h1>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1.5px solid #E5E7EB', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 64, height: 64, background: '#D11A1A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'Poppins, sans-serif' }}>
            {initial}
          </div>
          <div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0D183D', fontSize: '1.125rem' }}>
              {displayName}
            </p>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{user.email}</p>
          </div>
        </div>
        {[
          ['Full Name', displayName],
          ['Email', user.email || '\u2014'],
          ['Profession', learner?.profession || '\u2014'],
          ['Member Since', learner?.created_at ? new Date(learner.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '\u2014'],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{label}</span>
            <span style={{ color: '#0D183D', fontWeight: 600, fontSize: '0.875rem' }}>{value}</span>
          </div>
        ))}
      </div>
      <div style={{ background: '#FFF7ED', borderRadius: 12, padding: '1.25rem', border: '1px solid #FED7AA' }}>
        <p style={{ color: '#92400E', fontSize: '0.82rem', fontWeight: 600 }}>
          Profile editing is coming in Sprint 4.5. For changes, email academy@barada.in
        </p>
      </div>
    </div>
  )
}
