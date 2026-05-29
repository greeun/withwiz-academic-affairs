import { describe, it, expect } from "vitest";
import { createEmployeeSchema, updateEmployeeSchema, listEmployeeQuerySchema } from "../../../src/hr/schema";

describe("hr/schema createEmployeeSchema", () => {
  it("이름만으로 통과(나머지 옵션), 기본 enum 적용", () => {
    const r = createEmployeeSchema.parse({ name: "홍길동" });
    expect(r.name).toBe("홍길동");
    expect(r.employmentType).toBe("REGULAR");
    expect(r.status).toBe("ACTIVE");
  });

  it("이름 누락은 실패", () => {
    expect(createEmployeeSchema.safeParse({}).success).toBe(false);
  });

  it("주민번호 형식 검증(하이픈 유무 허용)", () => {
    expect(createEmployeeSchema.safeParse({ name: "A", nationalId: "901010-1234567" }).success).toBe(true);
    expect(createEmployeeSchema.safeParse({ name: "A", nationalId: "9010101234567" }).success).toBe(true);
    expect(createEmployeeSchema.safeParse({ name: "A", nationalId: "12-34" }).success).toBe(false);
  });

  it("잘못된 employmentType 거부", () => {
    expect(createEmployeeSchema.safeParse({ name: "A", employmentType: "FULLTIME" }).success).toBe(false);
  });

  it("hireDate 는 YYYY-MM-DD 만 허용", () => {
    expect(createEmployeeSchema.safeParse({ name: "A", hireDate: "2026-03-02" }).success).toBe(true);
    expect(createEmployeeSchema.safeParse({ name: "A", hireDate: "2026/03/02" }).success).toBe(false);
  });
});

describe("hr/schema updateEmployeeSchema", () => {
  it("부분 갱신 허용(빈 객체 통과)", () => {
    expect(updateEmployeeSchema.safeParse({}).success).toBe(true);
  });
});

describe("hr/schema listEmployeeQuerySchema", () => {
  it("기본값 적용", () => {
    const r = listEmployeeQuerySchema.parse({});
    expect(r.page).toBe(1);
    expect(r.limit).toBe(20);
    expect(r.sort).toBe("sortOrder");
    expect(r.order).toBe("asc");
  });

  it("status 필터 enum 검증", () => {
    expect(listEmployeeQuerySchema.safeParse({ status: "ACTIVE" }).success).toBe(true);
    expect(listEmployeeQuerySchema.safeParse({ status: "GONE" }).success).toBe(false);
  });
});
