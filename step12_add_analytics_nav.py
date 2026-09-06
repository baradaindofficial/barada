"""
Adds an Analytics entry to the dashboard Sidebar's NAV_ITEMS array,
placed between Achievements and Profile. Run AFTER
step11_add_learner_analytics_page.py has created the actual page.

Run from repo root: py step12_add_analytics_nav.py
"""

FILE_PATH = "components/dashboard/Sidebar.tsx"
OLD = "  { href: '/dashboard/achievements', label: 'Achievements', icon: '\U0001F3C5' },\n  { href: '/dashboard/profile', label: 'Profile', icon: '\U0001F464' },"
NEW = "  { href: '/dashboard/achievements', label: 'Achievements', icon: '\U0001F3C5' },\n  { href: '/dashboard/analytics', label: 'Analytics', icon: '\U0001F4CA' },\n  { href: '/dashboard/profile', label: 'Profile', icon: '\U0001F464' },"

def main():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: Could not find {FILE_PATH}")
        return

    if "'Analytics'" in content:
        print("Already added -- Analytics nav item exists. No changes made.")
        return

    if OLD not in content:
        print("WARNING: Could not find expected exact text.")
        print("Printing the NAV_ITEMS section for manual review:")
        start = content.find("const NAV_ITEMS")
        end = content.find("]", start) + 1
        print(content[start:end])
        return

    new_content = content.replace(OLD, NEW)
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"SUCCESS: Added Analytics nav item to {FILE_PATH}")

if __name__ == "__main__":
    main()
