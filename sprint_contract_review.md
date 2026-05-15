# Sprint 2 Contract Review

## Verdict: AMEND

## Current State Baseline
- 27 source files. Only staff domain implemented (service, types, validator).
- `createAcademicSystem` returns `{ services: { staff? } }` -- no handlers.
- No handler files exist per domain (only `create-system.ts`).
- No `prisma/academic.prisma` file exists.
- No components: `AdminManagerBase`, `ImageDropUpload`, `ToggleSwitch`, `AdminManagerConfig` absent.
- No hooks: `useImageDropZone` absent.
- No CSS files: `image-drop-zone.css`, `toggle-switch.css` absent.
- 60 tests, 9 files, all passing.

---

## MISSING from Sprint Contract (features in spec but not covered)

### M1. Handler files per domain
The spec defines handler files for every domain (`src/handlers/staff.handler.ts`, `academic-calendar.handler.ts`, `faq.handler.ts`, `student.handler.ts`, `attendance.handler.ts`, `counseling.handler.ts`, `admission.handler.ts`, `dashboard.handler.ts`). The sprint contract says "createAcademicSystem expansion" but does not require individual handler files, does not require the `handlers` property on the returned system object, and does not specify the handler interface (`list.GET`, `list.POST`, `detail.GET`, `detail.PUT`, `detail.DELETE`).

**Required addition**: Each domain handler file must exist. `createAcademicSystem` must return `{ services, handlers }`. Each handler must expose `list.GET`, `list.POST`, `detail.GET`, `detail.PUT`, `detail.DELETE`. Tests must verify handler wiring.

### M2. Dashboard handler
Spec lists `dashboard.handler.ts`. The sprint contract does not mention it at all.

**Required addition**: `src/handlers/dashboard.handler.ts` with aggregated stats endpoint. Test coverage.

### M3. `handlers/index.ts` re-exports
The sprint contract checks `src/services/index.ts`, `src/types/index.ts`, `src/validators/index.ts` re-exports. It does not check `src/handlers/index.ts` re-exports all domain handlers.

**Required addition**: Verify `src/handlers/index.ts` re-exports all handler modules.

### M4. Prisma schema file
Spec defines `src/prisma/academic.prisma` containing all domain models. This file does not exist yet. Sprint contract does not mention it.

**Required addition**: `src/prisma/academic.prisma` must contain all models (Staff, Timetable, AcademicEvent, FaqCategory, Faq, Student, Attendance, Counseling, AdmissionSession, AdmissionRegistration) and enums.

### M5. Components: AdminManagerBase, AdminManagerConfig, ImageDropUpload, ToggleSwitch
Spec lists these as package components. None exist yet. Sprint contract does not mention them.

**Decision needed**: If these are Sprint 3, the contract should explicitly state so. If Sprint 2, add them.

### M6. Hooks: useImageDropZone
Spec lists `useImageDropZone` hook. Does not exist. Sprint contract does not mention it.

**Decision needed**: Same as M5 -- scope explicitly.

### M7. CSS: image-drop-zone.css, toggle-switch.css
Spec lists these CSS files inside `src/components/`. Neither exists. Sprint contract does not mention them.

**Decision needed**: Same as M5 -- scope explicitly.

### M8. Student domain: `getByGrade()` and `updateStatus()` methods
Spec defines `getByGrade(grade: number)` and `updateStatus(id, status)` on StudentService. The sprint contract only checks the generic 6 CRUD methods.

**Required addition**: Add `getByGrade()` and `updateStatus()` to domain-specific checks list.

### M9. StaffService.reorder()
Already implemented in Sprint 1 code. Sprint 2 contract references `reorder` for FAQ but not for Staff. This is fine -- already done. No action needed.

---

## WEAK Checks in Sprint Contract

### W1. "Service file exists" -- too weak
The check "Service file exists at `src/services/<domain>.service.ts`" proves nothing about correctness. A file containing `export class Foo {}` would pass.

**Required amendment**: Each service test must verify:
- `list()` returns `PaginatedResult` shape (`items`, `pagination.total`, `pagination.page`, `pagination.pageSize`, `pagination.totalPages`)
- `getById()` calls `prisma.<model>.findUnique`
- `create()` calls `prisma.<model>.create` with validated data
- `update()` calls `prisma.<model>.update`
- `delete()` calls `prisma.<model>.delete`
- `getStats()` returns domain-appropriate statistics

### W2. "Each service has list(), getById()..." -- how is this verified?
The contract says "Each service has: `list()`, `getById()`, `create()`, `update()`, `delete()`, `getStats()`" but does not specify HOW to verify. Manual code reading is not an observable check.

**Required amendment**: Each service test file must contain test cases that call all 6 methods and assert return shapes. Vitest test names should contain the method name for traceability.

### W3. "Validator has createSchema and updateSchema" -- no behavioral check
Checking schema existence does not verify they validate correctly.

**Required amendment**: Each validator test must include:
- Valid data passes `createSchema.parse()`
- Missing required fields cause `createSchema.parse()` to throw ZodError
- `updateSchema` accepts partial data (all fields optional)
- Domain-specific fields validated (e.g., AttendanceStatus enum, CounselingType enum, date fields, email format)

### W4. "Total test count >= 120" -- quantity metric without quality constraint
120 tests across 6 domains averages ~10 tests per domain. This is marginal for domains like Admission (2 models, 5+ extra methods).

**Required amendment**: Minimum per domain:
- Service test: >= 8 tests (6 CRUD + getStats + domain-specific methods)
- Validator test: >= 4 tests (valid create, invalid create, valid update partial, domain enum/format checks)
- Minimum total: 144 (60 existing + 6 domains x 14 minimum)

### W5. "createAcademicSystem creates all services" -- does not test handlers property
The system-level check only verifies `services` property. The spec requires `handlers` property with route handler functions.

**Required amendment**: Test that `createAcademicSystem()` returns `{ services, handlers }` where `handlers.<domain>` has `.list.GET`, `.list.POST`, `.detail.GET`, `.detail.PUT`, `.detail.DELETE`.

### W6. AcademicCalendar domain check -- no test coverage requirement for extra methods
The contract says `getActiveTimetables()`, `getMonthlyEvents()`, `getYearlyEvents()` "methods exist" but does not require tests that verify their behavior (correct filtering by year/month, isActive flag, date range queries).

**Required amendment**: Tests must verify:
- `getActiveTimetables()` filters by `isActive: true`
- `getMonthlyEvents(year, month)` filters events within the calendar month
- `getYearlyEvents(year)` filters events within the calendar year

### W7. Attendance.bulkCreate() -- no test for transaction behavior
Spec implies `bulkCreate` creates multiple records atomically. Contract says "method exists."

**Required amendment**: Test must verify `bulkCreate` calls `prisma.$transaction` and handles the `@@unique([studentId, date])` constraint (duplicate detection).

### W8. FAQ.reorderCategories() -- no test for transaction behavior
Same as W7. `reorder` and `reorderCategories` should use transactions.

**Required amendment**: Tests must verify transaction usage for reorder operations.

---

## SCOPE AMBIGUITY

The spec lists components (`AdminManagerBase`, `ImageDropUpload`, `ToggleSwitch`, `AdminManagerConfig`), hooks (`useImageDropZone`), and CSS files (`image-drop-zone.css`, `toggle-switch.css`) that are not in the Sprint 2 contract but also not explicitly deferred.

**Required**: The contract must add a "Deferred to Sprint 3" section listing everything intentionally excluded, or include these items in Sprint 2.

---

## Amended Observable Checks to Add

```
### Handler checks (NEW section):
- [ ] Handler file exists at `src/handlers/<domain>.handler.ts` for all 7 domains + dashboard
- [ ] `src/handlers/index.ts` re-exports all handlers + createAcademicSystem
- [ ] `createAcademicSystem()` returns `{ services, handlers }`
- [ ] Each domain's handlers has `.list.GET`, `.list.POST`, `.detail.GET`, `.detail.PUT`, `.detail.DELETE`
- [ ] Handler tests exist at `__tests__/unit/handlers/<domain>.handler.test.ts`
- [ ] Each handler wraps service calls with middleware (withAdminApi or withPublicApi)

### Prisma schema (NEW section):
- [ ] `src/prisma/academic.prisma` contains all 10 models and 6 enums from spec

### Additional domain-specific checks (AMEND existing):
- [ ] StudentService: `getByGrade(grade)` and `updateStatus(id, status)` methods exist and are tested
- [ ] AttendanceService.bulkCreate: test verifies $transaction usage
- [ ] FaqService.reorder/reorderCategories: test verifies $transaction usage
- [ ] AcademicCalendarService: tests verify filtering logic for getActiveTimetables, getMonthlyEvents, getYearlyEvents

### Validator behavioral checks (AMEND existing):
- [ ] Each validator test: valid data passes, required field missing throws ZodError, updateSchema is partial
- [ ] Enum validators: AttendanceStatus, CounselingType, CounselingStatus, AcademicEventType, StudentStatus, RegistrationStatus

### Minimum test count (AMEND):
- [ ] Total test count >= 144 (60 existing + 84 new minimum: 6 domains x 14)

### Scope exclusion (NEW section):
- [ ] Contract explicitly lists deferred items: AdminManagerBase, AdminManagerConfig, ImageDropUpload, ToggleSwitch, useImageDropZone, image-drop-zone.css, toggle-switch.css
```
