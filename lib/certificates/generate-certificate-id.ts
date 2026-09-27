/**
 * lib/certificates/generate-certificate-id.ts
 * Produces the human-readable certificate id format already established
 * on public.certificates (e.g. "BAC-CGP-2025-00001" per the column comment
 * in 001_initial_schema.sql). "BAC" = Barada Academy Certificate.
 *
 * Naming-convention note: the per-course code is derived from the course
 * slug's word-initials (e.g. "linkedin-profile-optimisation" -> "LPO").
 * This heuristic hasn't had explicit founder/CTO sign-off -- it's a
 * reasonable default, flagged for review since it appears permanently on
 * every issued certificate.
 */
export function courseCodeFromSlug(slug: string): string {
  const code = slug
    .split('-')
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
  return code.slice(0, 6) || 'CRT'
}

export function buildCertificateId(courseSlug: string, sequence: number): string {
  const year = new Date().getFullYear()
  const code = courseCodeFromSlug(courseSlug)
  const seq = String(sequence).padStart(5, '0')
  return `BAC-${code}-${year}-${seq}`
}
