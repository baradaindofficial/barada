import { createClient } from '@/lib/supabase/server'

export interface EligibilityResult {
  eligible: boolean
  evaluationPassed: boolean
  completionPercentage: number
  completionRequired: boolean
  bestScore: number
  attemptsCount: number
  enrolled: boolean
  paymentRequired: boolean
  certificatePricePaise: number
  reason: string
}

/**
 * Server-side certificate eligibility. This is the SINGLE source of truth
 * for "can this learner get a certificate" -- called from both
 * app/api/certificates/create-order/route.ts (before payment) and
 * app/api/webhooks/razorpay/route.ts (again, after payment, before
 * issuance). Payment status is never checked here and never substitutes
 * for eligibility -- the caller decides what to do with payment
 * separately; this function only answers "has this learner actually met
 * the published learning and assessment requirements."
 *
 * Completion is defined by lesson_progress / course_progress
 * (lessons the learner has marked complete, each lesson available as
 * text and, where present, the in-app Read Aloud option) and by a passed
 * assessment. It is NOT defined by whether audio was used -- a learner
 * who only ever reads the text, or only ever uses Read Aloud, is treated
 * identically. (2026-10-03, BK-approved correction -- see
 * "Academy Eligibility Fix" doc for the audit that prompted this.)
 */
export async function checkCertificateEligibility(
  learnerId: string,
  courseSlug: string
): Promise<EligibilityResult> {
  const supabase = await createClient()

  const emptyResult = (overrides: Partial<EligibilityResult>, reason: string): EligibilityResult => ({
    eligible: false,
    evaluationPassed: false,
    completionPercentage: 0,
    completionRequired: true,
    bestScore: 0,
    attemptsCount: 0,
    enrolled: false,
    paymentRequired: true,
    certificatePricePaise: 29900,
    reason,
    ...overrides,
  })

  // Check enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('enrollment_id')
    .eq('learner_id', learnerId)
    .eq('course_slug', courseSlug)
    .maybeSingle()

  if (!enrollment) {
    return emptyResult({}, 'You must be enrolled in this course to earn a certificate.')
  }

  // Get course -- also carries the containment flag from migration
  // 012_course_enrollment_pause.sql. A learner who enrolled BEFORE the
  // pause keeps their enrollment and lesson access, but a NEW certificate
  // purchase is still blocked while the course is paused, same as a new
  // enrolment would be.
  const { data: course } = await supabase
    .from('courses' as any)
    .select('course_id, cert_price_paise, enrollment_paused, enrollment_paused_reason')
    .eq('slug', courseSlug)
    .single()
  const c = course as any

  if (c?.enrollment_paused) {
    return emptyResult(
      { enrolled: true, certificatePricePaise: c?.cert_price_paise || 29900 },
      c.enrollment_paused_reason || 'Content being completed — new enrolments and certificate purchases are temporarily paused for this course.'
    )
  }

  // Get this learner's course-level completion (computed server-side in
  // app/api/lessons/[id]/complete/route.ts from actual lesson_progress
  // rows -- never trust a client-supplied percentage).
  const { data: progress } = await supabase
    .from('course_progress' as any)
    .select('completion_percentage')
    .eq('learner_id', learnerId)
    .eq('course_id', c?.course_id)
    .maybeSingle()
  const completionPercentage = (progress as any)?.completion_percentage ?? 0
  const completionMet = completionPercentage >= 100

  // Get course assessment
  const { data: assessment } = await supabase
    .from('assessments')
    .select('assessment_id, pass_threshold')
    .eq('course_id', c?.course_id)
    .eq('assessment_type', 'final_exam')
    .eq('status', 'published')
    .maybeSingle()
  const a = assessment as any

  if (!a) {
    return emptyResult(
      { enrolled: true, completionPercentage, certificatePricePaise: c?.cert_price_paise || 29900 },
      'No evaluation available for this course yet.'
    )
  }

  // Get all attempts for this learner and assessment
  const { data: attempts } = await supabase
    .from('assessment_attempts')
    .select('score, passed, attempt_number')
    .eq('learner_id', learnerId)
    .eq('assessment_id', a.assessment_id)
    .eq('status', 'graded')
    .order('score', { ascending: false })

  const att = (attempts || []) as any[]
  const bestScore = att.length > 0 ? att[0].score : 0
  const evaluationPassed = att.some((attempt: any) => attempt.passed === true)
  const attemptsCount = att.length

  if (!completionMet) {
    return {
      eligible: false,
      evaluationPassed,
      completionPercentage,
      completionRequired: true,
      bestScore,
      attemptsCount,
      enrolled: true,
      paymentRequired: true,
      certificatePricePaise: c?.cert_price_paise || 29900,
      reason: `Complete all lessons to earn your certificate. You've completed ${Math.round(completionPercentage)}% of this course so far.`,
    }
  }

  if (!evaluationPassed) {
    return {
      eligible: false,
      evaluationPassed: false,
      completionPercentage,
      completionRequired: true,
      bestScore,
      attemptsCount,
      enrolled: true,
      paymentRequired: true,
      certificatePricePaise: c?.cert_price_paise || 29900,
      reason: attemptsCount === 0
        ? 'Complete the course evaluation to earn your certificate.'
        : `Your best score is ${bestScore}%. You need ${a.pass_threshold}% to pass. Try again.`,
    }
  }

  return {
    eligible: true,
    evaluationPassed: true,
    completionPercentage,
    completionRequired: true,
    bestScore,
    attemptsCount,
    enrolled: true,
    paymentRequired: true,
    certificatePricePaise: c?.cert_price_paise || 29900,
    reason: `You completed the course and passed with ${bestScore}%. Your certificate is ready for ₹${Math.round((c?.cert_price_paise || 29900) / 100)}.`,
  }
}
