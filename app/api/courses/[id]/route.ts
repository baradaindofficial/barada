import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// NOTE: param is named `id` to match the other app/api/courses/[id]/*
// routes (Next.js requires one param name per directory level), but the
// value is still a course SLUG, not a UUID — query logic is unchanged
// from the original app/api/courses/[slug]/route.ts.
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: course, error } = await supabase
      .from('courses')
      .select('*, modules(module_id, module_number, title, description, status, sort_order, lessons(lesson_id, lesson_number, title, description, duration_seconds, is_free_preview, status, sort_order))')
      .eq('slug', params.id)
      .eq('status', 'published')
      .single()

    if (error || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const c = course as any
    const sorted = {
      ...c,
      modules: (c.modules || [])
        .sort((a: any, b: any) => a.module_number - b.module_number)
        .map((m: any) => ({
          ...m,
          lessons: (m.lessons || []).sort((a: any, b: any) => a.lesson_number - b.lesson_number),
        })),
    }

    return NextResponse.json({ course: sorted })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}
