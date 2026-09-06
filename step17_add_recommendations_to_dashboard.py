"""
Adds a "Recommended for You" section to app/(dashboard)/dashboard/page.tsx
(the version produced by step6_add_continue_and_activity.py), using the
new getRecommendedCourses() function. Only renders when there are actual
recommendations (i.e., not every course is already enrolled in).

Run from repo root: py step17_add_recommendations_to_dashboard.py
"""

FILE_PATH = "app/(dashboard)/dashboard/page.tsx"
IMPORT_MARKER = "import { getLearnerStreak, getAchievementCount, getRecentActivity } from '@/lib/db/learner-engagement'"
IMPORT_NEW = IMPORT_MARKER + "\nimport { getRecommendedCourses } from '@/lib/db/recommendations'"

PROMISE_ALL_MARKER = "const [learner, stats, enrollments, streak, achievementCount, recentActivity] = await Promise.all([\n    getLearner(user.id),\n    getLearnerStats(user.id),\n    getLearnerEnrollments(user.id),\n    getLearnerStreak(user.id),\n    getAchievementCount(user.id),\n    getRecentActivity(user.id),\n  ])"
PROMISE_ALL_NEW = "const [learner, stats, enrollments, streak, achievementCount, recentActivity, recommendations] = await Promise.all([\n    getLearner(user.id),\n    getLearnerStats(user.id),\n    getLearnerEnrollments(user.id),\n    getLearnerStreak(user.id),\n    getAchievementCount(user.id),\n    getRecentActivity(user.id),\n    getRecommendedCourses(user.id),\n  ])"

SECTION_MARKER = "        {/* Recent Activity */}"
SECTION_NEW = """        {/* Recommended for You */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display font-bold text-lg text-[#0D183D] mb-4">Recommended for You</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {recommendations.map(({ course, reason }) => (
                <Link
                  key={course.slug}
                  href={`/academy`}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3" style={{ background: `${course.themeColor}22` }}>
                    {course.icon}
                  </div>
                  <div className="font-bold text-[#0D183D] text-sm mb-1">{course.title}</div>
                  <div className="text-xs text-gray-400">{reason}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}"""

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: Could not find {FILE_PATH}")
        return

    if "getRecommendedCourses" in content:
        print("Already added -- recommendations already wired in. No changes made.")
        return

    if IMPORT_MARKER not in content:
        print("WARNING: import marker not found. File may differ from expected. Stopping.")
        return
    if PROMISE_ALL_MARKER not in content:
        print("WARNING: Promise.all marker not found. File may differ from expected. Stopping.")
        return
    if SECTION_MARKER not in content:
        print("WARNING: section marker not found. File may differ from expected. Stopping.")
        return

    content = content.replace(IMPORT_MARKER, IMPORT_NEW)
    content = content.replace(PROMISE_ALL_MARKER, PROMISE_ALL_NEW)
    content = content.replace(SECTION_MARKER, SECTION_NEW)

    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"SUCCESS: {FILE_PATH} updated with Recommended for You section.")

if __name__ == "__main__":
    main()
