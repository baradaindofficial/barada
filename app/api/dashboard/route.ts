import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: learnerRaw } = await supabase
      .from('learners')
      .select('learner_id, first_name, last_name, email, profession, avatar_url, created_at')
      .eq('id', user.id)
      .single()

    if (!learnerRaw) return NextResponse.json({ error: 'Learner not found' }, { status: 404 })
    const learner = learnerRaw as any

    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('enrollment_id, course_slug, enrolled_at, completion_percentage, course_id')
      .eq('learner_id', learner.learner_id)
      .order('enrolled_at', { ascending: false })

    const { count: lessonsCompleted } = await supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('learner_id', learner.learner_id)
      .eq('completed', true)

    const { data: certificates } = await supabase
      .from('certificates')
      .select('certificate_id, course_slug, issued_at, certificate_url, course_id')
      .eq('learner_id', learner.learner_id)
      .order('issued_at', { ascending: false })

    const { data: recentProgress } = await supabase
      .from('lesson_progress')
      .select('course_slug, lesson_slug, completed_at')
      .eq('learner_id', learner.learner_id)
      .order('completed_at', { ascending: false })
      .limit(1)

    return NextResponse.json({
      learner,
      stats: {
        enrolledCount: enrollments?.length || 0,
        lessonsCompleted: lessonsCompleted || 0,
        certificateCount: certificates?.length || 0,
      },
      enrollments: enrollments || [],
      certificates: certificates || [],
      recentProgress: recentProgress?.[0] || null,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
