/**
 * POST /api/enquiries
 * Saves a business/institute enquiry from /enquire, then emails the Barada
 * team and sends the sender a confirmation. The row is the source of truth:
 * an email failure never loses the enquiry.
 *
 * Abuse controls: honeypot field, zod length limits, and at most 5 enquiries
 * per hashed IP per hour.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'
import { getResendClient, getResendFrom } from '@/lib/email/resend'

export const runtime = 'nodejs'

const SERVICES = ['AI training', 'AI integration', 'AI support', 'Not sure yet'] as const
const NOTIFY_TO = 'info@barada.in'

const trimmed = (max: number) => z.string().trim().max(max)
const Schema = z.object({
  audience: z.enum(['business', 'institute']),
  service: z.enum(SERVICES),
  name: trimmed(120).min(1),
  email: trimmed(200).email(),
  organisation: trimmed(200).min(1),
  phone: trimmed(40).optional().default(''),
  role: trimmed(120).optional().default(''),
  city: trimmed(120).optional().default(''),
  teamSize: trimmed(40).optional().default(''),
  message: trimmed(4000).optional().default(''),
  website: z.string().optional().default(''), // honeypot: real users leave it empty
})

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function POST(request: NextRequest) {
  const parsed = Schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields and try again.' }, { status: 400 })
  }
  const d = parsed.data

  // Honeypot: pretend success so bots learn nothing.
  if (d.website) return NextResponse.json({ ok: true })

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  const ipHash = crypto.createHash('sha256').update(`barada-enquiry:${ip}`).digest('hex')

  const admin = createAdminClient()
  const db = admin as any

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await db
    .from('enquiries')
    .select('enquiry_id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', since)
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: 'Too many enquiries from this connection. Please email info@barada.in.' }, { status: 429 })
  }

  const { data: row, error } = await db
    .from('enquiries')
    .insert({
      audience: d.audience,
      service: d.service,
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      organisation: d.organisation,
      role: d.role || null,
      city: d.city || null,
      team_size: d.teamSize || null,
      message: d.message || null,
      ip_hash: ipHash,
    })
    .select('enquiry_id')
    .single()

  if (error || !row) {
    console.error('[enquiries] insert failed:', error)
    return NextResponse.json({ error: 'We could not save your enquiry. Please email info@barada.in instead.' }, { status: 500 })
  }

  try {
    const resend = getResendClient()
    const from = getResendFrom()
    const lines: [string, string][] = [
      ['Audience', d.audience],
      ['Service', d.service],
      ['Name', d.name],
      ['Email', d.email],
      ['Phone', d.phone],
      ['Organisation', d.organisation],
      ['Role', d.role],
      ['City', d.city],
      ['Team size', d.teamSize],
      ['Message', d.message],
    ]
    const rows = lines
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top"><strong>${k}</strong></td><td style="padding:4px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
      .join('')
    await resend.emails.send({
      from,
      to: NOTIFY_TO,
      replyTo: d.email,
      subject: `New ${d.audience} enquiry: ${d.service} (${d.organisation})`,
      html: `<p>New enquiry from barada.in/enquire.</p><table>${rows}</table><p style="color:#777;font-size:12px">Reference ${row.enquiry_id}. Reply to this email to answer the sender.</p>`,
    })
    await resend.emails.send({
      from,
      to: d.email,
      subject: 'We received your enquiry | Barada',
      html: `<p>Hello ${esc(d.name)},</p><p>Thank you for your enquiry about <strong>${esc(d.service)}</strong>. The Barada team will reply within 2 business days with next steps.</p><p>If anything is urgent, call +91 91132 83848 or reply to this email.</p><p>Barada</p>`,
    })
    await db.from('enquiries').update({ notified: true }).eq('enquiry_id', row.enquiry_id)
  } catch (err) {
    console.error('[enquiries] email failed for', row.enquiry_id, err)
  }

  return NextResponse.json({ ok: true })
}
