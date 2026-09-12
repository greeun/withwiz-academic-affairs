[English](./README.md) | [한국어](./README.ko.md)

# @withwiz/academic-affairs

> Academic Affairs Management System — a reusable admin framework for school / academy products.

`@withwiz/academic-affairs` is a monolithic npm package that bundles the UI shell,
domain services, API handlers, validators, and Prisma schemas needed to ship an
admin console for academic-affairs domains (staff, students, attendance, counseling,
admissions, academic calendar, FAQ, etc.). It is designed to be reused across
multiple school projects by injecting per-project configuration into a single
`AdminShell`.

## Features

- **AdminShell** — configurable sidebar layout with resize / collapse / mobile menu,
  built-in auth check & logout flow, themable accent color.
- **Domain services & handlers** — ready-made service / handler / validator triplets
  for staff, students, attendance, counseling, admissions, academic calendar, FAQ,
  dashboard.
- **Attendance toolkit** — date rules, class-day plans, aggregation, notification
  schemas, guardian-phone sanitation, and access-control helpers.
- **Infrastructure** — Prisma client wrapper plus `withPublicApi` / `withAdminApi`
  / `withAuthApi` middleware wrappers.
- **RBAC & Auth** — role-based access control primitives and academic auth helpers
  layered on top of `@withwiz/toolkit`.
- **Prisma schemas** — ships `academic.prisma`, `rbac.prisma`, `menu-resource.prisma`
  in the package payload so consumers can merge them into their own schema.
- **Hooks** — `useAdminForm`, `useAdminList`, `useImageDropZone` for common admin
  UX patterns.
- **Multiple subpath exports** — fine-grained entry points (e.g.
  `@withwiz/academic-affairs/components/AdminShell`,
  `/infrastructure/middleware`, `/attendance`) for optimal tree-shaking.

## Tech Stack

- **Language**: TypeScript 5.9
- **Runtime targets**: Next.js ≥ 15, React ≥ 18
- **Build**: [tsup](https://tsup.egoist.dev/) (ESM + CJS + d.ts)
- **Testing**: [Vitest](https://vitest.dev/) + Testing Library + jsdom
- **DB**: [Prisma](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Rich text**: [Tiptap](https://tiptap.dev/) v3
- **Virtualization**: [@tanstack/react-virtual](https://tanstack.com/virtual)
- **Calendar**: [korean-lunar-calendar](https://github.com/usingsky/korean-lunar-calendar-node)
- **Peer foundation**: [`@withwiz/toolkit`](https://github.com/greeun/withwiz-toolkit) (auth, JWT, middleware)

## Installation

```bash
# pnpm (recommended)
pnpm add @withwiz/academic-affairs

# npm
npm install @withwiz/academic-affairs

# yarn
yarn add @withwiz/academic-affairs
```

Peer dependencies you need to provide in the host app:

```bash
pnpm add next react @withwiz/toolkit zod
# optional: sonner (for toast notifications)
pnpm add sonner
```

> **Note**: this package is currently developed inside a workspace and references
> `@withwiz/toolkit` as a `file:` dependency. To build it as an external consumer
> you will need to install a published version of `@withwiz/toolkit` that
> satisfies `>=0.7.0-rc.0`.

## Usage

### 1. Mount the AdminShell layout

```tsx
// app/admin/layout.tsx
import AdminShell from "@withwiz/academic-affairs/components/AdminShell";
import "@withwiz/academic-affairs/styles/admin.css";

const config = {
  brand: { name: "My School", shortName: "MS", homeUrl: "/" },
  auth:  { meEndpoint: "/api/auth/me", logoutEndpoint: "/api/auth/logout", loginPath: "/admin/login" },
  navigation: [
    { href: "/admin/students",   label: "Students",   shortLabel: "Stu" },
    { href: "/admin/attendance", label: "Attendance", shortLabel: "Att" },
    { href: "/admin/calendar",   label: "Calendar",   shortLabel: "Cal" },
  ],
  theme: { accentColor: "#D4AF37" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell config={config}>{children}</AdminShell>;
}
```

### 2. Build an API route with an auth wrapper

Every generated handler receives `(req, actor, props)` and **must** be wrapped: `createAcademicSystem` throws
if `withAdminApi` is missing, so nothing is ever exposed unauthenticated. Build the wrapper from the package
RBAC (`createSchoolAffairs(...).rbac` / `createMenuApi`) so menuKey permissions are enforced:

```ts
// lib/academic.ts
import { createSchoolAffairs } from "@withwiz/academic-affairs/facade";
import { createAcademicSystem } from "@withwiz/academic-affairs/handlers";

const affairs = createSchoolAffairs({ prisma, auth, rbac: { menuKeys: ["students", "attendance"] } });

export const academic = createAcademicSystem({
  prisma,
  domains: { student: true, attendance: true },
  // Handlers of this system are gated by the "students" menuKey.
  withAdminApi: (handler) => affairs.rbac.withMenuApi("students", handler),
});
```

```ts
// app/api/admin/students/route.ts
import { academic } from "@/lib/academic";

export const { GET, POST } = academic.handlers.student!.list;
```

```ts
// app/api/admin/students/[id]/route.ts
export const { GET, PUT, DELETE } = academic.handlers.student!.detail;
```

If you authenticate with `@withwiz/toolkit`'s `withAdminApi` instead, bridge it with `adaptContextWrapper`,
which resolves the JWT user into a `StaffActor` (and rejects users without a role):

```ts
import { withAdminApi } from "@withwiz/academic-affairs/infrastructure/middleware";
import { adaptContextWrapper } from "@withwiz/academic-affairs/handlers";

const wrapper = adaptContextWrapper(withAdminApi as never, (user) => auth.getStaffByUserId(user.id));
```

List endpoints accept `page`, `limit` (max 200) and `sortBy`; invalid filters return `400`.

### 3. Use a domain service directly

```ts
import { attendanceService } from "@withwiz/academic-affairs/services";
import {
  buildClassDayPlan,
  sanitizeGuardianPhone,
} from "@withwiz/academic-affairs/attendance";
```

### 4. Merge the Prisma schemas

The package ships `prisma/academic.prisma`, `prisma/rbac.prisma`, and
`prisma/menu-resource.prisma`. Copy or include them in your host application's
Prisma schema, then run `prisma generate` / `prisma migrate` as usual.

## Package Layout

```
@withwiz/academic-affairs/
├── src/
│   ├── components/      # AdminShell, AdminManagerBase, image upload, toggle, nav
│   ├── hooks/           # useAdminForm, useAdminList, useImageDropZone
│   ├── services/        # staff, student, attendance, counseling, admission, ...
│   ├── handlers/        # createAcademicSystem factory + per-domain handlers
│   ├── infrastructure/  # prisma client + middleware wrappers
│   ├── types/           # shared type definitions
│   ├── utils/           # adminFetch, api-response, cn, date, academic-year, holidays
│   ├── validators/      # Zod schemas per domain
│   ├── errors/          # error classes
│   ├── auth/            # academic auth helpers
│   ├── facade/          # high-level facades
│   ├── rbac/            # role / permission primitives
│   ├── presets/         # config presets
│   ├── counseling/      # counseling-specific helpers
│   ├── scheduling/      # scheduling-specific helpers
│   ├── attendance/      # attendance helpers (date rules, class-day plans, ...)
│   └── styles/          # admin.css
├── prisma/              # academic.prisma, rbac.prisma, menu-resource.prisma
└── __tests__/           # vitest unit tests
```

## Scripts

```bash
pnpm build         # tsup build (ESM + CJS + d.ts) into dist/
pnpm test          # vitest run (CI mode)
pnpm test:watch    # vitest watch mode
```

## License

[MIT](./LICENSE)
