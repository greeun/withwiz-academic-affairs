# @withwiz/academic-affairs 패키지 설계

## 개요

학교/학사관리용 범용 어드민 패키지. `@withwiz/pms`(Performance Management System)의 구조를 따르되, 학사관리 도메인에 특화. AdminShell 네비게이션을 config 주입 방식으로 설계하여 여러 학교 프로젝트에서 재사용 가능.

**접근 방식**: Monolithic (하나의 패키지에 모든 기능 포함)

**의존성**: `@withwiz/toolkit` (인증, 미들웨어, JWT)를 기반으로 동작

**블로그/뉴스 제외**: 별도 `@withwiz/blog-system` + `@withwiz/blog-core` 사용

## 패키지 구조

```
@withwiz/academic-affairs/
├── src/
│   ├── components/
│   │   ├── AdminShell.tsx
│   │   ├── AdminShellConfig.ts
│   │   ├── AdminManagerBase.tsx
│   │   ├── AdminManagerConfig.ts
│   │   ├── ImageDropUpload.tsx
│   │   ├── ToggleSwitch.tsx
│   │   ├── image-drop-zone.css
│   │   ├── toggle-switch.css
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAdminForm.ts
│   │   ├── useAdminList.ts
│   │   ├── useImageDropZone.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── base-service.ts
│   │   ├── staff.service.ts
│   │   ├── academic-calendar.service.ts
│   │   ├── faq.service.ts
│   │   ├── student.service.ts
│   │   ├── attendance.service.ts
│   │   ├── counseling.service.ts
│   │   ├── admission.service.ts
│   │   └── index.ts
│   ├── handlers/
│   │   ├── staff.handler.ts
│   │   ├── academic-calendar.handler.ts
│   │   ├── faq.handler.ts
│   │   ├── student.handler.ts
│   │   ├── attendance.handler.ts
│   │   ├── counseling.handler.ts
│   │   ├── admission.handler.ts
│   │   ├── dashboard.handler.ts
│   │   └── index.ts
│   ├── infrastructure/
│   │   ├── prisma.ts
│   │   ├── middleware/
│   │   │   ├── wrappers.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── styles/
│   │   └── admin.css
│   ├── prisma/
│   │   └── academic.prisma
│   ├── types/
│   │   ├── common.ts
│   │   ├── staff.ts
│   │   ├── academic-calendar.ts
│   │   ├── faq.ts
│   │   ├── student.ts
│   │   ├── attendance.ts
│   │   ├── counseling.ts
│   │   ├── admission.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── admin-fetch.ts
│   │   ├── api-response.ts
│   │   ├── cn.ts
│   │   ├── date.ts
│   │   └── index.ts
│   ├── validators/
│   │   ├── staff.validator.ts
│   │   ├── academic-calendar.validator.ts
│   │   ├── faq.validator.ts
│   │   ├── student.validator.ts
│   │   ├── attendance.validator.ts
│   │   ├── counseling.validator.ts
│   │   ├── admission.validator.ts
│   │   └── index.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Exports

```json
{
  ".": "전체 re-export",
  "./components": "AdminShell, AdminManagerBase, ImageDropUpload, ToggleSwitch",
  "./components/AdminShell": "AdminShell만 직접 import용",
  "./hooks": "useAdminForm, useAdminList, useImageDropZone",
  "./services": "모든 도메인 서비스",
  "./handlers": "createAcademicSystem 팩토리 + 핸들러",
  "./infrastructure": "prisma, middleware wrappers",
  "./infrastructure/middleware": "withPublicApi, withAdminApi, withAuthApi",
  "./types": "모든 타입 정의",
  "./utils": "adminFetch, apiResponse, cn, date",
  "./utils/admin-fetch": "adminFetch만 직접 import용",
  "./validators": "zod 검증 스키마",
  "./styles/admin.css": "어드민 CSS"
}
```

## AdminShell (설정 가능한 사이드바 레이아웃)

### AdminShellConfig

```typescript
interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon?: React.ReactNode;
}

interface AdminShellConfig {
  brand: {
    name: string;
    shortName?: string;
    homeUrl: string;
  };
  auth: {
    meEndpoint: string;
    logoutEndpoint: string;
    loginPath: string;
  };
  navigation: NavItem[];
  theme?: {
    accentColor?: string;  // 기본값: "#D4AF37"
  };
}
```

### 동작

- 사이드바 리사이즈 (드래그), 접기/펼치기, 모바일 햄버거 메뉴
- 인증 체크: `auth.meEndpoint`로 GET 요청, 실패 시 `auth.loginPath`로 리다이렉트
- 로그아웃: `auth.logoutEndpoint`로 POST 요청 후 localStorage 토큰 제거
- 로그인 페이지(`auth.loginPath`)에서는 사이드바 숨김, children만 렌더링
- `brand.name` + "Admin" 로고 표시, `brand.homeUrl`로 사이트 보기 링크

### 사용 예시

```tsx
// src/app/admin/layout.tsx
import AdminShell from "@withwiz/academic-affairs/components/AdminShell";
import "@withwiz/academic-affairs/styles/admin.css";

const config: AdminShellConfig = {
  brand: { name: "예룸예술학교", shortName: "예룸", homeUrl: "/" },
  auth: {
    meEndpoint: "/api/auth/me",
    logoutEndpoint: "/api/auth/logout",
    loginPath: "/admin/login",
  },
  navigation: [
    { href: "/admin/dashboard", label: "대시보드", shortLabel: "D" },
    { href: "/admin/blog", label: "블로그", shortLabel: "B" },
    { href: "/admin/news", label: "공지사항", shortLabel: "N" },
    { href: "/admin/staff", label: "교직원", shortLabel: "직" },
    { href: "/admin/schedule", label: "학사일정", shortLabel: "일" },
    { href: "/admin/faq", label: "FAQ", shortLabel: "?" },
    { href: "/admin/settings", label: "설정", shortLabel: "S" },
    { href: "/admin/docs", label: "도움말", shortLabel: "?" },
  ],
};

export default function AdminLayout({ children }) {
  return <AdminShell config={config}>{children}</AdminShell>;
}
```

## Prisma 스키마

### Staff (교직원)

```prisma
model Staff {
  id          String   @id @default(cuid())
  name        String
  nameEn      String?
  role        String
  department  String?
  phone       String?
  email       String?
  photoUrl    String?
  bio         String?  @db.Text
  sortOrder   Int      @default(0)
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### AcademicCalendar (학사일정 — 수업시간표 + 학사이벤트)

```prisma
model Timetable {
  id          String   @id @default(cuid())
  title       String
  year        Int
  semester    Int
  schoolLevel String
  fileUrl     String?
  content     String?  @db.Text
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AcademicEvent {
  id          String            @id @default(cuid())
  title       String
  startDate   DateTime
  endDate     DateTime?
  type        AcademicEventType
  schoolLevel String?
  description String?           @db.Text
  isAllDay    Boolean           @default(true)
  color       String?
  isPublished Boolean           @default(true)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

enum AcademicEventType {
  SEMESTER_START
  SEMESTER_END
  EXAM
  VACATION
  HOLIDAY
  EVENT
  FIELD_TRIP
  PARENT_MEETING
  OTHER
}
```

### FAQ

```prisma
model FaqCategory {
  id        String   @id @default(cuid())
  name      String
  order     Int      @default(0)
  faqs      Faq[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Faq {
  id         String       @id @default(cuid())
  question   String
  answer     String       @db.Text
  categoryId String?
  category   FaqCategory? @relation(fields: [categoryId], references: [id])
  order      Int          @default(0)
  isPublished Boolean     @default(true)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}
```

### Student (학생)

```prisma
model Student {
  id          String        @id @default(cuid())
  name        String
  grade       Int
  classGroup  String?
  birthDate   DateTime?
  phone       String?
  parentPhone String?
  parentName  String?
  enrolledAt  DateTime      @default(now())
  status      StudentStatus @default(ACTIVE)
  notes       String?       @db.Text
  attendances Attendance[]
  counselings Counseling[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum StudentStatus {
  ACTIVE
  ON_LEAVE
  GRADUATED
  WITHDRAWN
}
```

### Attendance (출결)

```prisma
model Attendance {
  id        String           @id @default(cuid())
  studentId String
  student   Student          @relation(fields: [studentId], references: [id], onDelete: Cascade)
  date      DateTime
  status    AttendanceStatus
  reason    String?
  createdAt DateTime         @default(now())

  @@unique([studentId, date])
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EARLY_LEAVE
  EXCUSED
}
```

### Counseling (상담)

```prisma
model Counseling {
  id          String           @id @default(cuid())
  studentId   String?
  student     Student?         @relation(fields: [studentId], references: [id])
  counselorId String?
  type        CounselingType
  date        DateTime
  title       String
  content     String           @db.Text
  parentName  String?
  parentPhone String?
  status      CounselingStatus @default(SCHEDULED)
  notes       String?          @db.Text
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

enum CounselingType {
  INITIAL
  REGULAR
  EMERGENCY
  PARENT
  ADMISSION
}

enum CounselingStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

### Admission (입학 설명회)

```prisma
model AdmissionSession {
  id            String                  @id @default(cuid())
  title         String
  date          DateTime
  location      String?
  capacity      Int                     @default(30)
  description   String?                 @db.Text
  isOpen        Boolean                 @default(true)
  registrations AdmissionRegistration[]
  createdAt     DateTime                @default(now())
  updatedAt     DateTime                @updatedAt
}

model AdmissionRegistration {
  id            String             @id @default(cuid())
  sessionId     String
  session       AdmissionSession   @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  applicantName String
  phone         String
  email         String?
  studentName   String
  studentGrade  String?
  message       String?
  status        RegistrationStatus @default(PENDING)
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt

  @@unique([sessionId, phone])
}

enum RegistrationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  ATTENDED
}
```

## 서비스 계층

### 공통 패턴

모든 서비스는 PrismaClient를 주입받고, 동일한 CRUD 인터페이스:

```typescript
class DomainService {
  constructor(private prisma: PrismaClient) {}
  list(params: ListParams & DomainFilters): Promise<PaginatedResult<T>>
  getById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
  getStats(): Promise<DomainStats>
}
```

### 도메인별 서비스

| 서비스 | 추가 메서드 |
|--------|------------|
| StaffService | `reorder(ids: string[])` |
| AcademicCalendarService | `getActiveTimetables()`, `getMonthlyEvents(year, month)`, `getYearlyEvents(year)` |
| FaqService | `reorder(ids: string[])`, `listCategories()`, `createCategory()`, `updateCategory()`, `deleteCategory()`, `reorderCategories()` |
| StudentService | `getByGrade(grade: number)`, `updateStatus(id, status)` |
| AttendanceService | `bulkCreate(records: AttendanceRecord[])`, `getDailyReport(date)`, `getStudentReport(studentId, startDate, endDate)` |
| CounselingService | `getUpcoming()`, `getByStudent(studentId)` |
| AdmissionService | `listSessions()`, `listRegistrations(sessionId)`, `updateRegistrationStatus(id, status)`, `getOpenSessions()`, `register(sessionId, data)` |

## API Route Handlers (팩토리 패턴)

### createAcademicSystem

```typescript
import { createAcademicSystem } from "@withwiz/academic-affairs";

const academic = createAcademicSystem({
  prisma,
  domains: {
    staff: true,
    academicCalendar: true,
    faq: true,
    student: true,
    attendance: true,
    counseling: true,
    admission: true,
  },
});

// 사용: 각 API route에서 해당 handler를 re-export
// GET /api/admin/staff → academic.handlers.staff.list.GET
// POST /api/admin/staff → academic.handlers.staff.list.POST
// GET /api/admin/staff/[id] → academic.handlers.staff.detail.GET
// PUT /api/admin/staff/[id] → academic.handlers.staff.detail.PUT
// DELETE /api/admin/staff/[id] → academic.handlers.staff.detail.DELETE
```

### Handler 내부

각 handler는 toolkit의 `withAdminApi`로 래핑:
- 인증 자동 처리 (Bearer 토큰 검증)
- 에러 핸들링 (400/401/403/404/500)
- 응답 형식: `{ success: boolean, data?: T, error?: { message, code } }`

## Utils

### adminFetch

```typescript
// toolkit의 JWT 기반 인증 fetch
// - localStorage에서 accessToken 읽어서 Authorization: Bearer 헤더 첨부
// - 401 응답 시 refreshToken으로 갱신 시도
// - 갱신 실패 시 /admin/login으로 리다이렉트
export async function adminFetch(url: string, options?: RequestInit): Promise<Response>
```

### apiResponse

```typescript
// NextApiResponse 헬퍼 클래스 (pms와 동일)
NextApiResponse.success(data, status?)
NextApiResponse.paginated(items, page, pageSize, total)
NextApiResponse.created(data)
NextApiResponse.noContent()
NextApiResponse.error(message, status?, code?)
NextApiResponse.notFound(message?)
NextApiResponse.unauthorized(message?)
NextApiResponse.forbidden(message?)
NextApiResponse.serverError(message?)
```

## admin.css

pms의 `admin.css`를 기반으로 패키지에 포함. 다음 섹션 포함:
- 사이드바 레이아웃 (`.admin-layout`, `.admin-sidebar`, `.admin-main`)
- 사이드바 접기/펼치기, 리사이즈
- 모바일 반응형 (햄버거 메뉴, 오버레이)
- 페이지 헤더, 버튼, 테이블, 배지
- 폼, 탭, 체크박스
- 이미지 업로드, 에디터
- 로그인 페이지
- 인증 로딩 상태

프로젝트에서는 `import "@withwiz/academic-affairs/styles/admin.css"` 한 줄로 사용.

## Validators (zod)

각 도메인별 zod 스키마:

```typescript
// 예: staff.validator.ts
export const createStaffSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  department: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const updateStaffSchema = createStaffSchema.partial();
```

## package.json

```json
{
  "name": "@withwiz/academic-affairs",
  "version": "0.1.0",
  "description": "Academic Affairs Management System - 학사관리 어드민 프레임워크",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "peerDependencies": {
    "@withwiz/toolkit": ">=0.5.0",
    "next": ">=15",
    "react": ">=18",
    "sonner": ">=2",
    "zod": ">=3"
  },
  "dependencies": {
    "@tiptap/core": "^3.0.0",
    "@tiptap/react": "^3.0.0"
  }
}
```

## 프로젝트 통합 (yeroom 기준)

1. package.json에 의존성 추가: `"@withwiz/academic-affairs": "file:../../../node-packages/withwiz-academic-affairs"`
2. Prisma 스키마에 모델 추가 (패키지의 `prisma/academic.prisma` 참조하여 복사)
3. `src/lib/academic-config.ts`에서 `createAcademicSystem()` 호출
4. `src/lib/admin-config.ts`에서 AdminShellConfig 정의
5. `src/app/admin/layout.tsx`에서 AdminShell 사용
6. 각 API route에서 handler re-export
7. 각 admin 페이지에서 서비스/훅 사용
