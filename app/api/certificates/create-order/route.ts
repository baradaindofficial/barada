/**
 * app/api/certificates/create-order/route.ts
 * POST /api/certificates/create-order
 * Body: { courseSlug: string }
 *
 * Creates a Razorpay order for a certificate purchase. Re-verifies
 * eligibility server-side (never trusts client state) and writes a
 * `created` row to certificate_orders before returning the order details
 * to the client for the Razorpay Checkout widget. This route never issues
 * a certificate -- only the signature-verified webhook does that.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { checkCertificateEligibility } from '@/lib/services/certificate-eligibility'
import { getRazorpayClient } from '@/lib/payments/razorpay'

const CreateOrderSchema = z.object({ courseSlug: z.string().min(1).max(100) })

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const parsed = CreateOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  const { courseSlug } = parsed.data

  // Server-side eligibility check -- the client is never trusted for this.
  const eligibility = await checkCertificateEligibility(user.id, courseSlug)
  if (!eligibility.eligible) {
    return NextResponse.json({ error: eligibility.reason }, { status: 403 })
  }

  // certificate_orders references courses(course_id) (a hard FK, per the
  // Sprint 5 schema decision), so resolve it here. courses isn't yet in
  // types/database.ts (same gap certificate-eligibility.ts already has) --
  // cast, matching that existing pattern.
  const { data: courseRaw, error: courseError } = await supabase
    .from('courses' as any)
    .select('course_id, title')
    .eq('slug', courseSlug)
    .single()

  if (courseError || !courseRaw) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }
  const course = courseRaw as any

  let razorpayOrder
  try {
    const razorpay = getRazorpayClient()
    razorpayOrder = await razorpay.orders.create({
      amount: eligibility.certificatePricePaise,
      currency: 'INR',
      receipt: `cert_${courseSlug}_${user.id}`.slice(0, 40),
      notes: { learner_id: user.id, course_slug: courseSlug },
    })
  } catch (err) {
    console.error('[create-order] Razorpay order creation failed:', err)
    return NextResponse.json(
      { error: 'Payment provider is unavailable. Please try again.' },
      { status: 502 }
    )
  }

  // Writes to certificate_orders happen only via the service role --
  // there is no client insert policy on this table (see 010_certificate_orders.sql).
  const admin = createAdminClient()
  const { data: orderRow, error: insertError } = await admin
    .from('certificate_orders')
    .insert({
      learner_id: user.id,
      course_id: course.course_id,
      razorpay_order_id: razorpayOrder.id,
      amount_paise: eligibility.certificatePricePaise,
      currency: 'INR',
      status: 'created',
    })
    .select('order_id')
    .single()

  if (insertError || !orderRow) {
    console.error('[create-order] Failed to record certificate_orders row:', insertError)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }

  return NextResponse.json(
    {
      orderId: orderRow.order_id,
      razorpayOrderId: razorpayOrder.id,
      amount: eligibility.certificatePricePaise,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      courseTitle: course.title,
    },
    { status: 201 }
  )
}
