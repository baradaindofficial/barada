"""
Fixes the learner_id lookup bug in app/(dashboard)/dashboard/courses/page.tsx
Run from the repo root: py fix_courses_learner_id.py
"""
import sys

FILE_PATH = r"app/(dashboard)/dashboard/courses/page.tsx"
OLD = ".from('learners').select('learner_id').eq('id', user.id).single()"
NEW = ".from('learners').select('learner_id').eq('learner_id', user.id).single()"

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: Could not find {FILE_PATH}")
        print("Make sure you're running this from C:\\Users\\dell\\barada-nextjs")
        sys.exit(1)

    count = content.count(OLD)
    print(f"Found {count} occurrence(s) of the exact old query string.")

    if count == 0:
        print("No exact match found. File may differ from expected -- printing current")
        print("lines containing 'learners' or 'user.id' for you to check manually:")
        for i, line in enumerate(content.splitlines(), 1):
            if "learners" in line or "user.id" in line:
                print(f"  Line {i}: {line.strip()}")
        sys.exit(0)

    new_content = content.replace(OLD, NEW)
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"SUCCESS: Fixed {count} occurrence(s).")
    print("File saved.")

if __name__ == "__main__":
    main()
