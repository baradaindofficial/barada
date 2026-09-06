r"""
Fixes the broken rupee symbol on the public Academy page course cards.
The broken text is raw JSX text (not inside a JS string), so a
backslash-u-escape sequence never gets interpreted there -- it prints
literally instead of rendering the rupee character. Fix: use the real
rupee character directly, matching how the stat bar above it already
works correctly (that one is inside a JS string, so its escape works).

Run from repo root: py fix_academy_rupee_display.py
"""

FILE_PATH = "app/academy/page.tsx"
OLD = "Certificate: \\u20B9299"
NEW = "Certificate: \u20b9299"

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: Could not find {FILE_PATH}")
        return

    count = content.count(OLD)
    print(f"Found {count} occurrence(s) of the broken JSX text.")

    if count == 0:
        print("Nothing to fix -- file may already be correct.")
        return

    new_content = content.replace(OLD, NEW)

    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"SUCCESS: Fixed {count} occurrence(s). Real rupee character now used directly.")

if __name__ == "__main__":
    main()
