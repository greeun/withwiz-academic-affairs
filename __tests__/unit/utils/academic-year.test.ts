import { describe, it, expect } from "vitest";
import { getAcademicYearForDate, getCurrentAcademicYear } from "@/utils/academic-year";

describe("getAcademicYearForDate", () => {
  it("3월 1일은 그해 학년도", () => {
    expect(getAcademicYearForDate(new Date("2026-03-01T00:00:00Z"))).toBe(2026);
  });
  it("2월 말일은 전년도 학년도", () => {
    expect(getAcademicYearForDate(new Date("2026-02-28T23:59:59Z"))).toBe(2025);
  });
  it("9월 학기 중간", () => {
    expect(getAcademicYearForDate(new Date("2026-09-15T12:00:00Z"))).toBe(2026);
  });
  it("익년 1월", () => {
    expect(getAcademicYearForDate(new Date("2027-01-15T00:00:00Z"))).toBe(2026);
  });
});

describe("getCurrentAcademicYear", () => {
  it("기준 시각 주입 지원", () => {
    expect(getCurrentAcademicYear(new Date("2026-04-01T00:00:00Z"))).toBe(2026);
    expect(getCurrentAcademicYear(new Date("2026-01-01T00:00:00Z"))).toBe(2025);
  });
});
