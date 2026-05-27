/**
 * Sprint 3 — zod schemas for the notification API.
 */
import { z } from "zod";
import { CELL_KEYS } from "./aggregate";
import { todayKstString } from "./date-rules";

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

// S5-d: 4-튜플(`schoolLevel`,`yeroomGrade`,`yeroomClass`) 제거 → `classGroupId`
// 단일 키. Bulk ZIP 은 `classGroupId` 미지정시 caller 접근 그룹 전체.
export const notificationListQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  classGroupId: z.string().min(1, "classGroupId가 필요합니다."),
});

export const notificationBulkZipQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  classGroupId: z.string().min(1).optional(),
});

/**
 * PUT override schema — full 16-cell text map, optional classDaysOverride
 * (with required reason), optional issueDate.
 */
export const overridePutSchema = z
  .object({
    categoryTexts: z.record(z.string(), z.unknown()),
    classDaysOverride: z.number().int().nullable().optional(),
    overrideReason: z.string().nullable().optional(),
    issueDate: z
      .string()
      .nullable()
      .optional()
      .refine(
        (s) => s === null || s === undefined || dateOnlyRegex.test(s),
        "발행일은 YYYY-MM-DD 형식이어야 합니다.",
      ),
  })
  .superRefine((data, ctx) => {
    // Validate the 16 keys exist and have correct types/length.
    const keys = Object.keys(data.categoryTexts);
    if (keys.length !== CELL_KEYS.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryTexts"],
        message: "출결 특이사항 16칸 모두 키가 필요합니다.",
      });
      return;
    }
    for (const k of CELL_KEYS) {
      if (!(k in data.categoryTexts)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["categoryTexts"],
          message: "출결 특이사항 16칸 모두 키가 필요합니다.",
        });
        return;
      }
    }
    for (const k of keys) {
      if (!(CELL_KEYS as readonly string[]).includes(k)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["categoryTexts", k],
          message: "출결 특이사항 키 형식이 올바르지 않습니다.",
        });
        return;
      }
      const v = data.categoryTexts[k];
      if (typeof v !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["categoryTexts", k],
          message: "출결 특이사항 셀 값은 문자열이어야 합니다.",
        });
        return;
      }
      if (v.length > 500) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["categoryTexts", k],
          message: "출결 특이사항 한 칸은 500자 이하여야 합니다.",
        });
        return;
      }
    }
    // classDaysOverride range + reason requirement.
    const cdo = data.classDaysOverride ?? null;
    if (cdo !== null) {
      if (cdo < 0 || cdo > 31) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["classDaysOverride"],
          message: "수업일수 보정값은 0~31 사이여야 합니다.",
        });
        return;
      }
      const reason = (data.overrideReason ?? "").trim();
      if (reason.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["overrideReason"],
          message: "수업일수 보정 시 사유를 입력해야 합니다.",
        });
        return;
      }
      if (reason.length > 200) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["overrideReason"],
          message: "보정 사유는 200자 이하여야 합니다.",
        });
        return;
      }
    }
    // issueDate within 30 days from today KST.
    if (data.issueDate) {
      const today = todayKstString();
      const [y, m, d] = today.split("-").map(Number);
      const todayDt = new Date(Date.UTC(y, m - 1, d));
      const [iy, im, id] = data.issueDate.split("-").map(Number);
      const issueDt = new Date(Date.UTC(iy, im - 1, id));
      const diffDays = Math.floor(
        (issueDt.getTime() - todayDt.getTime()) / (24 * 60 * 60 * 1000),
      );
      if (diffDays > 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["issueDate"],
          message: "발행일은 오늘로부터 30일 이내여야 합니다.",
        });
        return;
      }
    }
  });

export type OverridePutInput = z.infer<typeof overridePutSchema>;
