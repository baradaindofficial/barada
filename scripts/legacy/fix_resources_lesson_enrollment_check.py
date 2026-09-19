"""
fix_resources_lesson_enrollment_check.py
Barada Digital Platform — ADR-008 health check follow-up (P2)

app/api/resources/lesson/[lessonId]/route.ts compared course_slug (text)
to lesson.course_id (uuid) in an OR clause — a condition that can never
match, working today only because the other half of the OR happens to
catch it. Simplifying to the correct, single condition.

Run from repo root: py fix_resources_lesson_enrollment_check.py
"""
import os

PATH = os.path.join("app", "api", "resources", "lesson", "[lessonId]", "route.ts")

OLD = "        .or(`course_slug.eq.${lesson.course_id},course_id.eq.${lesson.course_id}`)\n        .maybeSingle()"
NEW = "        .eq('course_id', lesson.course_id)\n        .maybeSingle()"

def main():
    if not os.path.exists(PATH):
        print(f"  NOT FOUND: {PATH}")
        return
    with open(PATH, "r", encoding="utf-8") as f:
        content = f.read()
    if OLD not in content:
        print("  WARNING: exact text not found — no change made. Check file manually.")
        return
    content = content.replace(OLD, NEW)
    with open(PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Fixed: {PATH}")
    print("Next: npm run type-check")

if __name__ == "__main__":
    main()
