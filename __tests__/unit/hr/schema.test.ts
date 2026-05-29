import { describe, it, expect } from "vitest";
import { createEmployeeSchema, updateEmployeeSchema, listEmployeeQuerySchema } from "../../../src/hr/schema";
import {
  createEducationSchema, createCareerSchema, createFamilySchema, createQualificationSchema,
} from "../../../src/hr/schema";
import {
  createContractSchema, createAppointmentSchema,
} from "../../../src/hr/schema";

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

describe("hr/schema 하위 도메인", () => {
  it("education: schoolName 필수, 날짜 형식", () => {
    expect(createEducationSchema.safeParse({ schoolName: "서울대" }).success).toBe(true);
    expect(createEducationSchema.safeParse({}).success).toBe(false);
    expect(createEducationSchema.safeParse({ schoolName: "A", admissionDate: "2020/01/01" }).success).toBe(false);
  });
  it("career: orgName+startDate 필수, careerType 기본 NON_EDUCATIONAL, isVerified 기본 false", () => {
    const r = createCareerSchema.parse({ orgName: "A초", startDate: "2020-03-01" });
    expect(r.careerType).toBe("NON_EDUCATIONAL");
    expect(r.isVerified).toBe(false);
    expect(createCareerSchema.safeParse({ orgName: "A" }).success).toBe(false);
    expect(createCareerSchema.safeParse({ orgName: "A", startDate: "2020-03-01", careerType: "X" }).success).toBe(false);
  });
  it("family: relation+name 필수", () => {
    expect(createFamilySchema.safeParse({ relation: "부", name: "홍부" }).success).toBe(true);
    expect(createFamilySchema.safeParse({ relation: "부" }).success).toBe(false);
  });
  it("qualification: name 필수, type 기본 GENERAL", () => {
    expect(createQualificationSchema.parse({ name: "정교사2급" }).type).toBe("GENERAL");
    expect(createQualificationSchema.safeParse({}).success).toBe(false);
  });
});

describe("hr/schema 임용·계약·발령", () => {
  it("contract: contractType+startDate 필수, salaryStep 정수 허용", () => {
    expect(createContractSchema.safeParse({ contractType: "REGULAR", startDate: "2026-03-01" }).success).toBe(true);
    expect(createContractSchema.safeParse({ contractType: "REGULAR" }).success).toBe(false);
    expect(createContractSchema.safeParse({ contractType: "X", startDate: "2026-03-01" }).success).toBe(false);
    expect(createContractSchema.safeParse({ contractType: "REGULAR", startDate: "2026-03-01", salaryStep: 5 }).success).toBe(true);
  });
  it("appointment: type+effectiveDate 필수, 잘못된 type 거부", () => {
    expect(createAppointmentSchema.safeParse({ type: "DISMISSAL", effectiveDate: "2026-08-31" }).success).toBe(true);
    expect(createAppointmentSchema.safeParse({ type: "NEW_HIRE" }).success).toBe(false);
    expect(createAppointmentSchema.safeParse({ type: "NOPE", effectiveDate: "2026-08-31" }).success).toBe(false);
  });
});
