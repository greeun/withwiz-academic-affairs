import { describe, expect, it } from "vitest";
import { parseSubjectField } from "@/scheduling/parse-subject-field";

describe("parseSubjectField", () => {
  it("빈 입력은 빈 배열", () => {
    expect(parseSubjectField(null)).toEqual([]);
    expect(parseSubjectField(undefined)).toEqual([]);
    expect(parseSubjectField("")).toEqual([]);
    expect(parseSubjectField("   ")).toEqual([]);
  });

  it("괄호 학년 표기 — 점 구분자: (중.고)", () => {
    const result = parseSubjectField("체육, 생활스포츠(중.고)");
    expect(result).toEqual([
      { name: "체육", levels: ["MIDDLE", "HIGH"] },
      { name: "생활스포츠", levels: ["MIDDLE", "HIGH"] },
    ]);
  });

  it("괄호 학년 표기 — 단일: (초)", () => {
    const result = parseSubjectField("음식만들기(초)");
    expect(result).toEqual([{ name: "음식만들기", levels: ["ELEMENTARY"] }]);
  });

  it("괄호 없이 콤마 분해 + position 추론", () => {
    const result = parseSubjectField("국어, 사회", "초");
    expect(result).toEqual([
      { name: "국어", levels: ["ELEMENTARY"] },
      { name: "사회", levels: ["ELEMENTARY"] },
    ]);
  });

  it("position 슬래시 추론 — 초/중/고", () => {
    const result = parseSubjectField("기초원예", "초/중/고");
    expect(result).toEqual([
      { name: "기초원예", levels: ["ELEMENTARY", "MIDDLE", "HIGH"] },
    ]);
  });

  it("position 슬래시 추론 — 중/고", () => {
    const result = parseSubjectField("국어", "중/고");
    expect(result).toEqual([{ name: "국어", levels: ["MIDDLE", "HIGH"] }]);
  });

  it("position '중등 담임' → MIDDLE 단일", () => {
    const result = parseSubjectField("뮤지컬제작실습(중.고)", "교감/중등 담임");
    // 괄호가 우선이므로 [MIDDLE, HIGH]
    expect(result).toEqual([
      { name: "뮤지컬제작실습", levels: ["MIDDLE", "HIGH"] },
    ]);
  });

  it("괄호와 position 모두 비어 있으면 levels 빈 배열", () => {
    const result = parseSubjectField("업무지원", "-");
    expect(result).toEqual([{ name: "업무지원", levels: [] }]);
  });

  it("괄호와 position 모두 없으면 levels 빈 배열", () => {
    const result = parseSubjectField("미술생활");
    expect(result).toEqual([{ name: "미술생활", levels: [] }]);
  });

  it("trim 처리 — 앞뒤 공백/탭", () => {
    const result = parseSubjectField("  체육 ,  생활스포츠  (중.고) ");
    expect(result).toEqual([
      { name: "체육", levels: ["MIDDLE", "HIGH"] },
      { name: "생활스포츠", levels: ["MIDDLE", "HIGH"] },
    ]);
  });

  it("빈 토큰 제거 — 콤마 사이 공백만 있는 경우", () => {
    const result = parseSubjectField("국어, , 사회", "초");
    expect(result).toEqual([
      { name: "국어", levels: ["ELEMENTARY"] },
      { name: "사회", levels: ["ELEMENTARY"] },
    ]);
  });

  it("괄호 학년단이 빈 토큰이면 position 으로 폴백", () => {
    const result = parseSubjectField("자율활동()", "고");
    expect(result).toEqual([{ name: "자율활동", levels: ["HIGH"] }]);
  });

  it("괄호 안 점/슬래시/콤마 혼용", () => {
    const result = parseSubjectField("AI음악콘텐츠공방(중/고)");
    expect(result).toEqual([
      { name: "AI음악콘텐츠공방", levels: ["MIDDLE", "HIGH"] },
    ]);
  });

  it("중복 학년 토큰은 dedupe", () => {
    const result = parseSubjectField("국어(초.초)");
    expect(result).toEqual([{ name: "국어", levels: ["ELEMENTARY"] }]);
  });
});
