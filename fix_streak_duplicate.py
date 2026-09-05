"""
Fixes the duplicate `const streak = {...}` block in lib/db/dashboard-overview.ts
Run from the repo root: py fix_streak_duplicate.py
"""
import re
import sys

FILE_PATH = "lib/db/dashboard-overview.ts"

OLD_BLOCK = """const streak = {
    current: streakData?.current_streak ?? 0,
    longest: streakData?.longest_streak ?? 0,
  }
"""

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: Could not find {FILE_PATH}")
        print("Make sure you're running this from C:\\Users\\dell\\barada-nextjs")
        sys.exit(1)

    count_before = content.count("const streak = {")
    print(f"Found {count_before} occurrence(s) of 'const streak = {{' before fix.")

    if count_before != 2:
        print(f"WARNING: Expected exactly 2 occurrences, found {count_before}.")
        print("Stopping without changes -- file may already be fixed, or differ from expected.")
        sys.exit(0)

    # Remove the SECOND occurrence (the stale one using current_streak / longest_streak
    # without the _days suffix). We find both occurrences and keep only the first.
    pattern = re.compile(
        r"const streak = \{\s*current: streakData\?\.current_streak \?\? 0,\s*longest: streakData\?\.longest_streak \?\? 0,\s*\}\r?\n?",
    )
    new_content, num_subs = pattern.subn("", content)

    if num_subs != 1:
        print(f"WARNING: Expected to remove exactly 1 stale block, removed {num_subs}.")
        print("Stopping without writing changes -- please check the file manually.")
        sys.exit(0)

    count_after = new_content.count("const streak = {")
    print(f"After fix: {count_after} occurrence(s) of 'const streak = {{' remain.")

    if count_after != 1:
        print("ERROR: Unexpected result after fix. Not writing file. Please check manually.")
        sys.exit(1)

    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print("SUCCESS: Removed the duplicate/stale streak block.")
    print("File saved. You can now restart the dev server.")

if __name__ == "__main__":
    main()
