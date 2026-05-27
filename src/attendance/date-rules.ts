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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ScheduleType = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchoolLevel = any;

export type DayType = "schoolday" | "weekend" | "holiday";

export interface ScheduleLike {
  title: string;
  startDate: Date;
  endDate: Date | null;
  scheduleType: ScheduleType;
  /** S5-b: null = 전교 공용, 값 = 해당 학교급에만 적용. */
  schoolLevel?: SchoolLevel | null;
}

export interface DayClassification {
  dayType: DayType;
  label: string;
}

/** Format a Date (treated as KST midnight) to YYYY-MM-DD. */
export function toDateOnlyString(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse YYYY-MM-DD into a UTC-midnight Date (matches Prisma @db.Date storage). */
export function parseDateOnly(s: string): Date {
  return new Date(`${s}T00:00:00Z`);
}

/** Return KST 'today' as YYYY-MM-DD. */
export function todayKstString(): string {
  const now = new Date();
  // KST = UTC+9
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kst = new Date(kstMs);
  return toDateOnlyString(kst);
}

/**
 * Classify a date against the schedule list.
 * @param date 분류 대상 날짜 (UTC midnight Date).
 * @param schedules 해당 날짜를 덮을 수 있는 HOLIDAY/VACATION 스케줄 목록.
 *                  schoolLevel 컬럼이 포함된 row만 의미가 있으나, 누락된 row(undefined)
 *                  도 전교 공용으로 해석한다.
 * @param schoolLevel 학생의 학교급. 주어지면 (schedule.schoolLevel === null OR === schoolLevel)
 *                    만 매칭. null/undefined 이면 전교 공용 row만 매칭.
 */
export function classifyDate(
  date: Date,
  schedules: ScheduleLike[],
  schoolLevel?: SchoolLevel | null,
): DayClassification {
  const target = toDateOnlyString(date);
  const dow = date.getUTCDay();
  if (dow === 0 || dow === 6) {
    return { dayType: "weekend", label: "주말" };
  }
  for (const s of schedules) {
    if (s.scheduleType !== "HOLIDAY" && s.scheduleType !== "VACATION") continue;
    // S5-b: schoolLevel 필터.
    const sLv = s.schoolLevel ?? null;
    if (sLv !== null) {
      if (!schoolLevel || sLv !== schoolLevel) continue;
    }
    const start = toDateOnlyString(s.startDate);
    const end = s.endDate ? toDateOnlyString(s.endDate) : start;
    if (target >= start && target <= end) {
      const prefix = s.scheduleType === "HOLIDAY" ? "공휴일" : "휴업일";
      return { dayType: "holiday", label: `${prefix}(${s.title})` };
    }
  }
  return { dayType: "schoolday", label: "수업일" };
}
