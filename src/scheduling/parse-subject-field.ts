// 자유 문자열 `Staff.subject` (예: "체육, 생활스포츠(중.고)", "음식만들기(초)", "국어, 사회")
// 와 `Staff.position` (예: "초", "중/고", "초/중/고", "중등 담임") 를 받아
// (과목명, 학년단 배열) 후보 리스트로 분해한다.
//
// spec: docs/superpowers/specs/2026-05-25-subject-management-design.md §5.2
//
// 본 함수는 read-only · 순수 함수다. DB 의존 없음.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchoolLevel = any;

export interface ParsedSubject {
  name: string;
  levels: SchoolLevel[];
}

const LEVEL_TOKEN_MAP: Record<string, SchoolLevel> = {
  "초": "ELEMENTARY",
  "초등": "ELEMENTARY",
  "중": "MIDDLE",
  "중등": "MIDDLE",
  "고": "HIGH",
  "고등": "HIGH",
};

// 괄호 안 학년 표기를 SchoolLevel[] 로 분해.
// 허용 구분자: 점(.) / 쉼표(,) / 슬래시(/) / 공백.
function parseLevelTokens(raw: string): SchoolLevel[] {
  const tokens = raw.split(/[.,/\s]+/).map((s) => s.trim()).filter(Boolean);
  const set = new Set<SchoolLevel>();
  for (const t of tokens) {
    const mapped = LEVEL_TOKEN_MAP[t];
    if (mapped) set.add(mapped);
  }
  return Array.from(set);
}

// position 문자열에서 학년단을 추론.
// - "초/중/고" → [ELEMENTARY, MIDDLE, HIGH]
// - "중/고" → [MIDDLE, HIGH]
// - "초" → [ELEMENTARY]
// - "초등 담임", "중등 부담임" → 해당 학년단 단일
// - 매칭 실패 → 빈 배열
function inferLevelsFromPosition(position: string | null | undefined): SchoolLevel[] {
  if (!position) return [];
  return parseLevelTokens(position);
}

/**
 * 자유 문자열 과목 필드를 분해해 (과목명, 학년단 배열) 후보 리스트로 반환한다.
 *
 * @param raw      Staff.subject 와 같은 자유 텍스트. null/undefined/공란 허용.
 * @param position Staff.position 같은 보조 문자열 — raw 에 괄호 학년단이 없을 때 추론에 사용.
 * @returns         과목 후보 배열. trim, 빈 토큰 제거. 빈 입력은 빈 배열.
 */
export function parseSubjectField(
  raw: string | null | undefined,
  position?: string | null,
): ParsedSubject[] {
  if (raw == null) return [];
  const text = String(raw).trim();
  if (!text) return [];

  // 1) 괄호 학년 표기 추출. 마지막 괄호를 기준으로 본 spec 의도.
  //    "체육, 생활스포츠(중.고)" → bracket="중.고"
  //    "AI미디어활용(중.고)"       → bracket="중.고"
  //    "음식만들기(초)"            → bracket="초"
  //    "국어, 사회"                → bracket=null
  let bracketLevels: SchoolLevel[] | null = null;
  let stripped = text;
  const bracketRegex = /\(([^()]*)\)\s*$/u;
  const match = text.match(bracketRegex);
  if (match) {
    bracketLevels = parseLevelTokens(match[1]);
    stripped = text.slice(0, match.index).trim();
  }

  // 2) 괄호가 없거나 학년단 매칭이 비어 있으면 position 으로 추론.
  const positionLevels = inferLevelsFromPosition(position ?? null);
  const levels: SchoolLevel[] =
    bracketLevels && bracketLevels.length > 0 ? bracketLevels : positionLevels;

  // 3) 괄호 제거된 본문을 콤마로 분해. 슬래시는 과목 구분자가 아닐 수 있어
  //    spec §5.2 "괄호 제거 후 콤마 분해"에 따라 콤마(,)만 분할자로 사용.
  const names = stripped
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return names.map((name) => ({ name, levels: [...levels] }));
}
