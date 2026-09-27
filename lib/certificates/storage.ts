/**
 * lib/certificates/storage.ts
 * Uploads issued certificate PDFs to Supabase Storage.
 *
 * Bucket-visibility decision (flagged for CTO confirmation): PUBLIC bucket.
 * Certificates are designed to be shared and publicly verified (LinkedIn
 * share, /verify/[id] is already a public route via verify_certificate()),
 * so a public bucket avoids managing signed-URL expiry over a credential's
 * indefinite lifetime and matches the certificates dashboard page's
 * existing direct-href usage of certificate_url. If a private bucket is
 * preferred instead, this is the one place to change.
 */
import type { SupabaseClient } from '@supabase/supabase-js'

const BUCKET = 'certificates'

async function ensureBucketExists(admin: SupabaseClient): Promise<void> {
  const { data: existing } = await admin.storage.getBucket(BUCKET)
  if (existing) return

  const { error } = await admin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: '5MB',
    allowedMimeTypes: ['application/pdf'],
  })
  // Ignore "already exists" races from concurrent webhook deliveries.
  if (error && !/already exists/i.test(error.message)) {
    throw error
  }
}

export async function uploadCertificatePdf(
  admin: SupabaseClient,
  certificateId: string,
  pdfBuffer: Buffer
): Promise<string> {
  await ensureBucketExists(admin)

  const path = `${certificateId}.pdf`
  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
