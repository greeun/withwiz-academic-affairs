import { describe, it, expect } from "vitest";
import {
  LEGACY_ENTRY_KEYS,
  detectLegacyEntryKeys,
  entryBulkUpsertSchema,
  entryListQuerySchema,
} from "@/attendance/entry-schemas";
import { studentUpdateSchema } from "@/attendance/student-schemas";

describe("detectLegacyEntryKeys", () => {
  it("레거시 키는 academicYear·schoolLevel 두 개다", () => {
    expect([...LEGACY_ENTRY_KEYS]).toEqual(["academicYear", "schoolLevel"]);
  });

  it("본문과 쿼리에서 레거시 키를 찾아낸다", () => {
    expect(detectLegacyEntryKeys({ academicYear: 2026, classGroupId: "g1" })).toEqual(["academicYear"]);
    expect(detectLegacyEntryKeys(new URLSearchParams("schoolLevel=HIGH"))).toEqual(["schoolLevel"]);
    expect(detectLegacyEntryKeys({ classGroupId: "g1" })).toBeNull();
  });
});

describe("entry 스키마의 strict 검증", () => {
  it("목록에 없는 학년·반 키가 섞인 쿼리를 거부한다", () => {
    const result = entryListQuerySchema.safeParse({
      date: "2026-10-01",
      classGroupId: "g1",
      legacyGrade: 1,
      legacyClass: 2,
    });
    expect(result.success).toBe(false);
  });

  it("목록에 없는 학년·반 키가 섞인 일괄 저장 본문을 거부한다", () => {
    const result = entryBulkUpsertSchema.safeParse({
      date: "2026-10-01",
      classGroupId: "g1",
      snapshotAt: "2026-10-01T00:00:00+09:00",
      changes: [{ studentId: "s1", codeId: null }],
      legacyGrade: 1,
    });
    expect(result.success).toBe(false);
  });
});

describe("학생 스키마의 출석번호", () => {
  it("attendanceNumber 를 1..99 정수 또는 null 로 받는다", () => {
    expect(studentUpdateSchema.parse({ attendanceNumber: 7 }).attendanceNumber).toBe(7);
    expect(studentUpdateSchema.parse({ attendanceNumber: null }).attendanceNumber).toBeNull();
    expect(studentUpdateSchema.safeParse({ attendanceNumber: 100 }).success).toBe(false);
  });
});
