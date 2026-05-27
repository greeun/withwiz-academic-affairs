import { describe, it, expect } from "vitest";
import { getKoreanHolidays, getSemesterRange, generateWeekdays } from "@/utils/holidays";

describe("getKoreanHolidays", () => {
  it("includes 신정 for any year", () => {
    const map = getKoreanHolidays(2026);
    expect(map.get("2026-01-01")).toBe("신정");
  });

  it("includes 광복절", () => {
    const map = getKoreanHolidays(2026);
    expect(map.get("2026-08-15")).toBe("광복절");
  });

  it("returns a Map with ≥ 15 entries (fixed + lunar + substitutions)", () => {
    const map = getKoreanHolidays(2026);
    expect(map.size).toBeGreaterThanOrEqual(15);
  });
});

describe("getSemesterRange", () => {
  it("FIRST → March-July", () => {
    const r = getSemesterRange(2026, "FIRST");
    expect(r.start.getMonth()).toBe(2); // March
  });
  it("SECOND → August-December", () => {
    const r = getSemesterRange(2026, "SECOND");
    expect(r.start.getMonth()).toBe(7); // August
  });
});

describe("generateWeekdays", () => {
  it("excludes Saturdays and Sundays", () => {
    // 2026-05-30 (Sat), 2026-05-31 (Sun), 2026-06-01 (Mon)
    const days = generateWeekdays(
      new Date(2026, 4, 30),
      new Date(2026, 5, 1),
    );
    expect(days).toHaveLength(1);
    expect(days[0].getDate()).toBe(1);
  });
});
