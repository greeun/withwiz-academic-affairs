# Sprint 4 Generator Report

**Date**: 2026-05-10
**Status**: COMPLETE

## Features Implemented

### 1. Docs page (`/admin/docs`) -- DONE

Created 4 files:
- `src/app/admin/docs/docs-data.ts` — 8 sections: 시작하기, 대시보드, 블로그, 공지사항, 교직원, 학사일정, FAQ, 설정
- `src/app/admin/docs/docs.css` — Tab/section/callout styles (from dts-ballet, minus screenshot styles)
- `src/app/admin/docs/DocsPageClient.tsx` — Tab-based UI with inline content per section (no screenshots since yeroom doesn't have them yet)
- `src/app/admin/docs/page.tsx` — Simple server component wrapping client

Updated:
- `src/lib/admin-config.ts` — Added `{ href: "/admin/docs", label: "도움말", shortLabel: "?" }` between FAQ and 설정. Changed FAQ shortLabel from "?" to "F" to avoid duplicate.

### 2. Settings email change -- DONE

Created:
- `src/app/api/admin/auth/change-email/route.ts` — POST endpoint using `withAdminApi` middleware. Validates with zod, verifies current password with bcrypt, checks email uniqueness, updates user record. Handles nullable password (OAuth accounts).

Updated:
- `src/app/admin/settings/page.tsx` — Added email change form section above the password change section. Uses `adminFetch` for auth'd API call. Shows success/error feedback.

### 3. Dashboard stats API -- DONE

Created:
- `src/app/api/admin/dashboard/stats/route.ts` — GET endpoint using `withAdminApi`. Returns `{ blog: { total, published }, news: { total, published }, staff: { total }, schedule: { total }, faq: { total } }`.

Updated:
- `src/app/admin/dashboard/DashboardClient.tsx` — Now calls single `/api/admin/dashboard/stats` endpoint instead of multiple blog/news endpoints. Displays all 5 stat cards (blog, news, staff, schedule, FAQ) with published/total for blog and news.
- `src/app/admin/dashboard/dashboard.css` — Added `.dashboard-card-sub` style for "공개 / 전체" subtitle.

### 4. AdminManagerBase for Staff -- DEFERRED

**Reason**: The existing Staff admin page (`StaffListClient.tsx`) has a well-functioning custom table UI with:
- Inline reorder buttons (▲/▼) with API call
- Inline toggle active/inactive status
- Inline delete with confirmation
- Navigation to separate edit page (`/admin/staff/[id]`)
- Full-page form (`StaffForm.tsx`) with image upload, custom fields, discipline picker

This is fundamentally a different UI pattern from AdminManagerBase (which provides a side-panel list + inline editor). Refactoring would:
1. Require significant UI redesign (losing the table reorder UX)
2. Risk breaking existing edit/create flows
3. Not add meaningful value since the page already works

**Recommendation for Sprint 5**: If AdminManagerBase integration is desired, create a Staff-specific adapter that extends AdminManagerBase with reorder support, or leave Staff as-is and apply AdminManagerBase to simpler CRUD pages (FAQ items) instead.

## Verification

- `pnpm build:dev` — SUCCESS (yeroom-homepage)
- `npx vitest run` — 208 tests pass (package)
- `npx tsup` — build succeeds (package)

## Files Changed (yeroom-homepage)

### New files:
- `src/app/admin/docs/docs-data.ts`
- `src/app/admin/docs/docs.css`
- `src/app/admin/docs/DocsPageClient.tsx`
- `src/app/admin/docs/page.tsx`
- `src/app/api/admin/auth/change-email/route.ts`
- `src/app/api/admin/dashboard/stats/route.ts`

### Modified files:
- `src/lib/admin-config.ts` (added 도움말 nav item)
- `src/app/admin/settings/page.tsx` (added email change form)
- `src/app/admin/dashboard/DashboardClient.tsx` (use stats API)
- `src/app/admin/dashboard/dashboard.css` (added card-sub style)
