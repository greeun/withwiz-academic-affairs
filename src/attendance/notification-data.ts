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
import {
  CELL_KEYS,
  aggregateEntries,
  type AggregateResult,
  type CellKey,
  type EntryWithCode,
  makeEmptyCounts,
  makeEmptyDrafts,
} from "./aggregate";
import {
  academicYearToCalendarYear,
  computeClassDaysAuto,
  resolveClassDaysEffective,
  type ScheduleRange,
} from "./class-days";

// SchoolLevel is a Prisma enum – treat as string in package-level code.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchoolLevel = any;

export interface NotificationStudentRow {
  id: string;
  name: string;
  academicYear: number;
  // S5-d: 학년은 ClassGroup 분리 이후에도 학생 행 위의 schoolLevel/grade 로 유지된다.
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
  // S5-d: 담임 정보는 ClassGroup 으로 이전됨. 통지서 양식의 "담당교사" 칸을 위해
  // 유지하되 ClassGroup.homeroomStaff 로부터 derive 한다.
  homeroomStaffName: string;
}

export interface OverrideRecord {
  categoryTexts: Partial<Record<CellKey, string>>;
  classDaysOverride: number | null;
  overrideReason: string | null;
  issueDate: Date | null;
  updatedAt: Date;
  updatedById: string | null;
}

export interface MonthDateRange {
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

export function monthBounds(
  academicYear: number,
  month: number,
): MonthDateRange {
  const calendarYear = academicYearToCalendarYear(academicYear, month);
  const calendarMonth = month;
  const lastDay = new Date(
    Date.UTC(calendarYear, calendarMonth, 0),
  ).getUTCDate();
  const first = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-01`;
  const last = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return {
    first,
    last,
    firstDate: new Date(`${first}T00:00:00Z`),
    lastDate: new Date(`${last}T00:00:00Z`),
    calendarYear,
    calendarMonth,
  };
}

/**
 * Find HOLIDAY/VACATION schedules potentially overlapping a month.
 * Single small query.
 */
export async function loadMonthSchedules(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  range: MonthDateRange,
): Promise<ScheduleRange[]> {
  const rows = await prisma.academicSchedule.findMany({
    where: {
      scheduleType: { in: ["HOLIDAY", "VACATION"] },
      startDate: { lte: range.lastDate },
      OR: [
        { endDate: null, startDate: { gte: range.firstDate } },
        { endDate: { gte: range.firstDate } },
      ],
    },
    select: { scheduleType: true, startDate: true, endDate: true },
  });
  return rows;
}

/**
 * Load entries for a set of students within a month range.
 */
async function loadEntriesForStudents(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  studentIds: string[],
  range: MonthDateRange,
): Promise<Map<string, EntryWithCode[]>> {
  if (studentIds.length === 0) return new Map();
  const rows = await prisma.attendanceEntry.findMany({
    where: {
      studentId: { in: studentIds },
      date: { gte: range.firstDate, lte: range.lastDate },
    },
    select: {
      studentId: true,
      date: true,
      memo: true,
      code: {
        select: {
          aggregateCategory: true,
          aggregateReason: true,
          displayName: true,
        },
      },
    },
  });
  const map = new Map<string, EntryWithCode[]>();
  for (const id of studentIds) map.set(id, []);
  for (const r of rows) {
    const list = map.get(r.studentId);
    if (!list) continue;
    list.push({
      date: r.date,
      memo: r.memo,
      code: {
        aggregateCategory: r.code.aggregateCategory,
        aggregateReason: r.code.aggregateReason,
        displayName: r.code.displayName,
      },
    });
  }
  return map;
}

/**
 * Parse the JSON `categoryTexts` field into a typed map. Unknown keys ignored.
 */
export function parseCategoryTexts(
  raw: unknown,
): Partial<Record<CellKey, string>> {
  const out: Partial<Record<CellKey, string>> = {};
  if (!raw || typeof raw !== "object") return out;
  const obj = raw as Record<string, unknown>;
  for (const k of CELL_KEYS) {
    const v = obj[k];
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

export async function loadOverride(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  academicYear: number,
  month: number,
  studentId: string,
): Promise<OverrideRecord | null> {
  const row = await prisma.monthlyNotificationOverride.findUnique({
    where: {
      academicYear_month_studentId: { academicYear, month, studentId },
    },
    select: {
      categoryTexts: true,
      classDaysOverride: true,
      overrideReason: true,
      issueDate: true,
      updatedAt: true,
      updatedById: true,
    },
  });
  if (!row) return null;
  return {
    categoryTexts: parseCategoryTexts(row.categoryTexts),
    classDaysOverride: row.classDaysOverride,
    overrideReason: row.overrideReason,
    issueDate: row.issueDate,
    updatedAt: row.updatedAt,
    updatedById: row.updatedById,
  };
}

export async function loadOverridesForStudents(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  academicYear: number,
  month: number,
  studentIds: string[],
): Promise<Map<string, OverrideRecord>> {
  const map = new Map<string, OverrideRecord>();
  if (studentIds.length === 0) return map;
  const rows = await prisma.monthlyNotificationOverride.findMany({
    where: { academicYear, month, studentId: { in: studentIds } },
    select: {
      studentId: true,
      categoryTexts: true,
      classDaysOverride: true,
      overrideReason: true,
      issueDate: true,
      updatedAt: true,
      updatedById: true,
    },
  });
  for (const r of rows) {
    map.set(r.studentId, {
      categoryTexts: parseCategoryTexts(r.categoryTexts),
      classDaysOverride: r.classDaysOverride,
      overrideReason: r.overrideReason,
      issueDate: r.issueDate,
      updatedAt: r.updatedAt,
      updatedById: r.updatedById,
    });
  }
  return map;
}

export interface NotificationStatusInput {
  override: OverrideRecord | null;
}

/**
 * Status badge: "초안" when override absent or all-empty; "편집됨" otherwise.
 * Override row存在 + (any non-empty categoryTexts value OR classDaysOverride !== null OR issueDate !== null) → 편집됨.
 */
export function computeNotificationStatus(
  input: NotificationStatusInput,
): "초안" | "편집됨" {
  const ov = input.override;
  if (!ov) return "초안";
  if (ov.classDaysOverride !== null) return "편집됨";
  if (ov.issueDate !== null) return "편집됨";
  for (const k of CELL_KEYS) {
    const v = ov.categoryTexts[k];
    if (typeof v === "string" && v.trim().length > 0) return "편집됨";
  }
  return "초안";
}

export interface AssembleListItem {
  student: NotificationStudentRow;
  counts: Record<CellKey, number>;
  drafts: Record<CellKey, string>;
  classDays: { value: number; overridden: boolean; auto: number };
  override: OverrideRecord | null;
  status: "초안" | "편집됨";
}

/**
 * S5-d: Assemble payloads for all students in a ClassGroup for a (year, month).
 * Caller must verify access to `classGroupId` before calling.
 */
export async function loadListData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  input: {
    academicYear: number;
    month: number;
    classGroupId: string;
  },
): Promise<{
  classDaysAuto: number;
  items: AssembleListItem[];
  range: MonthDateRange;
}> {
  const range = monthBounds(input.academicYear, input.month);
  const [schedules, students] = await Promise.all([
    loadMonthSchedules(prisma, range),
    prisma.student.findMany({
      where: {
        isActive: true,
        academicYear: input.academicYear,
        classGroupId: input.classGroupId,
      },
      orderBy: [
        { schoolLevel: "asc" },
        { grade: "asc" },
        { yeroomNumber: "asc" },
      ],
      include: {
        classGroup: {
          select: {
            id: true,
            name: true,
            homeroomStaff: { select: { name: true } },
          },
        },
      },
    }),
  ]);
  const classDaysAuto = computeClassDaysAuto(
    range.calendarYear,
    range.calendarMonth,
    schedules,
  ).auto;

  const studentRows: NotificationStudentRow[] = students.map((s: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
    id: s.id,
    name: s.name,
    academicYear: s.academicYear,
    schoolLevel: s.schoolLevel,
    grade: s.grade ?? 0,
    yeroomNumber: s.yeroomNumber,
    classGroupId: s.classGroup?.id ?? input.classGroupId,
    classGroupName: s.classGroup?.name ?? "",
    homeSchoolName: s.homeSchoolName,
    homeSchoolGrade: s.homeSchoolGrade,
    homeSchoolClass: s.homeSchoolClass,
    homeSchoolNumber: s.homeSchoolNumber,
    consignmentStartDate: s.consignmentStartDate,
    homeroomStaffName: s.classGroup?.homeroomStaff?.name ?? "",
  }));

  const studentIds = studentRows.map((s) => s.id);
  const [entriesByStudent, overrides] = await Promise.all([
    loadEntriesForStudents(prisma, studentIds, range),
    loadOverridesForStudents(prisma, input.academicYear, input.month, studentIds),
  ]);

  const items: AssembleListItem[] = studentRows.map((s) => {
    const entries = entriesByStudent.get(s.id) ?? [];
    const { counts, drafts }: AggregateResult = aggregateEntries(entries);
    const ov = overrides.get(s.id) ?? null;
    const cd = resolveClassDaysEffective({
      auto: classDaysAuto,
      override: ov?.classDaysOverride ?? null,
    });
    return {
      student: s,
      counts,
      drafts,
      classDays: { value: cd.value, overridden: cd.overridden, auto: classDaysAuto },
      override: ov,
      status: computeNotificationStatus({ override: ov }),
    };
  });

  return { classDaysAuto, items, range };
}

/**
 * Per-student preview data.
 */
export async function loadStudentData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  input: {
    academicYear: number;
    month: number;
    studentId: string;
  },
): Promise<{
  student: NotificationStudentRow;
  counts: Record<CellKey, number>;
  drafts: Record<CellKey, string>;
  classDays: { value: number; overridden: boolean; auto: number };
  override: OverrideRecord | null;
  range: MonthDateRange;
} | null> {
  const range = monthBounds(input.academicYear, input.month);
  const student = await prisma.student.findUnique({
    where: { id: input.studentId },
    include: {
      classGroup: {
        select: {
          id: true,
          name: true,
          homeroomStaff: { select: { name: true } },
        },
      },
    },
  });
  if (!student) return null;
  // Cross-year-boundary contract (amendment Q16): student.academicYear must
  // match the requested academicYear.
  if (student.academicYear !== input.academicYear) return null;

  const studentRow: NotificationStudentRow = {
    id: student.id,
    name: student.name,
    academicYear: student.academicYear,
    schoolLevel: student.schoolLevel,
    grade: student.grade ?? 0,
    yeroomNumber: student.yeroomNumber,
    classGroupId: student.classGroup?.id ?? student.classGroupId ?? "",
    classGroupName: student.classGroup?.name ?? "",
    homeSchoolName: student.homeSchoolName,
    homeSchoolGrade: student.homeSchoolGrade,
    homeSchoolClass: student.homeSchoolClass,
    homeSchoolNumber: student.homeSchoolNumber,
    consignmentStartDate: student.consignmentStartDate,
    homeroomStaffName: student.classGroup?.homeroomStaff?.name ?? "",
  };

  const [schedules, entriesByStudent, override] = await Promise.all([
    loadMonthSchedules(prisma, range),
    loadEntriesForStudents(prisma, [student.id], range),
    loadOverride(prisma, input.academicYear, input.month, student.id),
  ]);
  const classDaysAuto = computeClassDaysAuto(
    range.calendarYear,
    range.calendarMonth,
    schedules,
  ).auto;
  const entries = entriesByStudent.get(student.id) ?? [];
  const { counts, drafts } = aggregateEntries(entries);
  const cd = resolveClassDaysEffective({
    auto: classDaysAuto,
    override: override?.classDaysOverride ?? null,
  });
  // Always-present payloads even when no entries (empty drafts/counts).
  void makeEmptyCounts;
  void makeEmptyDrafts;
  return {
    student: studentRow,
    counts,
    drafts,
    classDays: { value: cd.value, overridden: cd.overridden, auto: classDaysAuto },
    override,
    range,
  };
}
