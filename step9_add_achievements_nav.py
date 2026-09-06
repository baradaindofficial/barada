"""
Adds an Achievements entry to the dashboard Sidebar's NAV_ITEMS array,
placed between Certificates and Profile. Only run this AFTER
step8_add_achievements_page.py has created the actual page -- this file's
own comment states routes should only be linked once they resolve.

Run from repo root: py step9_add_achievements_nav.py
"""

FILE_PATH = "components/dashboard/Sidebar.tsx"
OLD = "  { href: '/dashboard/certificates', label: 'Certificates', icon: '\U0001F3C6' },\n  { href: '/dashboard/profile', label: 'Profile', icon: '\U0001F464' },"
NEW = "  { href: '/dashboard/certificates', label: 'Certificates', icon: '\U0001F3C6' },\n  { href: '/dashboard/achievements', label: 'Achievements', icon: '\U0001F3C5' },\n  { href: '/dashboard/profile', label: 'Profile', icon: '\U0001F464' },"

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: Could not find {FILE_PATH}")
        return

    if "Achievements" in content:
        print("Already added -- Achievements nav item exists. No changes made.")
        return

    if OLD not in content:
        print("WARNING: Could not find expected exact text (icons may differ from expected).")
        print("Printing the NAV_ITEMS section for manual review:")
        start = content.find("const NAV_ITEMS")
        end = content.find("]", start) + 1
        print(content[start:end])
        return

    new_content = content.replace(OLD, NEW)
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"SUCCESS: Added Achievements nav item to {FILE_PATH}")

if __name__ == "__main__":
    main()
