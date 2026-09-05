"""
fix_courses_route_slug_conflict.py
Barada Digital Platform — dev server startup fix

Next.js requires all dynamic segments at the same directory level to use
the same parameter name. Sprint 4.4c created app/api/courses/[id]/... as
a sibling of the pre-existing app/api/courses/[slug]/route.ts, which
crashes the dev server on startup ("You cannot use different slug names
for the same dynamic path ('id' !== 'slug')").

Fix: move the [slug] route into [id], renaming only the Next.js param key.
The URL path is unaffected (still /api/courses/<value>) — only the
internal parameter name changes, and the query logic (look up by slug
value) is unchanged.

Run from repo root: py fix_courses_route_slug_conflict.py
"""
import os
import shutil

OLD_DIR = os.path.join("app", "api", "courses", "[slug]")
OLD_FILE = os.path.join(OLD_DIR, "route.ts")
NEW_FILE = os.path.join("app", "api", "courses", "[id]", "route.ts")

NEW_CONTENT = r"""import { NextResponse } from 'next/server'
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
"""

def main():
    if not os.path.exists(OLD_FILE):
        print(f"  NOT FOUND: {OLD_FILE} — nothing to move, check manually")
        return

    os.makedirs(os.path.dirname(NEW_FILE), exist_ok=True)
    with open(NEW_FILE, "w", encoding="utf-8") as f:
        f.write(NEW_CONTENT)
    print(f"  Wrote: {NEW_FILE}")

    os.remove(OLD_FILE)
    print(f"  Deleted: {OLD_FILE}")

    # Remove the now-empty [slug] directory if nothing else is in it
    try:
        if os.path.isdir(OLD_DIR) and not os.listdir(OLD_DIR):
            os.rmdir(OLD_DIR)
            print(f"  Removed empty directory: {OLD_DIR}")
        elif os.path.isdir(OLD_DIR):
            print(f"  NOTE: {OLD_DIR} still has other files — left in place, check manually")
    except OSError as e:
        print(f"  Could not remove {OLD_DIR}: {e}")

    print("\nDone.")
    print("Next: npm run dev  (should now start clean)")

if __name__ == "__main__":
    main()
