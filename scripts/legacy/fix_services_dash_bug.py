"""
fix_services_dash_bug.py
Fixes app/services/page.tsx: the hero paragraph used a raw \\u2014 Unicode
escape directly as JSX text. That syntax is only interpreted inside a
quoted JS string — as bare JSX text it renders literally as "\\u2014"
instead of an em dash. Replacing with the &mdash; HTML entity, matching
every other page in this rewrite.

Run from repo root: py fix_services_dash_bug.py
"""
import os

PATH = os.path.join("app", "services", "page.tsx")

OLD = "AI adoption advisory, procurement transformation, and professional workshops \\u2014 built from real corporate experience."
NEW = "AI adoption advisory, procurement transformation, and professional workshops &mdash; built from real corporate experience."

def main():
    if not os.path.exists(PATH):
        print(f"  NOT FOUND: {PATH}")
        return
    with open(PATH, "r", encoding="utf-8") as f:
        content = f.read()
    if OLD not in content:
        print("  WARNING: exact text not found — check the file manually.")
        print("  Looking for a line containing '\\\\u2014' in app/services/page.tsx")
        return
    content = content.replace(OLD, NEW)
    with open(PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Fixed: {PATH}")

if __name__ == "__main__":
    main()
