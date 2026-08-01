# Barada Platform — CTO Engineering Guidelines

Version: 1.0 | August 2026 | Internal — Engineering Team

## 1. Architecture Authority

The BARADA_MASTER_BLUEPRINT.md is the single source of truth.
Any structural change requires a formal Architecture Review and written CTO approval.

## 2. Security Non-Negotiables

- getUser() always — never getSession() for auth decisions
- RLS on every table — no exceptions
- SUPABASE_SERVICE_ROLE_KEY — server-side only, never NEXT_PUBLIC_
- All API inputs validated with Zod before DB write
- No redirect to unvalidated URLs
- No secrets committed to git

## 3. Logo Rules

- No page references logo files directly — always use <Logo variant="..." />
- Corporate logo on corporate pages only
- Academy logo on Academy pages only
- Swapping a logo = replacing one file in public/logo/ — no code changes

## 4. Sprint Governance

No sprint closes without:
1. npm run type-check — zero errors
2. npm run build — successful
3. All routes verified manually
4. CHANGELOG.md updated

## 5. What Requires CTO Approval

Always:
- Architecture Package changes
- New third-party dependencies
- RBAC role changes
- Payment flow changes
- Certificate generation changes

Never needs approval:
- Bug fixes that don't change architecture
- Content/text updates
- TypeScript or ESLint fixes
