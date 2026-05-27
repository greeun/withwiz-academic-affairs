/**
 * S4/S5 — 학교급 short/long labels. S5-d 에서 ClassKey-기반 `formatClassLabel` 은
 * 제거되었다 (호출자 없음). `SCHOOL_LEVEL_SHORT` 기반의 학년 라벨 (예: `초5`,
 * `중1`, `고2`) 만 UI 에서 사용한다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchoolLevel = any;

export const SCHOOL_LEVEL_SHORT: Record<SchoolLevel, "초" | "중" | "고"> = {
  ELEMENTARY: "초",
  MIDDLE: "중",
  HIGH: "고",
};

export const SCHOOL_LEVEL_LONG: Record<SchoolLevel, string> = {
  ELEMENTARY: "초등학교",
  MIDDLE: "중학교",
  HIGH: "고등학교",
};

export function formatSchoolLevel(level: SchoolLevel): "초" | "중" | "고" {
  return SCHOOL_LEVEL_SHORT[level];
}
