# Sprint 3 Contract Review

## Verdict: AMEND

---

## Issues

### 1. Missing: `next.config.ts` transpilePackages update (BLOCKING)

yeroom-homepage uses `transpilePackages` for all `@withwiz/*` packages. The contract does not mention adding `"@withwiz/academic-affairs"` to this array. Without it, Next.js will not bundle the package correctly (especially the "use client" directives in AdminShell).

**Add check:** `next.config.ts` includes `"@withwiz/academic-affairs"` in `transpilePackages`.

### 2. Missing: CSS conflict strategy (BLOCKING)

The current layout imports 3 CSS files in a specific order:
```
@withwiz/block-editor/styles/editor.css
@withwiz/blog-core/styles/block-editor
@withwiz/blog-core/styles/admin
```

The contract says to import `@withwiz/academic-affairs/styles/admin.css` but does not specify:
- Whether the blog-core CSS imports are kept (they must be -- blog/news admin pages rely on them).
- What order the new admin.css goes in relative to existing imports.
- Whether `admin.css` from the package conflicts with blog-core's admin CSS (both likely define `.admin-*` class selectors).

**Add check:** Verify that the combined CSS does not break existing blog/news admin pages. Contract should specify that `academic-affairs/styles/admin.css` is imported BEFORE the blog-core CSS, or document that they are conflict-free.

### 3. Missing: `src/lib/academic-config.ts` with `createAcademicSystem()` (GAP)

The spec section "Project Integration" step 3 requires `src/lib/academic-config.ts` calling `createAcademicSystem()`. The contract does not include this file. Without it, the dashboard cannot fetch stats from academic services and no handler wiring exists.

**Add to contract:** Create `src/lib/academic-config.ts` with `createAcademicSystem({ prisma, domains: { staff: true, academicCalendar: true, faq: true } })`. If dashboard stats are deferred, state that explicitly.

### 4. Weak check: Dashboard page verification

The check says "DashboardClient.tsx displays stats" but does not specify which stats endpoint it hits or what to verify. Since the academic-config and dashboard API routes are not in scope, the dashboard will either:
- Call existing per-domain API endpoints (blog/news/staff/schedule/faq count endpoints), or
- Be a static placeholder.

**Clarify:** Specify whether the dashboard calls real APIs or is a skeleton. If real APIs, add check for the dashboard API route (`/api/admin/dashboard`).

### 5. Missing: Login redirect target change

Current login page hard-codes `router.push("/admin/blog")` on success. With AdminShell, the convention is to redirect to `/admin/dashboard`. Contract item 13 says "restyle login page" but does not mention fixing the redirect target.

**Add check:** Login success redirects to `/admin/dashboard` (not `/admin/blog`).

### 6. Missing: `useImageDropZone` hook file path mismatch

Spec says `src/hooks/useImageDropZone.ts`. Contract check says the same. But current `hooks/index.ts` only exports `useAdminForm` and `useAdminList`. The contract does not include a check that the hook is re-exported from `src/hooks/index.ts`.

Wait -- the contract does check `src/hooks/index.ts` re-exports. This is fine. No issue.

### 7. Weak check: "pnpm build:dev succeeds ... or at minimum pnpm lint passes"

This is too lenient. If the layout CSS order is wrong or AdminShell import fails, `pnpm lint` may still pass. The real verification is `pnpm build:dev`. The "or" weakens the contract.

**Amend:** Remove the "or" fallback. Require `pnpm build:dev` to succeed. If there are known build issues (e.g., missing dashboard API), document them as expected failures.

### 8. Missing: existing admin page preservation check

yeroom already has working admin pages for blog, news, staff, schedule, faq. Replacing AdminNav with AdminShell is a layout overhaul. No check verifies that these existing pages still render correctly after the layout swap.

**Add check:** At minimum, navigating to `/admin/blog`, `/admin/staff`, `/admin/faq` in the dev server should not produce layout errors. Alternatively, `pnpm build:dev` succeeding covers this implicitly (if we enforce it per item 7).

---

## Summary of Required Amendments

| # | Action |
|---|--------|
| 1 | Add `transpilePackages` check in `next.config.ts` |
| 2 | Specify CSS import order and document compatibility with blog-core CSS |
| 3 | Add `src/lib/academic-config.ts` or explicitly defer to Sprint 4 |
| 4 | Clarify dashboard data source (real API vs placeholder) |
| 5 | Add login redirect target change to `/admin/dashboard` |
| 7 | Remove "or lint" fallback -- require `pnpm build:dev` to succeed |

Items 6 and 8 are covered if item 7 is enforced.
