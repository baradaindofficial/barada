import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: courses, error } = await supabase
      .from('courses')
      .select('course_id, slug, title, subtitle, category, difficulty, icon, theme_color, is_free, cert_price_paise, sort_order, estimated_hours, outcomes, target_audience')
      .eq('status', 'published')
      .order('sort_order')

    if (error) throw error

    const enriched = await Promise.all(
      (courses || []).map(async (course: any) => {
        const { count: moduleCount } = await supabase
          .from('modules')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', course.course_id)
          .eq('status', 'published')

        const { count: lessonCount } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', course.course_id)
          .eq('status', 'published')

        return { ...course, moduleCount: moduleCount || 0, lessonCount: lessonCount || 0 }
      })
    )

    return NextResponse.json({ courses: enriched })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
