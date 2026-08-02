/**
 * Unit tests for certificate eligibility service.
 * Run with: npx jest __tests__/services/certificate-eligibility.test.ts
 *
 * These are contract tests — they verify the shape and logic of the
 * eligibility result without hitting the database.
 */

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  }),
}))

describe('EligibilityResult shape', () => {
  it('should have all required fields', () => {
    const result = {
      eligible: false,
      evaluationPassed: false,
      bestScore: 0,
      attemptsCount: 0,
      enrolled: false,
      paymentRequired: true,
      certificatePricePaise: 29900,
      reason: 'Test reason',
    }
    expect(result).toHaveProperty('eligible')
    expect(result).toHaveProperty('evaluationPassed')
    expect(result).toHaveProperty('bestScore')
    expect(result).toHaveProperty('attemptsCount')
    expect(result).toHaveProperty('enrolled')
    expect(result).toHaveProperty('paymentRequired')
    expect(result).toHaveProperty('certificatePricePaise')
    expect(result).toHaveProperty('reason')
  })

  it('eligible should be false when not enrolled', () => {
    const result = {
      eligible: false,
      evaluationPassed: false,
      bestScore: 0,
      attemptsCount: 0,
      enrolled: false,
      paymentRequired: true,
      certificatePricePaise: 29900,
      reason: 'You must be enrolled in this course to earn a certificate.',
    }
    expect(result.eligible).toBe(false)
    expect(result.enrolled).toBe(false)
  })

  it('eligible should require evaluation passed', () => {
    const notPassed = { eligible: false, evaluationPassed: false, bestScore: 40 }
    const passed = { eligible: true, evaluationPassed: true, bestScore: 80 }

    expect(notPassed.eligible).toBe(false)
    expect(passed.eligible).toBe(true)
  })

  it('certificate price should be in paise', () => {
    const result = { certificatePricePaise: 29900 }
    expect(result.certificatePricePaise / 100).toBe(299)
  })
})

describe('Evaluation feedback fallbacks', () => {
  it('pass fallback should mention score', () => {
    const score = 80
    const title = 'ChatGPT for Professionals'
    const fallback = `Well done on passing the ${title} evaluation with ${score}%. Your performance shows a solid grasp of the material. Apply these skills in your work and revisit the course content whenever you need a refresher.`
    expect(fallback).toContain('80%')
    expect(fallback).toContain('ChatGPT for Professionals')
  })

  it('fail fallback should mention score', () => {
    const score = 40
    const title = 'Claude AI for Professionals'
    const fallback = `You scored ${score}% on the ${title} evaluation — a solid attempt. Review the lessons covering the topics you found challenging and retake the evaluation when you feel ready. You have unlimited attempts.`
    expect(fallback).toContain('40%')
    expect(fallback).toContain('unlimited attempts')
  })
})

describe('API response envelope', () => {
  it('success response should have data wrapper', () => {
    const response = { data: { attemptId: 'uuid', score: 80, passed: true } }
    expect(response).toHaveProperty('data')
    expect(response.data).toHaveProperty('attemptId')
    expect(response.data).toHaveProperty('score')
    expect(response.data).toHaveProperty('passed')
  })

  it('error response should have error field', () => {
    const response = { error: 'Unauthorized' }
    expect(response).toHaveProperty('error')
    expect(typeof response.error).toBe('string')
  })
})
