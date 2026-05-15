# Sprint 4 Contract — Docs Page, Settings Email, Dashboard API, AdminManagerBase 적용

## Context
Sprint 3 completed: Package components ported (AdminManagerBase, ImageDropUpload, ToggleSwitch, useImageDropZone), yeroom-homepage integrated with AdminShell sidebar layout. 208 tests passing. yeroom `pnpm build:dev` succeeds. Non-blocking issues from Evaluator: missing 도움말 nav, email change, dashboard stats API.

## Features to build this sprint

### 1. Docs page (`/admin/docs`)
- Create `/admin/docs` page with yeroom-specific 사용설명서
- Tab-based UI (시작하기, 대시보드, 블로그, 공지사항, 교직원, 학사일정, FAQ, 설정)
- Use admin.css tab classes (`.admin-tabs`, `.admin-tab`)
- Add "도움말" NavItem to admin-config.ts navigation

### 2. Settings page email change
- Add email change form to existing settings page
- Create `/api/admin/auth/change-email` API route (or use existing pattern)
- Uses adminFetch for authenticated requests

### 3. Dashboard stats API
- Create `/api/admin/dashboard/stats` route aggregating counts from blog, news, staff, schedule, faq
- Update DashboardClient to call this single endpoint instead of multiple `/api/blog?limit=1` calls
- Display blog/news published count, staff count, schedule count, faq count

### 4. AdminManagerBase integration — Staff page
- Refactor `/admin/staff` page to use AdminManagerBase from academic-affairs
- Create AdminManagerConfig for Staff domain
- Demonstrate the CRUD pattern (list/edit with real-time preview concept)

## Observable verification checks

### Docs page:
- [ ] `src/app/admin/docs/page.tsx` exists
- [ ] `src/app/admin/docs/DocsPageClient.tsx` exists with tab UI
- [ ] `src/app/admin/docs/docs-data.ts` exists with section definitions for yeroom
- [ ] `src/app/admin/docs/docs.css` exists
- [ ] `src/lib/admin-config.ts` navigation includes `{ href: "/admin/docs", label: "도움말", shortLabel: "?" }`

### Settings email change:
- [ ] `src/app/admin/settings/page.tsx` has both email AND password change forms
- [ ] `/api/admin/auth/change-email/route.ts` OR `/api/auth/change-email/route.ts` exists and handles POST
- [ ] Email change form calls the API with adminFetch and shows success/error

### Dashboard stats API:
- [ ] `src/app/api/admin/dashboard/stats/route.ts` exists
- [ ] Returns `{ success: true, data: { blog: { total, published }, news: { total, published }, staff: { total }, schedule: { total }, faq: { total } } }`
- [ ] `src/app/admin/dashboard/DashboardClient.tsx` calls `/api/admin/dashboard/stats` via adminFetch
- [ ] Dashboard displays real counts from the stats API

### AdminManagerBase — Staff page:
- [ ] `src/app/admin/staff/page.tsx` refactored to use AdminManagerBase or remains functional with existing pattern
- [ ] If AdminManagerBase is used: proper AdminManagerConfig wired with apiPath, emptyForm, filterItems, renderListItem, renderEditForm, renderDetailPreview
- [ ] Staff list/edit/create/delete still works end-to-end

### System checks:
- [ ] `pnpm build:dev` succeeds in yeroom-homepage
- [ ] Package: `npx vitest run` — 208+ tests pass
- [ ] Package: `npx tsup` — build succeeds

## Commands to verify
```bash
# Package
cd /Users/uni4love/project/workspace/211-withwiz/node-packages/withwiz-academic-affairs
npx vitest run
npx tsup

# yeroom-homepage
cd /Users/uni4love/project/workspace/211-withwiz/dts/yeroom/yeroom-homepage
pnpm build:dev
```

## Deferred:
- Student, Attendance, Counseling, Admission admin pages
- Blog/News data.ts + layout.tsx pattern (dts-ballet style)
- AdminManagerBase for FAQ, Schedule pages
