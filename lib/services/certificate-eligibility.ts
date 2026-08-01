import { createClient } from '@/lib/supabase/server'

export interface EligibilityResult {
  eligible: boolean
  evaluationPassed: boolean
  bestScore: number
  attemptsCount: number
  enrolled: boolean
  paymentRequired: boolean
  certificatePricePaise: number
  reason: string
}

export async function checkCertificateEligibility(
  learnerId: string,
  courseSlug: string
): Promise<EligibilityResult> {
  const supabase = await createClient()

  // Check enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('enrollment_id')
    .eq('learner_id', learnerId)
    .eq('course_slug', courseSlug)
    .maybeSingle()

  if (!enrollment) {
    return {
      eligible: false,
      evaluationPassed: false,
      bestScore: 0,
      attemptsCount: 0,
      enrolled: false,
      paymentRequired: true,
      certificatePricePaise: 29900,
      reason: 'You must be enrolled in this course to earn a certificate.',
    }
  }

  // Get course assessment
  const { data: course } = await supabase
    .from('courses')
    .select('course_id, cert_price_paise')
    .eq('slug', courseSlug)
    .single()
  const c = course as any

  const { data: assessment } = await supabase
    .from('assessments')
    .select('assessment_id, pass_threshold')
    .eq('course_id', c?.course_id)
    .eq('assessment_type', 'final_exam')
    .eq('status', 'published')
    .maybeSingle()
  const a = assessment as any

  if (!a) {
    return {
      eligible: false,
      evaluationPassed: false,
      bestScore: 0,
      attemptsCount: 0,
      enrolled: true,
      paymentRequired: true,
      certificatePricePaise: c?.cert_price_paise || 29900,
      reason: 'No evaluation available for this course yet.',
    }
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

  if (!evaluationPassed) {
    return {
      eligible: false,
      evaluationPassed: false,
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
    bestScore,
    attemptsCount,
    enrolled: true,
    paymentRequired: true,
    certificatePricePaise: c?.cert_price_paise || 29900,
    reason: `You passed with ${bestScore}%. Your certificate is ready for \u20b9${Math.round((c?.cert_price_paise || 29900) / 100)}.`,
  }
}
