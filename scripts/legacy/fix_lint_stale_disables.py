"""
fix_lint_stale_disables.py
Barada Digital Platform — Sprint 4.4 pre-work regression fix

Removes stale `// eslint-disable-next-line @typescript-eslint/no-explicit-any`
comments from files where the @typescript-eslint plugin is not installed.
These comments are inert (the plugin was never wired into .eslintrc.json),
but ESLint errors when it encounters a disable-comment for an unknown rule.

Files touched (all pre-existing, unrelated to Sprint 4.3/4.4 feature work):
  - lib/db/enrollments.ts
  - lib/db/learners.ts
  - lib/db/progress.ts
  - lib/supabase/server.ts

Run from repo root: py fix_lint_stale_disables.py
"""
import re
import os

FILES = [
    "lib/db/enrollments.ts",
    "lib/db/learners.ts",
    "lib/db/progress.ts",
    "lib/supabase/server.ts",
]

PATTERN = re.compile(r"^[ \t]*//\s*eslint-disable-next-line\s+@typescript-eslint/no-explicit-any[ \t]*\r?\n?", re.MULTILINE)

def fix_file(path):
    if not os.path.exists(path):
        print(f"  SKIP (not found): {path}")
        return 0
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    new_content, count = PATTERN.subn("", content)
    if count > 0:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"  Fixed: {path} ({count} stale disable-comment(s) removed)")
    else:
        print(f"  No change needed: {path}")
    return count

def main():
    print("Removing stale @typescript-eslint/no-explicit-any disable comments...")
    total = 0
    for f in FILES:
        total += fix_file(f)
    print(f"\nDone. {total} line(s) removed across {len(FILES)} file(s).")
    print("Next: run `npm run lint` to confirm it's clean.")

if __name__ == "__main__":
    main()
