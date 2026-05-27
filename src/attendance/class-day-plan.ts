import { z } from "zod";

export const DAY_TYPES = [
  "CLASS",
  "HOLIDAY",
  "DISCRETIONARY_HOLIDAY",
  "OTHER_HOLIDAY",
  "EXAM",
  "FIELD_TRIP",
  "EVENT",
  "VACATION",
] as const;

export type ClassDayType = (typeof DAY_TYPES)[number];

export const DAY_TYPE_LABELS: Record<ClassDayType, string> = {
  CLASS: "수업일",
  HOLIDAY: "공휴일",
  DISCRETIONARY_HOLIDAY: "재량휴일",
  OTHER_HOLIDAY: "기타휴일",
  EXAM: "고사일",
  FIELD_TRIP: "체험학습",
  EVENT: "행사",
  VACATION: "방학/휴업",
};

export const DAY_TYPE_SYMBOLS: Record<ClassDayType, string> = {
  CLASS: "",
  HOLIDAY: "",
  DISCRETIONARY_HOLIDAY: "",
  OTHER_HOLIDAY: "",
  EXAM: "■",
  FIELD_TRIP: "▲",
  EVENT: "●",
  VACATION: "",
};

export const DAY_TYPE_COLORS: Record<ClassDayType, { text: string; bg: string }> = {
  CLASS: { text: "#000000", bg: "transparent" },
  HOLIDAY: { text: "#DC2626", bg: "#FEE2E2" },
  DISCRETIONARY_HOLIDAY: { text: "#DC2626", bg: "#FEF2F2" },
  OTHER_HOLIDAY: { text: "#DC2626", bg: "#FEF9C3" },
  EXAM: { text: "#D97706", bg: "#FEF3C7" },
  FIELD_TRIP: { text: "#4F46E5", bg: "#E0E7FF" },
  EVENT: { text: "#2563EB", bg: "#DBEAFE" },
  VACATION: { text: "#059669", bg: "#D1FAE5" },
};

export const HOLIDAY_DAY_TYPES: ClassDayType[] = [
  "HOLIDAY",
  "DISCRETIONARY_HOLIDAY",
  "OTHER_HOLIDAY",
];

export const CLASS_DAY_TYPES: ClassDayType[] = [
  "CLASS",
  "EXAM",
  "FIELD_TRIP",
  "EVENT",
];

export const classDayPlanCreateSchema = z.object({
  academicYear: z.number().int().min(2020).max(2100),
  semester: z.enum(["FIRST", "SECOND"]),
});

export const classDayEntryUpdateSchema = z.object({
  entries: z.array(
    z.object({
      id: z.string(),
      dayType: z.enum(DAY_TYPES).optional(),
      hours: z.number().int().min(0).max(20).optional(),
      note: z.string().optional(),
    }),
  ),
});

export interface ClassDayEntryItem {
  id: string;
  date: string;
  dayType: ClassDayType;
  hours: number;
  note: string;
}

export interface ClassDayPlanItem {
  id: string;
  academicYear: number;
  semester: string;
  entries: ClassDayEntryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WeekRow {
  weekNum: number;
  month: number;
  days: (ClassDayEntryItem | null)[];
}

export function groupEntriesByWeek(
  entries: ClassDayEntryItem[],
  _semesterStart?: Date,
): WeekRow[] {
  if (entries.length === 0) return [];

  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // 1단계: 달력 기준 주 그룹핑
  const rawWeeks: { mondayKey: string; days: (ClassDayEntryItem | null)[] }[] = [];
  let lastMondayKey = "";

  for (const entry of sorted) {
    const d = new Date(entry.date);
    const dow = d.getDay();
    const dayIndex = dow - 1;

    const monday = new Date(d);
    monday.setDate(monday.getDate() - dayIndex);
    const mondayKey = monday.toISOString().slice(0, 10);

    if (mondayKey !== lastMondayKey) {
      rawWeeks.push({ mondayKey, days: [null, null, null, null, null] });
      lastMondayKey = mondayKey;
    }

    const week = rawWeeks[rawWeeks.length - 1];
    if (dayIndex >= 0 && dayIndex < 5) {
      week.days[dayIndex] = entry;
    }
  }

  // 2단계: 월 경계에서 주 분리
  const result: WeekRow[] = [];
  let weekNum = 0;

  for (const raw of rawWeeks) {
    const months = new Set<number>();
    for (const day of raw.days) {
      if (day) months.add(new Date(day.date).getMonth());
    }

    weekNum++;

    if (months.size <= 1) {
      result.push({
        weekNum,
        month: getWeekMonth(raw.days),
        days: raw.days,
      });
    } else {
      const sortedMonths = Array.from(months).sort((a, b) => a - b);
      for (const m of sortedMonths) {
        const splitDays: (ClassDayEntryItem | null)[] = raw.days.map(
          (day) => (day && new Date(day.date).getMonth() === m ? day : null),
        );
        if (splitDays.some((d) => d !== null)) {
          result.push({ weekNum, month: m + 1, days: splitDays });
        }
      }
    }
  }

  return result;
}

function getWeekMonth(days: (ClassDayEntryItem | null)[]): number {
  for (const d of days) {
    if (d) return new Date(d.date).getMonth() + 1;
  }
  return 0;
}

export interface MonthSummary {
  month: number;
  classDays: number;
  totalHours: number;
  holidays: number;
  weeks: WeekRow[];
}

export function calculateMonthSummaries(weeks: WeekRow[]): MonthSummary[] {
  const monthMap = new Map<number, MonthSummary>();

  for (const week of weeks) {
    for (const day of week.days) {
      if (!day) continue;
      const month = new Date(day.date).getMonth() + 1;
      if (!monthMap.has(month)) {
        monthMap.set(month, {
          month,
          classDays: 0,
          totalHours: 0,
          holidays: 0,
          weeks: [],
        });
      }
      const summary = monthMap.get(month)!;
      if (CLASS_DAY_TYPES.includes(day.dayType as ClassDayType) && day.hours > 0) {
        summary.classDays++;
      }
      if (HOLIDAY_DAY_TYPES.includes(day.dayType as ClassDayType)) {
        summary.holidays++;
      }
      summary.totalHours += day.hours;
    }

    const month = week.month;
    if (!monthMap.has(month) && month > 0) {
      monthMap.set(month, { month, classDays: 0, totalHours: 0, holidays: 0, weeks: [] });
    }
    if (monthMap.has(month)) {
      monthMap.get(month)!.weeks.push(week);
    }
  }

  return Array.from(monthMap.values()).sort((a, b) => a.month - b.month);
}

export function calculateWeekSummary(days: (ClassDayEntryItem | null)[]): {
  hours: number;
  classDays: number;
  holidays: number;
} {
  let hours = 0;
  let classDays = 0;
  let holidays = 0;

  for (const day of days) {
    if (!day) continue;
    hours += day.hours;
    if (CLASS_DAY_TYPES.includes(day.dayType as ClassDayType) && day.hours > 0) classDays++;
    if (HOLIDAY_DAY_TYPES.includes(day.dayType as ClassDayType)) holidays++;
  }

  return { hours, classDays, holidays };
}
