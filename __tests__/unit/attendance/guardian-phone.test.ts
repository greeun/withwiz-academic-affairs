import { describe, it, expect } from "vitest";
import { normalizeKoreanPhone } from "@/attendance/guardian-phone";

describe("normalizeKoreanPhone", () => {
  it("휴대전화 11자리 (010)", () => {
    expect(normalizeKoreanPhone("01012345678")).toBe("010-1234-5678");
    expect(normalizeKoreanPhone("010-1234-5678")).toBe("010-1234-5678");
    expect(normalizeKoreanPhone("010 1234 5678")).toBe("010-1234-5678");
  });

  it("휴대전화 11자리 (011/016/017/018/019)", () => {
    expect(normalizeKoreanPhone("01112345678")).toBe("011-1234-5678");
    expect(normalizeKoreanPhone("01612345678")).toBe("016-1234-5678");
  });

  it("휴대전화 10자리", () => {
    expect(normalizeKoreanPhone("0111234567")).toBe("011-123-4567");
  });

  it("서울 9자리", () => {
    expect(normalizeKoreanPhone("021234567")).toBe("02-123-4567");
    expect(normalizeKoreanPhone("02-123-4567")).toBe("02-123-4567");
  });

  it("서울 10자리", () => {
    expect(normalizeKoreanPhone("0212345678")).toBe("02-1234-5678");
  });

  it("지역 10자리 (031 등)", () => {
    expect(normalizeKoreanPhone("0311234567")).toBe("031-123-4567");
    expect(normalizeKoreanPhone("054-123-4567")).toBe("054-123-4567");
  });

  it("지역 11자리", () => {
    expect(normalizeKoreanPhone("03112345678")).toBe("031-1234-5678");
  });

  it("자릿수 부족·과다 거부", () => {
    expect(normalizeKoreanPhone("123")).toBeNull();
    expect(normalizeKoreanPhone("010-12-3456")).toBeNull();
    expect(normalizeKoreanPhone("010123456789")).toBeNull();
  });

  it("국내 패턴 아닌 번호 거부", () => {
    expect(normalizeKoreanPhone("8210-1234-5678")).toBeNull();
    expect(normalizeKoreanPhone("02012345678")).toBeNull();
    expect(normalizeKoreanPhone("0701234567")).toBeNull();
  });

  it("빈 문자열·기호만 입력 거부", () => {
    expect(normalizeKoreanPhone("")).toBeNull();
    expect(normalizeKoreanPhone("---")).toBeNull();
  });
});
