[English](./README.md) | [한국어](./README.ko.md)

# @withwiz/academic-affairs

> 학사관리 어드민 프레임워크 — 학교/학원용 어드민 콘솔을 빠르게 구축하기 위한 재사용 가능한 npm 패키지.

`@withwiz/academic-affairs`는 학사관리 도메인(교직원, 학생, 출결, 상담, 입학,
학사일정, FAQ 등)에 필요한 UI Shell, 도메인 서비스, API 핸들러, 검증기,
Prisma 스키마를 하나로 묶은 monolithic 패키지입니다. 프로젝트별 설정만 주입하면
동일한 `AdminShell`을 여러 학교 프로젝트에 재사용할 수 있도록 설계되었습니다.

## 주요 기능

- **AdminShell** — 사이드바 리사이즈/접기/모바일 햄버거 메뉴, 인증 체크 &
  로그아웃 플로우, accent 컬러 테마 지원의 설정 가능한 레이아웃.
- **도메인 서비스 & 핸들러** — staff / student / attendance / counseling /
  admission / academic-calendar / faq / dashboard 도메인에 대한 service /
  handler / validator 3종 세트 제공.
- **출결(attendance) 툴킷** — 날짜 규칙, 수업일 계획, 집계, 알림 스키마,
  보호자 전화번호 정제, 접근 제어 헬퍼.
- **인프라** — Prisma 클라이언트 래퍼 + `withPublicApi` / `withAdminApi` /
  `withAuthApi` 미들웨어 래퍼.
- **RBAC & Auth** — `@withwiz/toolkit` 위에 얹는 역할 기반 접근 제어 및 학사
  인증 헬퍼.
- **Prisma 스키마** — `academic.prisma`, `rbac.prisma`, `menu-resource.prisma`를
  패키지에 함께 배포하여 호스트 앱 스키마에 병합 가능.
- **훅(Hooks)** — `useAdminForm`, `useAdminList`, `useImageDropZone` 등 어드민
  UX 패턴용 훅.
- **다중 subpath exports** — `@withwiz/academic-affairs/components/AdminShell`,
  `/infrastructure/middleware`, `/attendance` 등 트리쉐이킹에 최적화된 세분화된
  진입점.

## 기술 스택

- **언어**: TypeScript 5.9
- **런타임 대상**: Next.js ≥ 15, React ≥ 18
- **빌드**: [tsup](https://tsup.egoist.dev/) (ESM + CJS + d.ts)
- **테스트**: [Vitest](https://vitest.dev/) + Testing Library + jsdom
- **DB**: [Prisma](https://www.prisma.io/)
- **검증**: [Zod](https://zod.dev/)
- **에디터**: [Tiptap](https://tiptap.dev/) v3
- **가상화**: [@tanstack/react-virtual](https://tanstack.com/virtual)
- **달력**: [korean-lunar-calendar](https://github.com/usingsky/korean-lunar-calendar-node)
- **기반 패키지**: [`@withwiz/toolkit`](https://github.com/greeun/withwiz-toolkit) (auth, JWT, 미들웨어)

## 설치

```bash
# pnpm (권장)
pnpm add @withwiz/academic-affairs

# npm
npm install @withwiz/academic-affairs

# yarn
yarn add @withwiz/academic-affairs
```

호스트 앱에 함께 설치해야 하는 peer dependency:

```bash
pnpm add next react @withwiz/toolkit zod
# optional: sonner (토스트 알림용)
pnpm add sonner
```

> **참고**: 이 패키지는 현재 workspace 내부에서 개발 중이며 `@withwiz/toolkit`을
> `file:` 의존성으로 참조합니다. 외부에서 빌드하려면 `>=0.7.0-rc.0` 조건을
> 만족하는 `@withwiz/toolkit` 배포 버전이 필요합니다.

## 사용법

### 1. AdminShell 레이아웃 마운트

```tsx
// app/admin/layout.tsx
import AdminShell from "@withwiz/academic-affairs/components/AdminShell";
import "@withwiz/academic-affairs/styles/admin.css";

const config = {
  brand: { name: "우리 학교", shortName: "MS", homeUrl: "/" },
  auth:  { meEndpoint: "/api/auth/me", logoutEndpoint: "/api/auth/logout", loginPath: "/admin/login" },
  navigation: [
    { href: "/admin/students",   label: "학생",   shortLabel: "학생" },
    { href: "/admin/attendance", label: "출결",   shortLabel: "출결" },
    { href: "/admin/calendar",   label: "학사일정", shortLabel: "일정" },
  ],
  theme: { accentColor: "#D4AF37" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell config={config}>{children}</AdminShell>;
}
```

### 2. 인증 래퍼로 API 라우트 구성

생성된 모든 핸들러는 `(req, actor, props)`를 받으며 **반드시** 래퍼로 감싸야 합니다. `withAdminApi`가
없으면 `createAcademicSystem`이 예외를 던지므로 인증 없이 노출되는 경로는 없습니다. 패키지 RBAC
(`createSchoolAffairs(...).rbac` 또는 `createMenuApi`)로 래퍼를 만들면 menuKey 권한이 함께 검사됩니다:

```ts
// lib/academic.ts
import { createSchoolAffairs } from "@withwiz/academic-affairs/facade";
import { createAcademicSystem } from "@withwiz/academic-affairs/handlers";

const affairs = createSchoolAffairs({ prisma, auth, rbac: { menuKeys: ["students", "attendance"] } });

export const academic = createAcademicSystem({
  prisma,
  domains: { student: true, attendance: true },
  // 이 시스템의 핸들러는 "students" menuKey 권한으로 보호됩니다.
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

`@withwiz/toolkit`의 `withAdminApi`로 인증하는 경우에는 `adaptContextWrapper`로 연결합니다. 이 함수는
JWT 사용자를 `StaffActor`로 변환하고, 역할이 없는 사용자는 거부합니다:

```ts
import { withAdminApi } from "@withwiz/academic-affairs/infrastructure/middleware";
import { adaptContextWrapper } from "@withwiz/academic-affairs/handlers";

const wrapper = adaptContextWrapper(withAdminApi as never, (user) => auth.getStaffByUserId(user.id));
```

목록 엔드포인트는 `page`, `limit`(최대 200), `sortBy`를 받으며, 잘못된 필터는 `400`을 반환합니다.

### 3. 도메인 서비스 직접 사용

```ts
import { attendanceService } from "@withwiz/academic-affairs/services";
import {
  buildClassDayPlan,
  sanitizeGuardianPhone,
} from "@withwiz/academic-affairs/attendance";
```

### 4. Prisma 스키마 병합

패키지에는 `prisma/academic.prisma`, `prisma/rbac.prisma`,
`prisma/menu-resource.prisma`가 포함되어 있습니다. 호스트 애플리케이션의 Prisma
스키마에 복사하거나 include한 뒤 평소대로 `prisma generate` / `prisma migrate`를
실행하면 됩니다.

## 패키지 구조

```
@withwiz/academic-affairs/
├── src/
│   ├── components/      # AdminShell, AdminManagerBase, 이미지 업로드, 토글, 네비
│   ├── hooks/           # useAdminForm, useAdminList, useImageDropZone
│   ├── services/        # staff, student, attendance, counseling, admission, ...
│   ├── handlers/        # createAcademicSystem 팩토리 + 도메인별 핸들러
│   ├── infrastructure/  # prisma 클라이언트 + 미들웨어 래퍼
│   ├── types/           # 공용 타입 정의
│   ├── utils/           # adminFetch, api-response, cn, date, academic-year, holidays
│   ├── validators/      # 도메인별 Zod 스키마
│   ├── errors/          # 에러 클래스
│   ├── auth/            # 학사 인증 헬퍼
│   ├── facade/          # 고수준 파사드
│   ├── rbac/            # 역할/권한 기본 요소
│   ├── presets/         # 설정 프리셋
│   ├── counseling/      # 상담 도메인 헬퍼
│   ├── scheduling/      # 스케줄링 헬퍼
│   ├── attendance/      # 출결 헬퍼 (날짜 규칙, 수업일 계획 등)
│   └── styles/          # admin.css
├── prisma/              # academic.prisma, rbac.prisma, menu-resource.prisma
└── __tests__/           # vitest 단위 테스트
```

## 스크립트

```bash
pnpm build         # tsup 빌드 (ESM + CJS + d.ts) → dist/
pnpm test          # vitest 단발 실행 (CI 모드)
pnpm test:watch    # vitest watch 모드
```

## 라이선스

[MIT](./LICENSE)
