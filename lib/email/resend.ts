/**
 * lib/email/resend.ts
 * Server-side Resend client singleton. Never import from client components.
 */
import { Resend } from 'resend'

let client: Resend | null = null

export function getResendClient(): Resend {
  if (client) return client

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('Resend is not configured: missing RESEND_API_KEY.')
  }

  client = new Resend(apiKey)
  return client
}

/** "Name <email>" sender string, or bare email if no name is configured. */
export function getResendFrom(): string {
  const email = process.env.RESEND_FROM_EMAIL
  const name = process.env.RESEND_FROM_NAME
  if (!email) {
    throw new Error('Resend is not configured: missing RESEND_FROM_EMAIL.')
  }
  return name ? `${name} <${email}>` : email
}
