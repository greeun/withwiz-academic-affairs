/**
 * Monthly class-day computation for attendance notifications (Sprint 3).
 *
 * - 자동 산출: (해당 (year, month) 평일 수) − (HOLIDAY|VACATION 일정이 덮는 평일 수).
 *   FIELD_TRIP, EVENT, EXAM 은 수업일로 유지. classifyDate 와 동일 정책.
 * - 보정: override.classDaysOverride 가 non-null 이면 그 값을 사용.
 * - This is the single source of truth used by list view, preview screen, and
 *   HWPX renderer (Sprint 3 amendment (e) `resolveClassDaysEffective`).
 */
import { toDateOnlyString } from "./date-rules";

export interface ScheduleRange {
  scheduleType: string;
  startDate: Date;
  endDate: Date | null;
}

export interface ClassDaysAutoResult {
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
export function computeClassDaysAuto(
  calendarYear: number,
  calendarMonth: number,
  schedules: ScheduleRange[],
): ClassDaysAutoResult {
  const daysInMonth = new Date(Date.UTC(calendarYear, calendarMonth, 0)).getUTCDate();
  let weekdays = 0;
  let holidays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(Date.UTC(calendarYear, calendarMonth - 1, d));
    const dow = date.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    weekdays++;
    const ds = toDateOnlyString(date);
    let isHoliday = false;
    for (const s of schedules) {
      if (s.scheduleType !== "HOLIDAY" && s.scheduleType !== "VACATION") continue;
      const start = toDateOnlyString(s.startDate);
      const end = s.endDate ? toDateOnlyString(s.endDate) : start;
      if (ds >= start && ds <= end) {
        isHoliday = true;
        break;
      }
    }
    if (isHoliday) holidays++;
  }
  return { weekdays, holidays, auto: weekdays - holidays };
}

export interface ResolveClassDaysInput {
  auto: number;
  override: number | null;
}

export interface ResolveClassDaysResult {
  value: number;
  overridden: boolean;
}

/**
 * Single source-of-truth resolver — used by list view payload, preview
 * payload, and HWPX renderer (Sprint 3 amendment (e)).
 */
export function resolveClassDaysEffective(
  input: ResolveClassDaysInput,
): ResolveClassDaysResult {
  if (input.override !== null && input.override !== undefined) {
    return { value: input.override, overridden: true };
  }
  return { value: input.auto, overridden: false };
}

/**
 * Korean academic year → calendar year for a given month.
 * Months 3..12 stay in the same calendar year as the academic year.
 * Months 1..2 are the following calendar year (e.g., 학년도 2025 × 2월 = 2026-02).
 */
export function academicYearToCalendarYear(
  academicYear: number,
  month: number,
): number {
  return month >= 3 ? academicYear : academicYear + 1;
}
