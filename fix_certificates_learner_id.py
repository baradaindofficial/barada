"""
Fixes the learner_id lookup bug in app/(dashboard)/dashboard/certificates/page.tsx
Run from the repo root: py fix_certificates_learner_id.py

Note: this only fixes the query itself (select + filter columns). If the
rest of the file references learner.first_name or learner.last_name
elsewhere (e.g. to display the name), those references will NOT be
touched automatically -- this script will detect and print them so you
can decide how to fix them (likely: switch to learner.name, or use
getLearnerDisplayName() from lib/utils/learner-display.ts).
"""
import sys

FILE_PATH = r"app/(dashboard)/dashboard/certificates/page.tsx"
OLD = ".from('learners').select('learner_id, first_name, last_name').eq('id', user.id).single()"
NEW = ".from('learners').select('learner_id, name').eq('learner_id', user.id).single()"

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
        print("No exact match found. Printing lines containing 'learners', 'first_name',")
        print("'last_name', or 'user.id' for you to check manually:")
        for i, line in enumerate(content.splitlines(), 1):
            if any(s in line for s in ("learners", "first_name", "last_name", "user.id")):
                print(f"  Line {i}: {line.strip()}")
        sys.exit(0)

    new_content = content.replace(OLD, NEW)

    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"SUCCESS: Fixed the query on {count} occurrence(s).")
    print("File saved.")
    print()

    # Check for any remaining first_name / last_name references elsewhere in the file
    remaining = [
        (i, line.strip())
        for i, line in enumerate(new_content.splitlines(), 1)
        if "first_name" in line or "last_name" in line
    ]
    if remaining:
        print("WARNING: Found other references to first_name/last_name still in this file:")
        for i, line in remaining:
            print(f"  Line {i}: {line}")
        print()
        print("These likely need to change to use `name` or getLearnerDisplayName().")
        print("Bring these lines to Claude before assuming the file is fully fixed.")
    else:
        print("No other first_name/last_name references found in this file. Looks clean.")

if __name__ == "__main__":
    main()
