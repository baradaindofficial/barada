"""
fix_sprint44_learner_id.py
Barada Digital Platform — Sprint 4.4 type-check fix

get-authenticated-learner.ts returns { learnerId } (camelCase), but the
Sprint 4.4 backend files were written assuming { learner_id } (snake_case).
This corrects the property ACCESS only (learner.learner_id -> learner.learnerId).

It does NOT touch the string 'learner_id' used as the actual Supabase
column name in .eq('learner_id', ...) or object keys like
{ learner_id: learner.learnerId } — those are correct as-is, since the
DATABASE column is genuinely named learner_id.

Run from repo root: py fix_sprint44_learner_id.py
"""
import os

FILES = [
    "app/api/courses/[id]/bookmark/route.ts",
    "app/api/courses/[id]/progress/route.ts",
    "app/api/courses/progress/route.ts",
    "app/api/dashboard/achievements/route.ts",
    "app/api/dashboard/learning/route.ts",
    "app/api/dashboard/recent-learning/route.ts",
    "app/api/dashboard/streak/route.ts",
    "app/api/lessons/[id]/complete/route.ts",
    "app/api/lessons/[id]/resume/route.ts",
]

OLD = "learner.learner_id"
NEW = "learner.learnerId"

def fix_file(path):
    if not os.path.exists(path):
        print(f"  SKIP (not found): {path}")
        return 0
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    count = content.count(OLD)
    if count > 0:
        content = content.replace(OLD, NEW)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  Fixed: {path} ({count} occurrence(s))")
    else:
        print(f"  No change needed: {path}")
    return count

def main():
    print("Fixing learner.learner_id -> learner.learnerId ...")
    total = 0
    for f in FILES:
        total += fix_file(f)
    print(f"\nDone. {total} occurrence(s) fixed across {len(FILES)} file(s).")
    print("Next: npm run type-check")

if __name__ == "__main__":
    main()
