import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function CertificatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: learnerRaw } = await supabase
    .from('learners').select('learner_id, first_name, last_name').eq('id', user.id).single()
  const learner = learnerRaw as any

  const { data: certificates } = await supabase
    .from('certificates')
    .select('certificate_id, course_slug, issued_at, certificate_url')
    .eq('learner_id', learner?.learner_id)
    .order('issued_at', { ascending: false })

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#6B7280', fontSize: '0.82rem', textDecoration: 'none' }}>&larr; Dashboard</Link>
        <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#0D183D', fontSize: '1.75rem', marginTop: '0.5rem' }}>My Certificates</h1>
        <p style={{ color: '#6B7280' }}>{certificates?.length || 0} certificate{(certificates?.length || 0) !== 1 ? 's' : ''} earned</p>
      </div>

      {!certificates || certificates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#F9FAFB', borderRadius: 16, border: '1.5px dashed #E5E7EB' }}>
          <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏆</p>
          <p style={{ color: '#374151', fontWeight: 600, marginBottom: '0.5rem' }}>No certificates yet</p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Complete a course and pass the assessment to earn your certificate for &#8377;299.</p>
          <Link href="/academy" style={{ background: '#E31E24', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
            Start Learning
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {(certificates as any[]).map((cert: any) => (
            <div key={cert.certificate_id} style={{ background: 'linear-gradient(135deg, #0D183D, #1a2b5e)', borderRadius: 14, padding: '1.75rem', border: '1px solid rgba(212,175,55,0.3)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>🏆</div>
              <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Certificate of Completion</p>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.375rem' }}>
                {cert.course_slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
                Issued {new Date(cert.issued_at).toLocaleDateString('en-IN')}
              </p>
              {cert.certificate_url && (
                <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', background: '#D4AF37', color: '#0D183D', padding: '0.5rem 1rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.78rem' }}>
                  Download PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
