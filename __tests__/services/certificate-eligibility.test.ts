/**
 * Real unit tests for checkCertificateEligibility() -- calls the actual
 * function (lib/services/certificate-eligibility.ts) against a mocked
 * Supabase client built per-table from fixtures, so no live database or
 * service-role credential is needed. Written 2026-10-03 to replace a
 * prior version of this file that only asserted hand-written literal
 * objects matched themselves and never called the real function --
 * that file gave false confidence and tested nothing about actual
 * behaviour, which is itself a finding worth recording here.
 *
 * Run with: npx jest __tests__/services/certificate-eligibility.test.ts
 */
import { checkCertificateEligibility } from '@/lib/services/certificate-eligibility'

type Fixtures = {
  enrollment?: any
  course?: any
  courseProgress?: any
  assessment?: any
  attempts?: any[]
}

function buildMockSupabase(fx: Fixtures) {
  const tableHandlers: Record<string, any> = {
    enrollments: {
      maybeSingle: async () => ({ data: fx.enrollment ?? null, error: null }),
    },
    courses: {
      single: async () => ({ data: fx.course ?? null, error: null }),
    },
    course_progress: {
      maybeSingle: async () => ({ data: fx.courseProgress ?? null, error: null }),
    },
    assessments: {
      maybeSingle: async () => ({ data: fx.assessment ?? null, error: null }),
    },
    assessment_attempts: {
      order: async () => ({ data: fx.attempts ?? [], error: null }),
    },
  }

  function chain(table: string) {
    const handler = tableHandlers[table] || {}
    const builder: any = {}
    ;['select', 'eq', 'order'].forEach((m) => {
      builder[m] = (...args: any[]) => {
        if (m === 'order' && handler.order) return handler.order()
        return builder
      }
    })
    builder.maybeSingle = handler.maybeSingle || (async () => ({ data: null, error: null }))
    builder.single = handler.single || (async () => ({ data: null, error: null }))
    return builder
  }

  return {
    from: (table: string) => chain(table),
  }
}

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

import { createClient } from '@/lib/supabase/server'

function mockWith(fx: Fixtures) {
  ;(createClient as jest.Mock).mockResolvedValue(buildMockSupabase(fx))
}

const BASE_COURSE = { course_id: 'course-1', cert_price_paise: 29900, enrollment_paused: false, enrollment_paused_reason: null }
const BASE_ASSESSMENT = { assessment_id: 'assess-1', pass_threshold: 60 }

describe('checkCertificateEligibility', () => {
  it('is ineligible when not enrolled', async () => {
    mockWith({ enrollment: null, course: BASE_COURSE })
    const r = await checkCertificateEligibility('learner-1', 'some-course')
    expect(r.eligible).toBe(false)
    expect(r.enrolled).toBe(false)
    expect(r.reason).toMatch(/enrolled/i)
  })

  it('is ineligible when the course is enrollment_paused, even if everything else passes', async () => {
    mockWith({
      enrollment: { enrollment_id: 'e1' },
      course: { ...BASE_COURSE, enrollment_paused: true, enrollment_paused_reason: 'Content being completed — new enrolments temporarily paused.' },
      courseProgress: { completion_percentage: 100 },
      assessment: BASE_ASSESSMENT,
      attempts: [{ score: 90, passed: true, attempt_number: 1 }],
    })
    const r = await checkCertificateEligibility('learner-1', 'paused-course')
    expect(r.eligible).toBe(false)
    expect(r.reason).toMatch(/temporarily paused/i)
  })

  it('is ineligible when lesson completion is below 100%, even with a passed exam', async () => {
    mockWith({
      enrollment: { enrollment_id: 'e1' },
      course: BASE_COURSE,
      courseProgress: { completion_percentage: 62 },
      assessment: BASE_ASSESSMENT,
      attempts: [{ score: 90, passed: true, attempt_number: 1 }],
    })
    const r = await checkCertificateEligibility('learner-1', 'incomplete-course')
    expect(r.eligible).toBe(false)
    expect(r.completionPercentage).toBe(62)
    expect(r.reason).toMatch(/complete all lessons/i)
  })

  it('is ineligible when the exam has not been passed, even at 100% completion', async () => {
    mockWith({
      enrollment: { enrollment_id: 'e1' },
      course: BASE_COURSE,
      courseProgress: { completion_percentage: 100 },
      assessment: BASE_ASSESSMENT,
      attempts: [{ score: 40, passed: false, attempt_number: 1 }],
    })
    const r = await checkCertificateEligibility('learner-1', 'failed-exam-course')
    expect(r.eligible).toBe(false)
    expect(r.evaluationPassed).toBe(false)
    expect(r.bestScore).toBe(40)
    expect(r.reason).toMatch(/60%/)
  })

  it('is ineligible with zero attempts and a distinct message from a failed attempt', async () => {
    mockWith({
      enrollment: { enrollment_id: 'e1' },
      course: BASE_COURSE,
      courseProgress: { completion_percentage: 100 },
      assessment: BASE_ASSESSMENT,
      attempts: [],
    })
    const r = await checkCertificateEligibility('learner-1', 'no-attempt-course')
    expect(r.eligible).toBe(false)
    expect(r.attemptsCount).toBe(0)
    expect(r.reason).toMatch(/complete the course evaluation/i)
  })

  it('is eligible only when completion is 100% AND the exam is passed AND the course is not paused', async () => {
    mockWith({
      enrollment: { enrollment_id: 'e1' },
      course: BASE_COURSE,
      courseProgress: { completion_percentage: 100 },
      assessment: BASE_ASSESSMENT,
      // Fixture is pre-sorted best-score-first, matching what the real
      // .order('score', { ascending: false }) query returns from Postgres --
      // this mock doesn't re-sort, so the fixture order IS the contract here.
      attempts: [
        { score: 90, passed: true, attempt_number: 2 },
        { score: 40, passed: false, attempt_number: 1 },
      ],
    })
    const r = await checkCertificateEligibility('learner-1', 'legit-pass-course')
    expect(r.eligible).toBe(true)
    expect(r.bestScore).toBe(90)
    expect(r.completionPercentage).toBe(100)
  })

  it('is ineligible when no published final_exam assessment exists for the course', async () => {
    mockWith({
      enrollment: { enrollment_id: 'e1' },
      course: BASE_COURSE,
      courseProgress: { completion_percentage: 100 },
      assessment: null,
    })
    const r = await checkCertificateEligibility('learner-1', 'no-exam-course')
    expect(r.eligible).toBe(false)
    expect(r.reason).toMatch(/no evaluation available/i)
  })

  it('treats a null completion_percentage (no course_progress row yet) as 0%, not eligible', async () => {
    mockWith({
      enrollment: { enrollment_id: 'e1' },
      course: BASE_COURSE,
      courseProgress: null,
      assessment: BASE_ASSESSMENT,
      attempts: [{ score: 90, passed: true, attempt_number: 1 }],
    })
    const r = await checkCertificateEligibility('learner-1', 'never-started-course')
    expect(r.eligible).toBe(false)
    expect(r.completionPercentage).toBe(0)
  })
})
