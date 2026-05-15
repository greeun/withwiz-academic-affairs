# Sprint 4 Critique

## Verdict: PASS

Sprint 4 delivers 3 of 4 features fully; the 4th (AdminManagerBase for Staff) is deferred with a well-reasoned justification. All system checks pass. The non-blocking issues from Sprint 3 (missing docs page, email change, dashboard stats API) are now resolved.

## Rubric Scores

| Criterion | Score | Notes |
|-----------|-------|-------|
| Correctness | 5/5 | All delivered features match contract specification exactly |
| Robustness | 5/5 | Proper auth, zod validation, error handling, edge cases (OAuth accounts) handled |
| Craft | 4/5 | Clean code, consistent patterns. Minor: settings page still uses inline styles for feedback messages |
| Functionality | 5/5 | Dashboard stats single-endpoint, email change with password verification, docs with 8 tabbed sections |

**Aggregate: 4.75/5**

## Blocking Issues

None.

## Non-blocking Notes

1. **Settings page is a bare client component** — `settings/page.tsx` exports the client component directly with `"use client"` rather than having a thin server wrapper as `docs/page.tsx` does. Minor consistency nit; functionally correct.

2. **Email change does not invalidate JWT** — After changing email, the existing access token still holds the old email in its claims (if email is a claim). Low severity since admin tokens are short-lived and the email claim may not be used for authorization decisions.

3. **Inline styles for error/success messages** — Both email and password forms use `style={{...}}` for feedback messages instead of admin CSS utility classes. This was noted in Sprint 3 and persists.

4. **AdminManagerBase deferral rationale is sound** — Staff page has table-with-reorder pattern fundamentally different from AdminManagerBase's side-panel model. Forcing the refactor would regress UX. Recommend applying AdminManagerBase to FAQ items page (simpler CRUD) in Sprint 5.

## Evidence Summary

| Check | Result |
|-------|--------|
| Docs page files exist | page.tsx, DocsPageClient.tsx, docs-data.ts, docs.css |
| docs-data.ts sections | 8 sections (시작하기, 대시보드, 블로그, 공지사항, 교직원, 학사일정, FAQ, 설정) |
| admin-config.ts "도움말" | Present: `{ href: "/admin/docs", label: "도움말", shortLabel: "?" }` |
| Settings page forms | Both email AND password change forms present |
| Change-email API route | `/api/admin/auth/change-email/route.ts` — zod validation, bcrypt verify, uniqueness check, withAdminApi |
| Dashboard stats API | `/api/admin/dashboard/stats/route.ts` — Promise.all for 7 concurrent counts |
| Dashboard stats response | `{ blog: {total, published}, news: {total, published}, staff: {total}, schedule: {total}, faq: {total} }` |
| DashboardClient calls stats | Single `adminFetch("/api/admin/dashboard/stats")` call, 5 stat cards |
| pnpm build:dev | Succeeds |
| vitest run | 208 tests passed (21 files) |

## Recommended Sprint 5 Focus

1. **AdminManagerBase for FAQ** — Apply to FAQ items page as a simpler CRUD case (no reorder complexity).
2. **Student/Attendance/Counseling pages** — Begin wiring remaining academic-affairs domains.
3. **Blog/News data.ts + layout.tsx** — Adopt dts-ballet pattern for page-level config.
4. **JWT refresh on email change** — Issue new token after successful email update.
