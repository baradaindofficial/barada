"""
Fixes the learner_id lookup bug in the SHARED authentication helper used
by 17 different files across the app (bookmarks, lesson completion/resume,
assessments, resource downloads, several dashboard API routes). This is
the same .eq('id', user.id) bug found and fixed 3 times already today in
individual files -- this is the one place that actually matters most,
since fixing it here fixes all 17 call sites at once.

Run from repo root: py fix_authenticated_learner_helper.py
"""

FILE_PATH = "lib/auth/get-authenticated-learner.ts"
OLD = ".eq('id', user.id)"
NEW = ".eq('learner_id', user.id)"

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: Could not find {FILE_PATH}")
        return

    count = content.count(OLD)
    print(f"Found {count} occurrence(s) of the broken query.")

    if count == 0:
        print("Nothing to fix -- file may already be correct.")
        return

    if count > 1:
        print("WARNING: expected exactly 1 occurrence, found more. Stopping without changes.")
        print("Please check the file manually.")
        return

    new_content = content.replace(OLD, NEW)

    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"SUCCESS: Fixed the shared getAuthenticatedLearner() helper.")
    print("This fixes all 17 dependent files at once -- no other files need editing for this bug.")

if __name__ == "__main__":
    main()
