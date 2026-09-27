/**
 * app/api/webhooks/razorpay/route.ts
 * POST /api/webhooks/razorpay
 *
 * Razorpay webhook receiver -- the ONLY place a certificate is actually
 * issued. The client-side checkout redirect is optimistic UI only; this
 * server-to-server callback, gated on a verified HMAC signature, is the
 * sole source of truth for "payment succeeded."
 *
 * Idempotency: guarded twice -- a unique index on certificate_orders
 * (razorpay_payment_id) and another on (webhook_event_id), both partial
 * ("where ... is not null"), per the Sprint 5 schema. A redelivered
 * webhook hits one of those unique constraints and is treated as an
 * already-processed no-op rather than double-issuing a certificate or
 * double-sending the Resend email.
 *
 * Open item: Razorpay's `x-razorpay-event-id` header is used as the
 * idempotency key when present. If a given Razorpay account/API version
 * doesn't send that header, this falls back to a deterministic key derived
 * from the payment id + event type, which is weaker (won't distinguish two
 * *different* legitimate events with the same payment id + type, though
 * that shouldn't occur for payment.captured/payment.failed in practice).
 * Verify header availability against the live Razorpay dashboard before
 * relying on this in production.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/server'
import { checkCertificateEligibility } from '@/lib/services/certificate-eligibility'
import { buildCertificateId } from '@/lib/certificates/generate-certificate-id'
import { generateCertificatePdf } from '@/lib/certificates/generate-pdf'
import { uploadCertificatePdf } from '@/lib/certificates/storage'
import { getResendClient, getResendFrom } from '@/lib/email/resend'

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!verifySignature(rawBody, signature, webhookSecret)) {
    console.error('[razorpay-webhook] Signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const event: string = payload.event
  const paymentEntity = payload.payload?.payment?.entity
  const razorpayOrderId: string | undefined = paymentEntity?.order_id
  const razorpayPaymentId: string | undefined = paymentEntity?.id

  const webhookEventId =
    request.headers.get('x-razorpay-event-id') ||
    (razorpayPaymentId ? `${razorpayPaymentId}:${event}` : null)

  if (!razorpayOrderId) {
    // Nothing we can act on -- acknowledge so Razorpay stops retrying.
    return NextResponse.json({ status: 'ignored' }, { status: 200 })
  }

  const admin = createAdminClient()

  const { data: order, error: orderLookupError } = await admin
    .from('certificate_orders')
    .select('*')
    .eq('razorpay_order_id', razorpayOrderId)
    .single()

  if (orderLookupError || !order) {
    console.error('[razorpay-webhook] No certificate_orders row for order', razorpayOrderId)
    // Acknowledge -- retrying won't make a missing order appear.
    return NextResponse.json({ status: 'order_not_found' }, { status: 200 })
  }

  // Idempotency: if this exact order has already reached a terminal state
  // for this event id, this is a redelivery -- no-op.
  if (
    (order.status === 'paid' || order.status === 'failed' || order.status === 'refunded') &&
    order.webhook_event_id === webhookEventId
  ) {
    return NextResponse.json({ status: 'already_processed' }, { status: 200 })
  }

  if (event === 'payment.failed') {
    await admin
      .from('certificate_orders')
      .update({
        status: 'failed',
        razorpay_payment_id: razorpayPaymentId ?? null,
        webhook_event_id: webhookEventId,
        failure_reason: paymentEntity?.error_description ?? 'Payment failed',
      })
      .eq('order_id', order.order_id)

    return NextResponse.json({ status: 'recorded_failure' }, { status: 200 })
  }

  if (event !== 'payment.captured') {
    // Any other event type (order.paid, refund.*, etc.) -- acknowledge,
    // no action defined yet.
    return NextResponse.json({ status: 'ignored' }, { status: 200 })
  }

  // ── payment.captured: issue the certificate ──────────────────────
  // Fetch learner + course for the snapshot fields certificates requires.
  const { data: learnerRaw } = await admin
    .from('learners')
    .select('learner_id, name, email')
    .eq('learner_id', order.learner_id)
    .single()
  const learner = learnerRaw as any

  const { data: courseRaw } = await admin
    .from('courses' as any)
    .select('slug, title')
    .eq('course_id', order.course_id)
    .single()
  const course = courseRaw as any

  if (!learner || !course) {
    console.error('[razorpay-webhook] Missing learner or course for order', order.order_id)
    await admin
      .from('certificate_orders')
      .update({
        status: 'failed',
        razorpay_payment_id: razorpayPaymentId ?? null,
        webhook_event_id: webhookEventId,
        failure_reason: 'Learner or course record missing at issuance time',
      })
      .eq('order_id', order.order_id)
    return NextResponse.json({ status: 'error' }, { status: 200 })
  }

  // Re-verify eligibility server-side, again, even though payment
  // succeeded -- never trust a webhook payload alone for issuance.
  const eligibility = await checkCertificateEligibility(order.learner_id, course.slug)
  if (!eligibility.eligible) {
    console.error(
      '[razorpay-webhook] Payment captured but learner is no longer eligible:',
      order.order_id,
      eligibility.reason
    )
    await admin
      .from('certificate_orders')
      .update({
        status: 'failed',
        razorpay_payment_id: razorpayPaymentId ?? null,
        webhook_event_id: webhookEventId,
        failure_reason: `Paid but ineligible at issuance: ${eligibility.reason}`,
      })
      .eq('order_id', order.order_id)
    // This needs human follow-up (refund) -- acknowledge to Razorpay but
    // the failure_reason above flags it for reconciliation.
    return NextResponse.json({ status: 'paid_but_ineligible' }, { status: 200 })
  }

  // Certificate id generation, with retry-on-conflict since it's the PK.
  const issuedAt = new Date().toISOString()
  let certificateId = ''
  let insertedCertificate = false
  for (let attempt = 0; attempt < 5 && !insertedCertificate; attempt++) {
    const { count } = await admin
      .from('certificates')
      .select('certificate_id', { count: 'exact', head: true })
    const sequence = (count ?? 0) + 1 + attempt
    certificateId = buildCertificateId(course.slug, sequence)

    const verificationUrl = `${(process.env.NEXT_PUBLIC_APP_URL || 'https://www.barada.in').replace(/\/$/, '')}/verify/${certificateId}`

    const { error: certInsertError } = await admin.from('certificates').insert({
      certificate_id: certificateId,
      learner_id: order.learner_id,
      course_slug: course.slug,
      learner_name: learner.name,
      course_title: course.title,
      issued_at: issuedAt,
      status: 'pending_payment', // flipped to 'issued' once the PDF upload below succeeds
      verification_url: verificationUrl,
      payment_id: razorpayPaymentId ?? null,
    })

    if (!certInsertError) {
      insertedCertificate = true
    } else if (!/duplicate key|unique constraint/i.test(certInsertError.message)) {
      console.error('[razorpay-webhook] certificates insert failed:', certInsertError)
      break
    }
    // else: id collision, loop and try the next sequence number
  }

  if (!insertedCertificate) {
    await admin
      .from('certificate_orders')
      .update({
        status: 'failed',
        razorpay_payment_id: razorpayPaymentId ?? null,
        webhook_event_id: webhookEventId,
        failure_reason: 'Could not allocate a unique certificate_id',
      })
      .eq('order_id', order.order_id)
    return NextResponse.json({ status: 'error' }, { status: 200 })
  }

  // Generate PDF, upload, then flip certificates.status to 'issued'.
  let certificateUrl: string
  try {
    const pdfBuffer = await generateCertificatePdf({
      certificateId,
      learnerName: learner.name,
      courseTitle: course.title,
      issuedAtISO: issuedAt,
    })
    certificateUrl = await uploadCertificatePdf(admin, certificateId, pdfBuffer)
  } catch (err) {
    console.error('[razorpay-webhook] PDF generation/upload failed for', certificateId, err)
    // Certificate row exists but stays at 'pending_payment' -- payment
    // succeeded, so this needs a retry/ops fix, not a refund.
    await admin
      .from('certificate_orders')
      .update({
        status: 'paid',
        razorpay_payment_id: razorpayPaymentId ?? null,
        razorpay_signature: signature,
        webhook_event_id: webhookEventId,
        certificate_id: certificateId,
        paid_at: issuedAt,
        failure_reason: 'Payment captured but PDF generation/upload failed -- needs manual retry',
      })
      .eq('order_id', order.order_id)
    return NextResponse.json({ status: 'error' }, { status: 200 })
  }

  await admin
    .from('certificates')
    .update({ status: 'issued', payment_id: razorpayPaymentId ?? null })
    .eq('certificate_id', certificateId)

  await admin
    .from('certificate_orders')
    .update({
      status: 'paid',
      razorpay_payment_id: razorpayPaymentId ?? null,
      razorpay_signature: signature,
      webhook_event_id: webhookEventId,
      certificate_id: certificateId,
      paid_at: issuedAt,
    })
    .eq('order_id', order.order_id)

  // Best-effort email -- a delivery failure here doesn't roll back the
  // already-issued certificate; the learner can always see it on their
  // dashboard even if the email never arrives.
  try {
    const resend = getResendClient()
    await resend.emails.send({
      from: getResendFrom(),
      to: learner.email,
      subject: `Your certificate for ${course.title} is ready`,
      html: `<p>Congratulations, ${learner.name}!</p><p>Your certificate for <strong>${course.title}</strong> has been issued.</p><p><a href="${certificateUrl}">Download your certificate</a></p>`,
    })
  } catch (err) {
    console.error('[razorpay-webhook] Resend email failed for', certificateId, err)
  }

  return NextResponse.json({ status: 'issued', certificateId }, { status: 200 })
}
