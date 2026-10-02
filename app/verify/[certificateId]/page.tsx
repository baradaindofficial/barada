import Link from 'next/link'
import type { Metadata } from 'next'
import Logo from '@/components/shared/Logo'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Verify Certificate \u2014 Barada Academy',
  description: 'Verify the authenticity of a Barada Academy certificate.',
}

const red = '#D11A1A'
const navy = '#0D183D'
const gold = '#D4AF37'

interface VerifiedCertificate {
  certificate_id: string
  learner_name: string
  course_title: string
  issued_at: string
  status: string
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>
}) {
  const { certificateId } = await params
  const supabase = await createClient()

  // public.verify_certificate is a SECURITY DEFINER function (migration
  // 004_fix_certificate_rls.sql) that returns only safe, non-identifying
  // fields for a specific issued certificate -- no learner_id, no payment
  // data. Granted to the anon role, so this works for an unauthenticated
  // visitor, which is the whole point of a certificate verification page.
  const { data, error } = await (supabase as any)
    .rpc('verify_certificate', { p_certificate_id: certificateId })

  const result = (data as VerifiedCertificate[] | null)?.[0]
  const verified = !error && !!result

  const issuedDate = result
    ? new Date(result.issued_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: 0, minHeight: '100vh', background: '#F9FAFB' }}>
      <nav style={{ background: navy, padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link href="/academy" style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
          <Logo variant="academy" height={40} />
        </Link>
        <Link href="/academy" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.82rem' }}>&larr; Back to Academy</Link>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: red, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Certificate Verification</p>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: navy, margin: 0 }}>
            {verified ? 'Certificate Verified' : 'Certificate Not Found'}
          </h1>
        </div>

        {verified && result ? (
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', borderTop: `4px solid #16a34a`, padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                &#10003; Valid Certificate
              </span>
            </div>
            <dl style={{ margin: 0 }}>
              <dt style={{ fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Issued To</dt>
              <dd style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 700, color: navy, fontFamily: 'Poppins, system-ui, sans-serif' }}>{result.learner_name}</dd>

              <dt style={{ fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Course</dt>
              <dd style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', color: navy }}>{result.course_title}</dd>

              <dt style={{ fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Issued On</dt>
              <dd style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', color: navy }}>{issuedDate}</dd>

              <dt style={{ fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Certificate ID</dt>
              <dd style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontFamily: 'monospace' }}>{result.certificate_id}</dd>
            </dl>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', borderTop: `4px solid #9CA3AF`, padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
              We couldn&apos;t verify a certificate with this ID. It may be entered incorrectly, or the certificate may not have been issued yet. If you believe this is an error,{' '}
              <Link href="/contact" style={{ color: red, fontWeight: 700 }}>contact us</Link>.
            </p>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9CA3AF', marginTop: '2rem' }}>
          <Link href="/academy" style={{ color: gold, fontWeight: 700, textDecoration: 'none' }}>Explore Barada Academy courses &rarr;</Link>
        </p>
      </div>
    </div>
  )
}
