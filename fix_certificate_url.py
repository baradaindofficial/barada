"""
Fixes the wrong column name (certificate_url -> verification_url) in
lib/db/dashboard-overview.ts
Run from the repo root: py fix_certificate_url.py
"""
import sys

FILE_PATH = "lib/db/dashboard-overview.ts"
OLD = "certificate_url"
NEW = "verification_url"

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: Could not find {FILE_PATH}")
        print("Make sure you're running this from C:\\Users\\dell\\barada-nextjs")
        sys.exit(1)

    count = content.count(OLD)
    print(f"Found {count} occurrence(s) of '{OLD}'.")

    if count == 0:
        print("Nothing to fix -- file may already be correct.")
        sys.exit(0)

    new_content = content.replace(OLD, NEW)

    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"SUCCESS: Replaced {count} occurrence(s) of '{OLD}' with '{NEW}'.")
    print("File saved. You can now restart the dev server.")

if __name__ == "__main__":
    main()
