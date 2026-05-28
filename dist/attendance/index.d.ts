import { z } from 'zod';

/**
 * S4/S5 — 학교급 short/long labels. S5-d 에서 ClassKey-기반 `formatClassLabel` 은
 * 제거되었다 (호출자 없음). `SCHOOL_LEVEL_SHORT` 기반의 학년 라벨 (예: `초5`,
 * `중1`, `고2`) 만 UI 에서 사용한다.
 */
type SchoolLevel$2 = any;
declare const SCHOOL_LEVEL_SHORT: Record<SchoolLevel$2, "초" | "중" | "고">;
declare const SCHOOL_LEVEL_LONG: Record<SchoolLevel$2, string>;
declare function formatSchoolLevel(level: SchoolLevel$2): "초" | "중" | "고";

declare function sanitizeFilename(name: string): string;
/**
 * RFC 6266 percent-encoding for `Content-Disposition: filename*=UTF-8''...`.
 * Encodes UTF-8 bytes per RFC 8187 (token chars left alone).
 */
declare function encodeRfc5987(value: string): string;

/**
 * Attendance daily input — date classification helpers.
 *
 * - All comparisons are done on the local date string (YYYY-MM-DD) in KST.
 *   AttendanceEntry.date and AcademicSchedule.startDate/endDate are stored as
 *   PostgreSQL DATE (no time component). Avoid Date-arithmetic surprises by
 *   sticking to string compare for the same-day check.
 * - `HOLIDAY` and `VACATION` schedules → "holiday" (block input + excluded from
 *    수업일수). EVENT/EXAM/FIELD_TRIP/OTHER stay as schoolday — including
 *   FIELD_TRIP which here means "school event going off-site", attendance is
 *   still recorded (체험학습 코드는 학생별 entry로 별도 처리).
 * - S5-b: `schoolLevel` 인자가 주어지면 AcademicSchedule.schoolLevel === null
 *   (전교 공용) OR schoolLevel 일치인 row만 매칭한다. null/undefined 이면
 *   schoolLevel-별 row 는 무시하고 전교 공용만 매칭한다.
 */
type ScheduleType = any;
type SchoolLevel$1 = any;
type DayType = "schoolday" | "weekend" | "holiday";
interface ScheduleLike {
    title: string;
    startDate: Date;
    endDate: Date | null;
    scheduleType: ScheduleType;
    /** S5-b: null = 전교 공용, 값 = 해당 학교급에만 적용. */
    schoolLevel?: SchoolLevel$1 | null;
}
interface DayClassification {
    dayType: DayType;
    label: string;
}
/** Format a Date (treated as KST midnight) to YYYY-MM-DD. */
declare function toDateOnlyString(d: Date): string;
/** Parse YYYY-MM-DD into a UTC-midnight Date (matches Prisma @db.Date storage). */
declare function parseDateOnly(s: string): Date;
/** Return KST 'today' as YYYY-MM-DD. */
declare function todayKstString(): string;
/**
 * Classify a date against the schedule list.
 * @param date 분류 대상 날짜 (UTC midnight Date).
 * @param schedules 해당 날짜를 덮을 수 있는 HOLIDAY/VACATION 스케줄 목록.
 *                  schoolLevel 컬럼이 포함된 row만 의미가 있으나, 누락된 row(undefined)
 *                  도 전교 공용으로 해석한다.
 * @param schoolLevel 학생의 학교급. 주어지면 (schedule.schoolLevel === null OR === schoolLevel)
 *                    만 매칭. null/undefined 이면 전교 공용 row만 매칭.
 */
declare function classifyDate(date: Date, schedules: ScheduleLike[], schoolLevel?: SchoolLevel$1 | null): DayClassification;

/**
 * 보호자 전화번호 정규화.
 *
 * 입력에서 숫자만 추출한 뒤 국내 전화번호 패턴(휴대 01x, 서울 02, 그 외 지역 03x~06x)으로
 * 매칭하여 하이픈 포함 정규형으로 반환한다. 매칭 실패 시 null.
 *
 * - 휴대(01x): 10~11자리 → `01X-XXXX-XXXX` (가운데 3~4자리)
 * - 서울(02):  9~10자리 → `02-XXX-XXXX` 또는 `02-XXXX-XXXX`
 * - 지역(0XX, XX∈[31..64]): 10~11자리 → `0XX-XXX-XXXX` 또는 `0XX-XXXX-XXXX`
 */
declare function normalizeKoreanPhone(input: string): string | null;

/**
 * Sprint 3 — monthly attendance aggregation for notifications.
 *
 * Produces:
 * - `counts`: 16 cells keyed `${aggregateCategory}_${aggregateReason}`.
 *   `EXPERIENCE_LEARNING` is naturally folded into `ABSENT_AUTHORIZED` because
 *   its aggregateCategory/aggregateReason are set so in the seed.
 * - `drafts`: 16 cells of auto-draft text built from entries' code displayName
 *   + memo. Tokens joined by **two spaces** (Sprint 3 contract Q9 + amendment
 *   (h)). Tokens are NOT date-collapsed (one entry → one token).
 *
 * Invariant (amendment (n)): each AttendanceEntry contributes to exactly ONE
 * of the 16 cells. EXPERIENCE_LEARNING never appears in 2 cells.
 */
declare const CATEGORIES: readonly ["ABSENT", "LATE", "EARLY_LEAVE", "RESULT"];
declare const REASONS: readonly ["SICK", "UNAUTH", "OTHER", "AUTHORIZED"];
type CategoryKey = (typeof CATEGORIES)[number];
type ReasonKey = (typeof REASONS)[number];
type CellKey = `${CategoryKey}_${ReasonKey}`;
declare const CELL_KEYS: CellKey[];
declare function makeEmptyCounts(): Record<CellKey, number>;
declare function makeEmptyDrafts(): Record<CellKey, string>;
interface EntryWithCode {
    date: Date;
    memo: string | null;
    code: {
        aggregateCategory: CategoryKey;
        aggregateReason: ReasonKey;
        displayName: string;
    };
}
interface AggregateResult {
    counts: Record<CellKey, number>;
    drafts: Record<CellKey, string>;
}
/**
 * Aggregate one student's entries for a calendar (year, month).
 * Caller must pre-filter to a single student and the desired month.
 */
declare function aggregateEntries(entries: EntryWithCode[]): AggregateResult;
/**
 * Validate that an arbitrary record has exactly the 16 expected keys and no
 * extras. Returns null on success or an error message.
 */
declare function validateCellKeySet(obj: Record<string, unknown>): string | null;
/**
 * Resolve the final per-cell display text for a notification.
 * Sprint 3 amendment (f): whitespace-only override == draft.
 */
declare function resolveCellTexts(drafts: Record<CellKey, string>, override: Partial<Record<CellKey, string>> | null | undefined): Record<CellKey, string>;

/**
 * Shared zod schemas for the daily attendance API.
 *
 * Concurrency: GET returns `snapshotAt` (server-side ISO timestamp); POST echoes
 * it back. The server compares `max(entry.updatedAt, history.changedAt)` for
 * every affected (studentId, date) against `snapshotAt` and returns 409 if any
 * row is newer. Future-date input is rejected server-side (KST today is the cap).
 *
 * S5-b: 4-튜플 키 (academicYear/schoolLevel/yeroomGrade/yeroomClass) 제거 →
 * `classGroupId` 단일 키. 레거시 키가 본문/쿼리에 섞여 오면 422 + 명시적 마이그레이션
 * 메시지로 거부한다. UI 마이그레이션이 끝날 때까지 "silent fallback"은 금지.
 */

/** S5-b: 레거시 4-튜플 키들. 검출되면 명시적 마이그레이션 메시지로 거부한다. */
declare const LEGACY_ENTRY_KEYS: readonly ["academicYear", "schoolLevel", "yeroomGrade", "yeroomClass"];
declare const LEGACY_KEY_MESSAGE = "S5: classGroupId only \u2014 4-\uD29C\uD50C \uD0A4(academicYear/schoolLevel/yeroomGrade/yeroomClass)\uB294 \uB354 \uC774\uC0C1 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
/**
 * Returns the legacy key names present in the given record, or null if none.
 * Used by route handlers to short-circuit with a 422 migration message before
 * the schema parse layer reports a generic "Unrecognized key" error.
 */
declare function detectLegacyEntryKeys(source: Record<string, unknown> | URLSearchParams): string[] | null;
declare const entryListQuerySchema: z.ZodObject<{
    date: z.ZodString;
    classGroupId: z.ZodString;
}, z.core.$strict>;
type EntryListQuery = z.infer<typeof entryListQuerySchema>;
declare const entryChangeSchema: z.ZodObject<{
    studentId: z.ZodString;
    codeId: z.ZodNullable<z.ZodString>;
    memo: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
}, z.core.$strip>;
type EntryChange = z.infer<typeof entryChangeSchema>;
declare const entryBulkUpsertSchema: z.ZodObject<{
    date: z.ZodString;
    classGroupId: z.ZodString;
    snapshotAt: z.ZodISODateTime;
    changes: z.ZodArray<z.ZodObject<{
        studentId: z.ZodString;
        codeId: z.ZodNullable<z.ZodString>;
        memo: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    }, z.core.$strip>>;
}, z.core.$strict>;
type EntryBulkUpsertInput = z.infer<typeof entryBulkUpsertSchema>;

/**
 * 출결관리 - 학생(Student) zod 검증 스키마.
 * 클라이언트 폼과 서버 라우트가 동일한 모듈을 import 해서 동일 규칙을 보장한다.
 *
 * S5-d: 4-튜플 키(`yeroomGrade`/`yeroomClass`/`homeroomStaffId`/`assistantHomeroomStaffId`) 제거.
 *   - `classGroupId` (반 그룹 FK), `grade` (학년), `personId|name+birthdate`(인물 연결) 기반.
 *   - 담임/부담임은 ClassGroup 에 부착되므로 학생 폼에서 제거됨.
 */

declare const schoolLevelSchema: z.ZodEnum<{
    ELEMENTARY: "ELEMENTARY";
    MIDDLE: "MIDDLE";
    HIGH: "HIGH";
}>;
type SchoolLevelInput = z.infer<typeof schoolLevelSchema>;
/**
 * Base shape — used by both create (with refine) and update (partial, no refine —
 * server merges + re-validates).
 */
declare const studentBaseFields: z.ZodObject<{
    personId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    birthdate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    academicYear: z.ZodNumber;
    classGroupId: z.ZodString;
    schoolLevel: z.ZodEnum<{
        ELEMENTARY: "ELEMENTARY";
        MIDDLE: "MIDDLE";
        HIGH: "HIGH";
    }>;
    grade: z.ZodNumber;
    yeroomNumber: z.ZodNullable<z.ZodNumber>;
    homeSchoolName: z.ZodString;
    homeSchoolGrade: z.ZodNumber;
    homeSchoolClass: z.ZodNumber;
    homeSchoolNumber: z.ZodNumber;
    consignmentStartDate: z.ZodString;
    isActive: z.ZodOptional<z.ZodBoolean>;
    guardian1Name: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    guardian1Phone: z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>, z.ZodTransform<string | null, string | null>>;
    guardian1Relation: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    guardian2Name: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    guardian2Phone: z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>, z.ZodTransform<string | null, string | null>>;
    guardian2Relation: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
}, z.core.$strip>;
type StudentBaseFields = z.infer<typeof studentBaseFields>;
interface CrossFieldIssue {
    path: ReadonlyArray<string>;
    message: string;
}
/** S5-d: 학교급 ↔ 학년 범위 검증 (담임/부담임은 ClassGroup 에서 관리). */
declare function validateStudentCrossFields(data: {
    schoolLevel?: SchoolLevelInput;
    grade?: number;
}): CrossFieldIssue[];
declare const studentCreateSchema: z.ZodObject<{
    personId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    birthdate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    academicYear: z.ZodNumber;
    classGroupId: z.ZodString;
    schoolLevel: z.ZodEnum<{
        ELEMENTARY: "ELEMENTARY";
        MIDDLE: "MIDDLE";
        HIGH: "HIGH";
    }>;
    grade: z.ZodNumber;
    yeroomNumber: z.ZodNullable<z.ZodNumber>;
    homeSchoolName: z.ZodString;
    homeSchoolGrade: z.ZodNumber;
    homeSchoolClass: z.ZodNumber;
    homeSchoolNumber: z.ZodNumber;
    consignmentStartDate: z.ZodString;
    isActive: z.ZodOptional<z.ZodBoolean>;
    guardian1Name: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    guardian1Phone: z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>, z.ZodTransform<string | null, string | null>>;
    guardian1Relation: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    guardian2Name: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    guardian2Phone: z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>, z.ZodTransform<string | null, string | null>>;
    guardian2Relation: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
}, z.core.$strip>;
type StudentCreateInput = z.infer<typeof studentCreateSchema>;
/**
 * Partial schema for PUT. NO refines — the route handler fetches the current
 * row, merges with the patch, and runs `validateStudentCrossFields` server-side.
 */
declare const studentUpdateSchema: z.ZodObject<{
    personId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    name: z.ZodOptional<z.ZodString>;
    birthdate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    academicYear: z.ZodOptional<z.ZodNumber>;
    classGroupId: z.ZodOptional<z.ZodString>;
    schoolLevel: z.ZodOptional<z.ZodEnum<{
        ELEMENTARY: "ELEMENTARY";
        MIDDLE: "MIDDLE";
        HIGH: "HIGH";
    }>>;
    grade: z.ZodOptional<z.ZodNumber>;
    yeroomNumber: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    homeSchoolName: z.ZodOptional<z.ZodString>;
    homeSchoolGrade: z.ZodOptional<z.ZodNumber>;
    homeSchoolClass: z.ZodOptional<z.ZodNumber>;
    homeSchoolNumber: z.ZodOptional<z.ZodNumber>;
    consignmentStartDate: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    guardian1Name: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>>;
    guardian1Phone: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>, z.ZodTransform<string | null, string | null>>>;
    guardian1Relation: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>>;
    guardian2Name: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>>;
    guardian2Phone: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>, z.ZodTransform<string | null, string | null>>>;
    guardian2Relation: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>>;
}, z.core.$strip>;
type StudentUpdateInput = z.infer<typeof studentUpdateSchema>;
/**
 * 슬롯별 보호자 검증: 이름·연락처·관계 중 하나라도 입력되면 이름은 필수.
 * 두 슬롯 모두 비어 있으면 통과.
 */
declare function validateGuardianSlots(data: {
    guardian1Name?: string | null;
    guardian1Phone?: string | null;
    guardian1Relation?: string | null;
    guardian2Name?: string | null;
    guardian2Phone?: string | null;
    guardian2Relation?: string | null;
}): CrossFieldIssue[];
/** Build a complete object for cross-field re-validation. */
declare function mergeStudentForCrossField(existing: {
    schoolLevel: SchoolLevelInput;
    grade: number;
}, patch: {
    schoolLevel?: SchoolLevelInput;
    grade?: number;
}): {
    schoolLevel: SchoolLevelInput;
    grade: number;
};
/** Prisma Date 객체를 YYYY-MM-DD 문자열로 직렬화. */
declare function formatDateOnly(d: Date): string;
/** Unicode NFC 정규화 — 검색·중복 검사 일관성. */
declare function normalizeName(name: string): string;

/**
 * Sprint 3 — zod schemas for the notification API.
 */

declare const notificationListQuerySchema: z.ZodObject<{
    year: z.ZodCoercedNumber<unknown>;
    month: z.ZodCoercedNumber<unknown>;
    classGroupId: z.ZodString;
}, z.core.$strip>;
declare const notificationBulkZipQuerySchema: z.ZodObject<{
    year: z.ZodCoercedNumber<unknown>;
    month: z.ZodCoercedNumber<unknown>;
    classGroupId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * PUT override schema — full 16-cell text map, optional classDaysOverride
 * (with required reason), optional issueDate.
 */
declare const overridePutSchema: z.ZodObject<{
    categoryTexts: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    classDaysOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    overrideReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    issueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type OverridePutInput = z.infer<typeof overridePutSchema>;

declare const DAY_TYPES: readonly ["CLASS", "HOLIDAY", "DISCRETIONARY_HOLIDAY", "OTHER_HOLIDAY", "EXAM", "FIELD_TRIP", "EVENT", "VACATION"];
type ClassDayType = (typeof DAY_TYPES)[number];
declare const DAY_TYPE_LABELS: Record<ClassDayType, string>;
declare const DAY_TYPE_SYMBOLS: Record<ClassDayType, string>;
declare const DAY_TYPE_COLORS: Record<ClassDayType, {
    text: string;
    bg: string;
}>;
declare const HOLIDAY_DAY_TYPES: ClassDayType[];
declare const CLASS_DAY_TYPES: ClassDayType[];
declare const classDayPlanCreateSchema: z.ZodObject<{
    academicYear: z.ZodNumber;
    semester: z.ZodEnum<{
        FIRST: "FIRST";
        SECOND: "SECOND";
    }>;
}, z.core.$strip>;
declare const classDayEntryUpdateSchema: z.ZodObject<{
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        dayType: z.ZodOptional<z.ZodEnum<{
            HOLIDAY: "HOLIDAY";
            VACATION: "VACATION";
            CLASS: "CLASS";
            DISCRETIONARY_HOLIDAY: "DISCRETIONARY_HOLIDAY";
            OTHER_HOLIDAY: "OTHER_HOLIDAY";
            EXAM: "EXAM";
            FIELD_TRIP: "FIELD_TRIP";
            EVENT: "EVENT";
        }>>;
        hours: z.ZodOptional<z.ZodNumber>;
        note: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
interface ClassDayEntryItem {
    id: string;
    date: string;
    dayType: ClassDayType;
    hours: number;
    note: string;
}
interface ClassDayPlanItem {
    id: string;
    academicYear: number;
    semester: string;
    entries: ClassDayEntryItem[];
    createdAt: string;
    updatedAt: string;
}
interface WeekRow {
    weekNum: number;
    month: number;
    days: (ClassDayEntryItem | null)[];
}
declare function groupEntriesByWeek(entries: ClassDayEntryItem[], _semesterStart?: Date): WeekRow[];
interface MonthSummary {
    month: number;
    classDays: number;
    totalHours: number;
    holidays: number;
    weeks: WeekRow[];
}
declare function calculateMonthSummaries(weeks: WeekRow[]): MonthSummary[];
declare function calculateWeekSummary(days: (ClassDayEntryItem | null)[]): {
    hours: number;
    classDays: number;
    holidays: number;
};

interface ClassGroupSummary {
    id: string;
    academicYear: number;
    name: string;
    sortOrder: number;
}
/** ClassGroup 단일 키 기반 access result. */
type GroupAccessResult = {
    kind: "all";
} | {
    kind: "restricted";
    groupIds: string[];
    groups: ClassGroupSummary[];
};
/**
 * Resolve the set of class groups the current user may read/write.
 *
 *  - SUPER_ADMIN (isSystem=true role) OR Role with RolePermission(menuKey="school.viewAll")
 *    → kind: "all" (no filter).
 *  - 다른 사용자: Staff 링크가 있고 본인이 (주/부)담임으로 매핑된 isActive=true ClassGroup
 *    이 있으면 그 그룹 id 집합을 반환. 그 외에는 빈 집합.
 *
 * Writes additionally require a Staff link (see getCurrentStaffId).
 */
declare function resolveAccessibleGroups(prisma: any, userId: string): Promise<GroupAccessResult>;
/** 접근 가능 여부 판정. SUPER_ADMIN("all")이면 항상 true. */
declare function isAccessibleGroupId(access: GroupAccessResult, groupId: string): boolean;

interface ScheduleRange {
    scheduleType: string;
    startDate: Date;
    endDate: Date | null;
}
interface ClassDaysAutoResult {
    /** Total weekdays (Mon-Fri) in the calendar month. */
    weekdays: number;
    /** Weekday count that falls within any HOLIDAY|VACATION range. */
    holidays: number;
    /** weekdays - holidays. */
    auto: number;
}
/**
 * Compute the auto class-day count for a calendar (year, month).
 *
 * NOTE: `year` here is the **calendar** year — callers must convert Korean
 * academic year + month into the corresponding calendar year before calling
 * (academic year 2025, month 2 ⇒ calendar 2026-02). The list/preview APIs do
 * that conversion explicitly.
 */
declare function computeClassDaysAuto(calendarYear: number, calendarMonth: number, schedules: ScheduleRange[]): ClassDaysAutoResult;
interface ResolveClassDaysInput {
    auto: number;
    override: number | null;
}
interface ResolveClassDaysResult {
    value: number;
    overridden: boolean;
}
/**
 * Single source-of-truth resolver — used by list view payload, preview
 * payload, and HWPX renderer (Sprint 3 amendment (e)).
 */
declare function resolveClassDaysEffective(input: ResolveClassDaysInput): ResolveClassDaysResult;
/**
 * Korean academic year → calendar year for a given month.
 * Months 3..12 stay in the same calendar year as the academic year.
 * Months 1..2 are the following calendar year (e.g., 학년도 2025 × 2월 = 2026-02).
 */
declare function academicYearToCalendarYear(academicYear: number, month: number): number;

/**
 * Resolve the logged-in user's Staff record.
 * - GET handlers: allowed to call this and treat `null` as "read-only" path.
 * - POST handlers: require a non-null result; return 403 otherwise.
 */
declare function getCurrentStaffId(prisma: any, userId: string): Promise<string | null>;

/**
 * Sprint 3 — Notification data loader.
 *
 * Reusable assembler for: list-view per-student payload, single preview,
 * single HWPX, and bulk ZIP. Loads student(s) + entries + override + schedules
 * with minimal queries and assembles 16-cell counts + drafts + class-day
 * resolution in memory.
 *
 * Lifted from host: prisma is accepted as the first argument for all DB functions.
 */

type SchoolLevel = any;
interface NotificationStudentRow {
    id: string;
    name: string;
    academicYear: number;
    schoolLevel: SchoolLevel;
    grade: number;
    yeroomNumber: number | null;
    classGroupId: string;
    classGroupName: string;
    homeSchoolName: string;
    homeSchoolGrade: number;
    homeSchoolClass: number;
    homeSchoolNumber: number;
    consignmentStartDate: Date;
    homeroomStaffName: string;
}
interface OverrideRecord {
    categoryTexts: Partial<Record<CellKey, string>>;
    classDaysOverride: number | null;
    overrideReason: string | null;
    issueDate: Date | null;
    updatedAt: Date;
    updatedById: string | null;
}
interface MonthDateRange {
    /** YYYY-MM-DD (calendar). */
    first: string;
    /** YYYY-MM-DD (calendar). */
    last: string;
    /** Date instances at UTC midnight. */
    firstDate: Date;
    lastDate: Date;
    calendarYear: number;
    calendarMonth: number;
}
declare function monthBounds(academicYear: number, month: number): MonthDateRange;
/**
 * Find HOLIDAY/VACATION schedules potentially overlapping a month.
 * Single small query.
 */
declare function loadMonthSchedules(prisma: any, range: MonthDateRange): Promise<ScheduleRange[]>;
/**
 * Parse the JSON `categoryTexts` field into a typed map. Unknown keys ignored.
 */
declare function parseCategoryTexts(raw: unknown): Partial<Record<CellKey, string>>;
declare function loadOverride(prisma: any, academicYear: number, month: number, studentId: string): Promise<OverrideRecord | null>;
declare function loadOverridesForStudents(prisma: any, academicYear: number, month: number, studentIds: string[]): Promise<Map<string, OverrideRecord>>;
interface NotificationStatusInput {
    override: OverrideRecord | null;
}
/**
 * Status badge: "초안" when override absent or all-empty; "편집됨" otherwise.
 * Override row存在 + (any non-empty categoryTexts value OR classDaysOverride !== null OR issueDate !== null) → 편집됨.
 */
declare function computeNotificationStatus(input: NotificationStatusInput): "초안" | "편집됨";
interface AssembleListItem {
    student: NotificationStudentRow;
    counts: Record<CellKey, number>;
    drafts: Record<CellKey, string>;
    classDays: {
        value: number;
        overridden: boolean;
        auto: number;
    };
    override: OverrideRecord | null;
    status: "초안" | "편집됨";
}
/**
 * S5-d: Assemble payloads for all students in a ClassGroup for a (year, month).
 * Caller must verify access to `classGroupId` before calling.
 */
declare function loadListData(prisma: any, input: {
    academicYear: number;
    month: number;
    classGroupId: string;
}): Promise<{
    classDaysAuto: number;
    items: AssembleListItem[];
    range: MonthDateRange;
}>;
/**
 * Per-student preview data.
 */
declare function loadStudentData(prisma: any, input: {
    academicYear: number;
    month: number;
    studentId: string;
}): Promise<{
    student: NotificationStudentRow;
    counts: Record<CellKey, number>;
    drafts: Record<CellKey, string>;
    classDays: {
        value: number;
        overridden: boolean;
        auto: number;
    };
    override: OverrideRecord | null;
    range: MonthDateRange;
} | null>;

export { type AggregateResult, type AssembleListItem, CATEGORIES, CELL_KEYS, CLASS_DAY_TYPES, type CategoryKey, type CellKey, type ClassDayEntryItem, type ClassDayPlanItem, type ClassDayType, type ClassDaysAutoResult, type ClassGroupSummary, type CrossFieldIssue, DAY_TYPES, DAY_TYPE_COLORS, DAY_TYPE_LABELS, DAY_TYPE_SYMBOLS, type DayClassification, type DayType, type EntryBulkUpsertInput, type EntryChange, type EntryListQuery, type EntryWithCode, type GroupAccessResult, HOLIDAY_DAY_TYPES, LEGACY_ENTRY_KEYS, LEGACY_KEY_MESSAGE, type MonthDateRange, type MonthSummary, type NotificationStatusInput, type NotificationStudentRow, type OverridePutInput, type OverrideRecord, REASONS, type ReasonKey, type ResolveClassDaysInput, type ResolveClassDaysResult, SCHOOL_LEVEL_LONG, SCHOOL_LEVEL_SHORT, type ScheduleLike, type ScheduleRange, type SchoolLevelInput, type StudentBaseFields, type StudentCreateInput, type StudentUpdateInput, type WeekRow, academicYearToCalendarYear, aggregateEntries, calculateMonthSummaries, calculateWeekSummary, classDayEntryUpdateSchema, classDayPlanCreateSchema, classifyDate, computeClassDaysAuto, computeNotificationStatus, detectLegacyEntryKeys, encodeRfc5987, entryBulkUpsertSchema, entryChangeSchema, entryListQuerySchema, formatDateOnly, formatSchoolLevel, getCurrentStaffId, groupEntriesByWeek, isAccessibleGroupId, loadListData, loadMonthSchedules, loadOverride, loadOverridesForStudents, loadStudentData, makeEmptyCounts, makeEmptyDrafts, mergeStudentForCrossField, monthBounds, normalizeKoreanPhone, normalizeName, notificationBulkZipQuerySchema, notificationListQuerySchema, overridePutSchema, parseCategoryTexts, parseDateOnly, resolveAccessibleGroups, resolveCellTexts, resolveClassDaysEffective, sanitizeFilename, schoolLevelSchema, studentCreateSchema, studentUpdateSchema, toDateOnlyString, todayKstString, validateCellKeySet, validateGuardianSlots, validateStudentCrossFields };
