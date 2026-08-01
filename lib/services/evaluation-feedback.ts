export interface FeedbackInput {
  courseTitle: string
  score: number
  totalQuestions: number
  passed: boolean
  incorrectTopics: string[]
}

export async function generateEvaluationFeedback(
  input: FeedbackInput
): Promise<string> {
  try {
    const { courseTitle, score, totalQuestions, passed, incorrectTopics } = input
    const correct = Math.round((score / 100) * totalQuestions)

    const prompt = passed
      ? `A professional learner just completed the "${courseTitle}" course evaluation and scored ${score}% (${correct} of ${totalQuestions} correct). They passed. Write 2-3 sentences of warm, specific, motivating feedback acknowledging their achievement and encouraging them to apply what they learned. Be direct and professional.`
      : `A professional learner just completed the "${courseTitle}" course evaluation and scored ${score}% (${correct} of ${totalQuestions} correct). They needed 60% to pass. ${incorrectTopics.length > 0 ? `They struggled with: ${incorrectTopics.join(', ')}.` : ''} Write 2-3 sentences of encouraging, constructive feedback acknowledging their effort, noting where to focus when they retake it, and motivating them to try again. Be warm but honest.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) throw new Error('API error')
    const data = await response.json()
    const text = data?.content?.[0]?.text || ''
    return text.trim()
  } catch {
    // Fallback feedback if API fails
    return input.passed
      ? `Well done on passing the ${input.courseTitle} evaluation with ${input.score}%! Your performance shows a solid grasp of the material. Apply these skills in your work and revisit the course content whenever you need a refresher.`
      : `You scored ${input.score}% on the ${input.courseTitle} evaluation — a solid start. Review the lessons covering the topics you found challenging and retake the evaluation when you are ready. You have unlimited attempts.`
  }
}
