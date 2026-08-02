export interface FeedbackInput {
  courseTitle: string
  score: number
  totalQuestions: number
  passed: boolean
  incorrectTopics: string[]
}

const FALLBACK_PASS = (title: string, score: number) =>
  `Well done on passing the ${title} evaluation with ${score}%. Your performance shows a solid grasp of the material. Apply these skills in your work and revisit the course content whenever you need a refresher.`

const FALLBACK_FAIL = (title: string, score: number) =>
  `You scored ${score}% on the ${title} evaluation — a solid attempt. Review the lessons covering the topics you found challenging and retake the evaluation when you feel ready. You have unlimited attempts.`

/**
 * Generates AI personalised feedback for an evaluation result.
 * Enforces a 6-second timeout. Always returns a string — never throws.
 */
export async function generateEvaluationFeedback(
  input: FeedbackInput
): Promise<string> {
  const { courseTitle, score, totalQuestions, passed, incorrectTopics } = input
  const correct = Math.round((score / 100) * totalQuestions)

  const prompt = passed
    ? `A professional just completed the "${courseTitle}" course evaluation and scored ${score}% (${correct} of ${totalQuestions} correct). They passed. Write 2-3 sentences of warm, specific, motivating feedback. Be direct and professional. No preamble.`
    : `A professional just completed the "${courseTitle}" course evaluation and scored ${score}% (${correct} of ${totalQuestions} correct). They needed 60% to pass.${incorrectTopics.length > 0 ? ` They struggled with: ${incorrectTopics.slice(0, 3).join(', ')}.` : ''} Write 2-3 sentences of encouraging, constructive feedback noting where to focus. Be warm but honest. No preamble.`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    clearTimeout(timeoutId)
    if (!response.ok) throw new Error(`API ${response.status}`)
    const data = await response.json()
    const text = data?.content?.[0]?.text?.trim() || ''
    return text || (passed ? FALLBACK_PASS(courseTitle, score) : FALLBACK_FAIL(courseTitle, score))
  } catch {
    return passed ? FALLBACK_PASS(courseTitle, score) : FALLBACK_FAIL(courseTitle, score)
  }
}
