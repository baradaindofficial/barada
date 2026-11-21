/**
 * POST /api/certificates/claim
 * Body: { courseSlug: string }
 *
 * Issues a certificate without payment while CERTIFICATES_FREE is on.
 * Eligibility is re-verified server-side (same single source as the paid
 * flow). Idempotent: a learner who already holds a certificate for the
 * course gets the existing one back.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { checkCertificateEligibility } from '@/lib/services/certificate-eligibility'
import { buildCertificateId } from '@/lib/certificates/generate-certificate-id'
import { generateCertificatePdf } from '@/lib/certificates/generate-pdf'
import { uploadCertificatePdf } from '@/lib/certificates/storage'
import { getResendClient, getResendFrom } from '@/lib/email/resend'
import { CERTIFICATES_FREE } from '@/lib/certificates/config'

export const runtime = 'nodejs'

const Schema = z.object({ courseSlug: z.string().min(1).max(100) })

export async function POST(request: NextRequest) {
  if (!CERTIFICATES_FREE) {
    return NextResponse.json({ error: 'Certificates are not free at the moment.' }, { status: 403 })
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = Schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  const { courseSlug } = parsed.data

  const eligibility = await checkCertificateEligibility(user.id, courseSlug)
  if (!eligibility.eligible) return NextResponse.json({ error: eligibility.reason }, { status: 403 })

  const admin = createAdminClient()

  // Idempotency: return an existing issued certificate.
  const { data: existingRaw } = await admin
    .from('certificates')
    .select('certificate_id, status, certificate_url')
    .eq('learner_id', user.id)
    .eq('course_slug', courseSlug)
    .maybeSingle()
  const existing = existingRaw as any
  if (existing?.status === 'issued' && existing.certificate_url) {
    return NextResponse.json({ certificateId: existing.certificate_id, certificateUrl: existing.certificate_url, existing: true })
  }

  const { data: learnerRaw } = await admin.from('learners').select('learner_id, name, email').eq('learner_id', user.id).single()
  const { data: courseRaw } = await admin.from('courses' as any).select('slug, title').eq('slug', courseSlug).single()
  const learner = learnerRaw as any
  const course = courseRaw as any
  if (!learner || !course) return NextResponse.json({ error: 'Course or learner not found' }, { status: 404 })

  const issuedAt = new Date().toISOString()
  let certificateId: string = existing?.certificate_id ?? ''

  if (!certificateId) {
    let inserted = false
    for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
      const { count } = await admin.from('certificates').select('certificate_id', { count: 'exact', head: true })
      certificateId = buildCertificateId(course.slug, (count ?? 0) + 1 + attempt)
      const { error } = await admin.from('certificates').insert({
        certificate_id: certificateId,
        learner_id: user.id,
        course_slug: course.slug,
        learner_name: learner.name,
        course_title: course.title,
        issued_at: issuedAt,
        status: 'pending_payment', // flipped to 'issued' once the PDF is stored
        verification_url: `https://www.barada.in/verify/${certificateId}`,
        payment_id: null,
      })
      if (!error) inserted = true
      else if (/learner_id.*course_slug|course_slug/i.test(error.message) && /duplicate|unique/i.test(error.message)) {
        // Lost a race with a parallel claim: reuse that row.
        const { data: row } = await admin.from('certificates').select('certificate_id').eq('learner_id', user.id).eq('course_slug', courseSlug).maybeSingle()
        if (row) { certificateId = (row as any).certificate_id; inserted = true }
      } else if (!/duplicate key|unique constraint/i.test(error.message)) {
        console.error('[claim] certificates insert failed:', error)
        break
      }
    }
    if (!inserted) return NextResponse.json({ error: 'Could not create your certificate. Please try again.' }, { status: 500 })
  }

  let certificateUrl: string
  try {
    const pdf = await generateCertificatePdf({ certificateId, learnerName: learner.name, courseTitle: course.title, issuedAtISO: issuedAt })
    certificateUrl = await uploadCertificatePdf(admin, certificateId, pdf)
  } catch (err) {
    console.error('[claim] PDF generation/upload failed for', certificateId, err)
    return NextResponse.json({ error: 'We could not generate the PDF just now. Please try again in a minute.' }, { status: 502 })
  }

  await admin.from('certificates').update({ status: 'issued' }).eq('certificate_id', certificateId)

  try {
    await getResendClient().emails.send({
      from: getResendFrom(),
      to: learner.email,
      subject: `Your certificate for ${course.title} is ready`,
      html: `<p>Congratulations, ${learner.name}!</p><p>Your certificate for <strong>${course.title}</strong> has been issued.</p><p><a href="${certificateUrl}">Download your certificate</a></p>`,
    })
  } catch (err) {
    console.error('[claim] Resend email failed for', certificateId, err)
  }

  return NextResponse.json({ certificateId, certificateUrl }, { status: 201 })
}
