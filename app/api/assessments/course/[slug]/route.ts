import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient()

    const { data: course } = await supabase
      .from('courses')
      .select('course_id, title')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single()
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    const c = course as any

    const { data: assessment } = await supabase
      .from('assessments')
      .select('assessment_id, title, assessment_type, pass_threshold, max_attempts, time_limit_seconds, randomise_questions, randomise_options')
      .eq('course_id', c.course_id)
      .eq('assessment_type', 'final_exam')
      .eq('status', 'published')
      .maybeSingle()
    if (!assessment) return NextResponse.json({ error: 'No evaluation found' }, { status: 404 })
    const a = assessment as any

    const { data: questions } = await supabase
      .from('assessment_questions')
      .select('question_id, question_number, question_type, question_text, hint, points, sort_order, assessment_options(option_id, option_text, sort_order)')
      .eq('assessment_id', a.assessment_id)
      .order('sort_order')
    const qs = (questions || []) as any[]

    // Never expose is_correct to client
    const sanitized = qs.map((q: any) => ({
      questionId: q.question_id,
      questionNumber: q.question_number,
      questionType: q.question_type,
      questionText: q.question_text,
      hint: q.hint,
      points: q.points,
      options: (q.assessment_options || [])
        .sort((x: any, y: any) => x.sort_order - y.sort_order)
        .map((o: any) => ({ optionId: o.option_id, optionText: o.option_text })),
    }))

    return NextResponse.json({
      evaluation: {
        assessmentId: a.assessment_id,
        title: a.title,
        evaluationType: a.assessment_type,
        totalQuestions: qs.length,
        passThreshold: a.pass_threshold,
        timeLimit: a.time_limit_seconds,
      },
      questions: sanitized,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load evaluation' }, { status: 500 })
  }
}
