import { describe, expect, it } from "vitest";
import {
  canRead,
  canCreate,
  canUpdate,
  type CounselingViewer,
  type CounselingRecord,
  type CounselingDraft,
} from "@/counseling/policy";

const viewer = (
  staffId: string,
  opts: { viewAll?: boolean; isSystem?: boolean } = {},
): CounselingViewer => ({
  staffId,
  menuKeys: opts.viewAll ? ["school.viewAll"] : [],
  isSystem: opts.isSystem ?? false,
});

const record = (
  authorId: string,
  homeroomStaffId: string,
): CounselingRecord => ({
  authorId,
  student: { homeroomStaffId },
});

const draft = (homeroomStaffId: string): CounselingDraft => ({
  student: { homeroomStaffId },
});

describe("student-counseling policy", () => {
  describe("canRead", () => {
    it("본인 작성건은 항상 읽을 수 있다", () => {
      expect(canRead(viewer("S1"), record("S1", "S9"))).toBe(true);
    });
    it("본인 담임 학생의 기록은 타인 작성이어도 읽을 수 있다", () => {
      expect(canRead(viewer("S1"), record("S2", "S1"))).toBe(true);
    });
    it("작성자도 담임도 아니고 viewAll도 없으면 못 읽는다", () => {
      expect(canRead(viewer("S1"), record("S2", "S9"))).toBe(false);
    });
    it("viewAll 보유자는 모든 기록을 읽을 수 있다", () => {
      expect(canRead(viewer("S1", { viewAll: true }), record("S2", "S9"))).toBe(true);
    });
    it("isSystem은 모든 기록을 읽을 수 있다", () => {
      expect(canRead(viewer("S1", { isSystem: true }), record("S2", "S9"))).toBe(true);
    });
  });

  describe("canUpdate", () => {
    it("본인 작성건만 수정 가능", () => {
      expect(canUpdate(viewer("S1"), record("S1", "S9"))).toBe(true);
      expect(canUpdate(viewer("S1"), record("S2", "S9"))).toBe(false);
    });
    it("viewAll이라도 타인 작성건은 수정 불가", () => {
      expect(canUpdate(viewer("S1", { viewAll: true }), record("S2", "S9"))).toBe(false);
    });
    it("isSystem도 타인 작성건은 수정 불가", () => {
      expect(canUpdate(viewer("S1", { isSystem: true }), record("S2", "S9"))).toBe(false);
    });
  });

  describe("canCreate", () => {
    it("본인 담임 학생 대상이면 생성 가능", () => {
      expect(canCreate(viewer("S1"), draft("S1"))).toBe(true);
    });
    it("타 담임 학생 대상이면 생성 불가 (기본)", () => {
      expect(canCreate(viewer("S1"), draft("S9"))).toBe(false);
    });
    it("viewAll 보유자는 모든 학생 대상 생성 가능", () => {
      expect(canCreate(viewer("S1", { viewAll: true }), draft("S9"))).toBe(true);
    });
    it("isSystem은 모든 학생 대상 생성 가능", () => {
      expect(canCreate(viewer("S1", { isSystem: true }), draft("S9"))).toBe(true);
    });
  });
});
