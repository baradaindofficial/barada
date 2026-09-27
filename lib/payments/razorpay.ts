/**
 * lib/payments/razorpay.ts
 * Server-side Razorpay client singleton. Never import from client components
 * -- this reads RAZORPAY_KEY_SECRET, which must never reach the browser.
 */
import Razorpay from 'razorpay'

let client: Razorpay | null = null

export function getRazorpayClient(): Razorpay {
  if (client) return client

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error(
      'Razorpay is not configured: missing NEXT_PUBLIC_RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET.'
    )
  }

  client = new Razorpay({ key_id: keyId, key_secret: keySecret })
  return client
}
