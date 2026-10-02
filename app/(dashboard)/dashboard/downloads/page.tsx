import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { assetTypeMetadata } from '@/lib/utils/signed-url'

export default async function DownloadsPage() {
  const auth = await getAuthenticatedLearner()
  if (!auth) redirect('/login')

  const supabase = await createClient()
  const { data } = await supabase
    .from('download_history')
    .select('download_id, downloaded_at, assets(asset_id, asset_type, title)')
    .eq('learner_id', auth.learnerId)
    .order('downloaded_at', { ascending: false })
    .limit(50)

  const downloads = (data || []) as any[]

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#6B7280', fontSize: '0.82rem', textDecoration: 'none' }}>&larr; Dashboard</Link>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.75rem', marginTop: '0.5rem' }}>Downloads</h1>
        <p style={{ color: '#6B7280' }}>{downloads.length} recent download{downloads.length !== 1 ? 's' : ''}</p>
      </div>

      {downloads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#F9FAFB', borderRadius: 16, border: '1.5px dashed #E5E7EB' }}>
          <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>📥</p>
          <p style={{ color: '#374151', fontWeight: 600, marginBottom: '0.5rem' }}>No downloads yet</p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Resources you download from lessons will appear here.</p>
          <Link href="/academy" style={{ background: '#E31E24', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {downloads.map((d: any) => {
            const asset = d.assets as any
            const meta = asset ? assetTypeMetadata(asset.asset_type) : { icon: '📁', label: 'Resource' }
            return (
              <div key={d.download_id} style={{ background: '#fff', borderRadius: 12, padding: '1.125rem 1.25rem', border: '1.5px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{meta.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#0D183D', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    {asset?.title || 'Resource'}
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                    {meta.label} &middot; {new Date(d.downloaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
