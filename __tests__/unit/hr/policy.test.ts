import { describe, it, expect } from "vitest";
import { canReadAll, canManagePii, canEdit, scopeWhere, type HrViewer } from "../../../src/hr/policy";

const base: HrViewer = { staffId: "s1", menuKeys: [], isSystem: false };

describe("hr/policy", () => {
  it("시스템 역할은 전체 조회·PII·편집 모두 허용", () => {
    const v: HrViewer = { ...base, isSystem: true };
    expect(canReadAll(v)).toBe(true);
    expect(canManagePii(v)).toBe(true);
    expect(canEdit(v)).toBe(true);
  });

  it("resource.personnel 보유 시 전체 조회·편집 허용, PII는 별도 키 필요", () => {
    const v: HrViewer = { ...base, menuKeys: ["resource.personnel"] };
    expect(canReadAll(v)).toBe(true);
    expect(canEdit(v)).toBe(true);
    expect(canManagePii(v)).toBe(false);
  });

  it("resource.personnel.pii 보유 시 PII 허용", () => {
    const v: HrViewer = { ...base, menuKeys: ["resource.personnel", "resource.personnel.pii"] };
    expect(canManagePii(v)).toBe(true);
  });

  it("권한 없는 사용자는 조회·편집 불가", () => {
    expect(canReadAll(base)).toBe(false);
    expect(canEdit(base)).toBe(false);
    expect(canManagePii(base)).toBe(false);
  });

  it("scopeWhere: 전체 권한자는 제한 없음(undefined)", () => {
    const v: HrViewer = { ...base, menuKeys: ["resource.personnel"] };
    expect(scopeWhere(v)).toBeUndefined();
  });

  it("scopeWhere: 셀프서비스 문맥은 본인 레코드로 좁힘", () => {
    const v: HrViewer = { ...base, employeeId: "e9" };
    expect(scopeWhere(v, true)).toEqual({ id: "e9" });
  });

  it("scopeWhere: 권한도 셀프도 아니면 아무것도 안 보임", () => {
    expect(scopeWhere(base)).toEqual({ id: "__none__" });
  });
});
