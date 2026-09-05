"""
Removes the orphaned dashboard-overview.ts and reverts api/dashboard/route.ts
to a minimal, harmless state (since nothing calls it, but deleting the route
file entirely could break something we haven't checked -- safer to leave a
stub that returns 501 than to delete a live route file blind).

Run from repo root: py step1_cleanup_orphaned.py
"""
import os

DASHBOARD_OVERVIEW = "lib/db/dashboard-overview.ts"
API_ROUTE = "app/api/dashboard/route.ts"

STUB_ROUTE = """import { NextResponse } from 'next/server'

// This route had no callers anywhere in the app (confirmed via repo-wide
// search) and duplicated logic that lives in lib/db/learners.ts and
// lib/db/enrollments.ts, the actual data layer used by app/(dashboard)/dashboard/page.tsx.
// Kept as a stub rather than deleted outright in case something external
// depends on this path existing.
export async function GET() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
"""

def main():
    if os.path.exists(DASHBOARD_OVERVIEW):
        os.remove(DASHBOARD_OVERVIEW)
        print(f"Removed: {DASHBOARD_OVERVIEW}")
    else:
        print(f"Already absent: {DASHBOARD_OVERVIEW}")

    if os.path.exists(API_ROUTE):
        with open(API_ROUTE, "w", encoding="utf-8") as f:
            f.write(STUB_ROUTE)
        print(f"Stubbed: {API_ROUTE}")
    else:
        print(f"Not found (nothing to stub): {API_ROUTE}")

if __name__ == "__main__":
    main()
