/**
 * 출결관리 - 학생(Student) zod 검증 스키마.
 * 클라이언트 폼과 서버 라우트가 동일한 모듈을 import 해서 동일 규칙을 보장한다.
 *
 * S5-d: 4-튜플 키(`yeroomGrade`/`yeroomClass`/`homeroomStaffId`/`assistantHomeroomStaffId`) 제거.
 *   - `classGroupId` (반 그룹 FK), `grade` (학년), `personId|name+birthdate`(인물 연결) 기반.
 *   - 담임/부담임은 ClassGroup 에 부착되므로 학생 폼에서 제거됨.
 */
import { z } from "zod";
import { normalizeKoreanPhone } from "./guardian-phone";

// 1..99 사이의 정수
const intRange1to99 = z.number().int().min(1).max(99);

// 1..9 사이의 정수 (schoolLevel 범위 검증과 짝)
const gradeSchema = z.number().int().min(1).max(9);

// "YYYY-MM-DD" string → Date 변환 + 유효성 검증
const dateOnlyString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 합니다.")
  .refine(
    (s) => {
      const d = new Date(`${s}T00:00:00Z`);
      if (Number.isNaN(d.getTime())) return false;
      // 잘못된 날짜(예: 2026-02-30)도 거부
      const [y, m, day] = s.split("-").map(Number);
      return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === m && d.getUTCDate() === day;
    },
    { message: "유효하지 않은 날짜입니다." },
  );

// 보호자 이름·관계 공통: 빈문자열·null·undefined 모두 null 로 통일.
const optionalTextField = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label}은(는) ${max}자 이하여야 합니다.`)
    .nullable()
    .optional()
    .transform((s) => (s == null || s === "" ? null : s));

// 보호자 전화번호: 빈입력은 null, 그 외는 정규형으로 변환. 잘못된 형식은 거부.
const guardianPhoneSchema = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((s) => (s == null || s === "" ? null : s))
  .refine(
    (s) => s === null || normalizeKoreanPhone(s) !== null,
    "올바른 전화번호 형식이 아닙니다.",
  )
  .transform((s) => (s === null ? null : normalizeKoreanPhone(s)!));

export const schoolLevelSchema = z.enum(["ELEMENTARY", "MIDDLE", "HIGH"]);
export type SchoolLevelInput = z.infer<typeof schoolLevelSchema>;

const ELEMENTARY_GRADES = new Set<number>([1, 2, 3, 4, 5, 6]);
const SECONDARY_GRADES = new Set<number>([1, 2, 3]); // MIDDLE + HIGH

/**
 * Base shape — used by both create (with refine) and update (partial, no refine —
 * server merges + re-validates).
 */
const studentBaseFields = z.object({
  // 인물 식별: 기존 Person 연결시 personId, 신규 인물이면 name(+birthdate optional)
  personId: z.string().min(1).nullable().optional(),
  name: z
    .string()
    .trim()
    .min(1, "학생명을 입력해주세요.")
    .max(50, "학생명은 50자 이하여야 합니다."),
  birthdate: dateOnlyString.nullable().optional(),
  academicYear: z.number().int().min(2000).max(2100),
  classGroupId: z.string().min(1, "반(그룹)을 선택해주세요."),
  schoolLevel: schoolLevelSchema,
  grade: gradeSchema,
  // S5-d+: 출석번호는 선택 입력. 미부여 학생은 null.
  yeroomNumber: intRange1to99.nullable(),
  homeSchoolName: z
    .string()
    .trim()
    .min(1, "재적학교명을 입력해주세요.")
    .max(80, "재적학교명은 80자 이하여야 합니다."),
  homeSchoolGrade: intRange1to99,
  homeSchoolClass: intRange1to99,
  homeSchoolNumber: intRange1to99,
  consignmentStartDate: dateOnlyString,
  isActive: z.boolean().optional(),
  // 보호자 정보 (최대 2명). 모두 선택 입력. 슬롯 안에서 일부만 채울 경우 이름은 필수
  // (validateGuardianSlots 가 검증).
  guardian1Name: optionalTextField(30, "보호자 이름"),
  guardian1Phone: guardianPhoneSchema,
  guardian1Relation: optionalTextField(20, "보호자 관계"),
  guardian2Name: optionalTextField(30, "보호자 이름"),
  guardian2Phone: guardianPhoneSchema,
  guardian2Relation: optionalTextField(20, "보호자 관계"),
});

export type StudentBaseFields = z.infer<typeof studentBaseFields>;

export interface CrossFieldIssue {
  path: ReadonlyArray<string>;
  message: string;
}

/** S5-d: 학교급 ↔ 학년 범위 검증 (담임/부담임은 ClassGroup 에서 관리). */
export function validateStudentCrossFields(
  data: {
    schoolLevel?: SchoolLevelInput;
    grade?: number;
  },
): CrossFieldIssue[] {
  const issues: CrossFieldIssue[] = [];

  if (data.schoolLevel !== undefined && data.grade !== undefined) {
    if (data.schoolLevel === "ELEMENTARY" && !ELEMENTARY_GRADES.has(data.grade)) {
      issues.push({
        path: ["grade"],
        message: "초등학교는 1~6학년만 가능합니다.",
      });
    } else if (data.schoolLevel === "MIDDLE" && !SECONDARY_GRADES.has(data.grade)) {
      issues.push({
        path: ["grade"],
        message: "중학교는 1~3학년만 가능합니다.",
      });
    } else if (data.schoolLevel === "HIGH" && !SECONDARY_GRADES.has(data.grade)) {
      issues.push({
        path: ["grade"],
        message: "고등학교는 1~3학년만 가능합니다.",
      });
    }
  }

  return issues;
}

function applyCrossFieldRefine(data: StudentBaseFields, ctx: z.RefinementCtx): void {
  const issues = [...validateStudentCrossFields(data), ...validateGuardianSlots(data)];
  for (const i of issues) {
    ctx.addIssue({
      code: "custom",
      path: [...i.path],
      message: i.message,
    });
  }
}

export const studentCreateSchema = studentBaseFields.superRefine(applyCrossFieldRefine);
export type StudentCreateInput = z.infer<typeof studentCreateSchema>;

/**
 * Partial schema for PUT. NO refines — the route handler fetches the current
 * row, merges with the patch, and runs `validateStudentCrossFields` server-side.
 */
export const studentUpdateSchema = studentBaseFields.partial();
export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>;

/**
 * 슬롯별 보호자 검증: 이름·연락처·관계 중 하나라도 입력되면 이름은 필수.
 * 두 슬롯 모두 비어 있으면 통과.
 */
export function validateGuardianSlots(data: {
  guardian1Name?: string | null;
  guardian1Phone?: string | null;
  guardian1Relation?: string | null;
  guardian2Name?: string | null;
  guardian2Phone?: string | null;
  guardian2Relation?: string | null;
}): CrossFieldIssue[] {
  const issues: CrossFieldIssue[] = [];
  for (const slot of [1, 2] as const) {
    const name = data[`guardian${slot}Name`];
    const phone = data[`guardian${slot}Phone`];
    const relation = data[`guardian${slot}Relation`];
    const any = !!(name || phone || relation);
    if (any && !name) {
      issues.push({
        path: [`guardian${slot}Name`],
        message: "연락처·관계가 입력된 경우 보호자 이름은 필수입니다.",
      });
    }
  }
  return issues;
}

/** Build a complete object for cross-field re-validation. */
export function mergeStudentForCrossField(
  existing: { schoolLevel: SchoolLevelInput; grade: number },
  patch: { schoolLevel?: SchoolLevelInput; grade?: number },
): { schoolLevel: SchoolLevelInput; grade: number } {
  return {
    schoolLevel: patch.schoolLevel ?? existing.schoolLevel,
    grade: patch.grade ?? existing.grade,
  };
}

// parseDateOnly is exported by date-rules.ts in the same barrel — no re-export here.

/** Prisma Date 객체를 YYYY-MM-DD 문자열로 직렬화. */
export function formatDateOnly(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Unicode NFC 정규화 — 검색·중복 검사 일관성. */
export function normalizeName(name: string): string {
  return name.normalize("NFC");
}
