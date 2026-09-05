"""
Adds getRecentActivity() to lib/db/learner-engagement.ts.
Appends to the existing file rather than overwriting it (since it already
has getLearnerStreak/getAchievementCount, which we don't want to touch).

Run from repo root: py step5_add_recent_activity.py
"""

FILE_PATH = "lib/db/learner-engagement.ts"
MARKER = "export async function getAchievementCount"
ALREADY_ADDED_MARKER = "export async function getRecentActivity"

ADDITION = '''

export interface RecentActivityItem {
  lessonId: string
  courseId: string
  lessonTitle: string
  lessonNumber: number | null
  courseSlug: string | null
  courseTitle: string
  status: string
  lastAccessedAt: string
}

export async function getRecentActivity(learnerId: string, limit: number = 5): Promise<RecentActivityItem[]> {
  const supabase = await createClient()
  const { data } = await (supabase as any)
    .from('lesson_progress')
    .select('lesson_id, course_id, status, last_accessed_at, lessons ( title, lesson_number ), courses ( slug, title )')
    .eq('learner_id', learnerId)
    .not('last_accessed_at', 'is', null)
    .order('last_accessed_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map((d: any) => ({
    lessonId: d.lesson_id,
    courseId: d.course_id,
    lessonTitle: d.lessons?.title ?? 'Untitled lesson',
    lessonNumber: d.lessons?.lesson_number ?? null,
    courseSlug: d.courses?.slug ?? null,
    courseTitle: d.courses?.title ?? 'Untitled course',
    status: d.status,
    lastAccessedAt: d.last_accessed_at,
  }))
}
'''

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: Could not find {FILE_PATH}")
        return

    if ALREADY_ADDED_MARKER in content:
        print("Already added -- getRecentActivity exists in this file. No changes made.")
        return

    if MARKER not in content:
        print("WARNING: Could not find expected marker in file. Not modifying.")
        print("Please check the file manually.")
        return

    new_content = content + ADDITION
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"SUCCESS: Appended getRecentActivity() to {FILE_PATH}")

if __name__ == "__main__":
    main()
