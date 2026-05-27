import KoreanLunarCalendar from "korean-lunar-calendar";

// 「관공서의 공휴일에 관한 규정」제3조의2 기준
// - always: 토·일 모두 대체공휴일 적용
// - sundayOnly: 일요일과 겹칠 때만 적용 (설날·추석)
// - never: 적용 대상 아님 (신정·현충일)
type SubstitutionRule = "always" | "sundayOnly" | "never";

interface Holiday {
  date: Date;
  name: string;
  substitution: SubstitutionRule;
}

const FIXED_HOLIDAYS: {
  month: number;
  day: number;
  name: string;
  substitution: SubstitutionRule;
}[] = [
  { month: 1, day: 1, name: "신정", substitution: "never" },
  { month: 3, day: 1, name: "삼일절", substitution: "always" },
  { month: 5, day: 5, name: "어린이날", substitution: "always" },
  { month: 6, day: 6, name: "현충일", substitution: "never" },
  { month: 7, day: 17, name: "제헌절", substitution: "always" },
  { month: 8, day: 15, name: "광복절", substitution: "always" },
  { month: 10, day: 3, name: "개천절", substitution: "always" },
  { month: 10, day: 9, name: "한글날", substitution: "always" },
  { month: 12, day: 25, name: "성탄절", substitution: "always" },
];

// spread: 양력 기준 ±일 오프셋 (설/추석 연휴 처리).
// 음력 산수를 직접 다루면 월/연도 경계와 작은달(29일)에서 깨지므로,
// 설날·추석 본일을 양력으로 변환한 뒤 그 양력 날짜 기준으로 전후일을 더한다.
const LUNAR_HOLIDAYS: {
  month: number;
  day: number;
  name: string;
  spread?: number[];
  substitution: SubstitutionRule;
}[] = [
  {
    month: 1,
    day: 1,
    name: "설날",
    spread: [-1, 0, 1],
    substitution: "sundayOnly",
  },
  { month: 4, day: 8, name: "부처님오신날", substitution: "always" },
  {
    month: 8,
    day: 15,
    name: "추석",
    spread: [-1, 0, 1],
    substitution: "sundayOnly",
  },
];

function lunarToSolar(
  year: number,
  lunarMonth: number,
  lunarDay: number,
): Date | null {
  const cal = new KoreanLunarCalendar();
  const ok = cal.setLunarDate(year, lunarMonth, lunarDay, false);
  if (!ok) return null;
  const sol = cal.getSolarCalendar();
  return new Date(sol.year, sol.month - 1, sol.day);
}

function isWeekend(date: Date): boolean {
  const dow = date.getDay();
  return dow === 0 || dow === 6;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function nextWeekday(date: Date): Date {
  let d = new Date(date);
  while (isWeekend(d)) {
    d = addDays(d, 1);
  }
  return d;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getKoreanHolidays(year: number): Map<string, string> {
  const holidays = new Map<string, string>();
  const allDates: Holiday[] = [];

  for (const h of FIXED_HOLIDAYS) {
    allDates.push({
      date: new Date(year, h.month - 1, h.day),
      name: h.name,
      substitution: h.substitution,
    });
  }

  for (const lh of LUNAR_HOLIDAYS) {
    const base = lunarToSolar(year, lh.month, lh.day);
    if (!base) continue;
    const offsets = lh.spread ?? [0];
    for (const offset of offsets) {
      const solar = addDays(base, offset);
      const suffix = offset === 0 ? "" : offset === -1 ? " 전날" : " 다음날";
      allDates.push({
        date: solar,
        name: lh.name + suffix,
        substitution: lh.substitution,
      });
    }
  }

  // 대체공휴일: 공휴일 규정에 따라 토/일(또는 일요일만) 겹칠 때 다음 비공휴일로
  const usedDates = new Set<string>();
  for (const h of allDates) {
    usedDates.add(dateKey(h.date));
  }

  for (const h of allDates) {
    const dow = h.date.getDay();
    const needsSubstitution =
      h.substitution === "always"
        ? isWeekend(h.date)
        : h.substitution === "sundayOnly"
          ? dow === 0
          : false;

    if (needsSubstitution) {
      let sub = nextWeekday(h.date);
      while (usedDates.has(dateKey(sub))) {
        sub = nextWeekday(addDays(sub, 1));
      }
      usedDates.add(dateKey(sub));
      holidays.set(dateKey(sub), `대체공휴일(${h.name})`);
    }
    holidays.set(dateKey(h.date), h.name);
  }

  return holidays;
}

export function getSemesterRange(
  year: number,
  semester: "FIRST" | "SECOND",
): { start: Date; end: Date } {
  if (semester === "FIRST") {
    return {
      start: new Date(year, 2, 1),
      end: new Date(year, 6, 31),
    };
  }
  return {
    start: new Date(year, 7, 1),
    end: new Date(year, 11, 31),
  };
}

export function generateWeekdays(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    if (!isWeekend(current)) {
      days.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
}
