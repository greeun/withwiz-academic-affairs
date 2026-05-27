import { z } from "zod";

export const counselingCategoryEnum = z.enum([
  "ACADEMIC",
  "LIFE",
  "PEER",
  "CAREER",
  "FAMILY",
  "ETC",
]);
export const counselingMethodEnum = z.enum([
  "IN_PERSON",
  "PHONE",
  "TEXT",
  "VIDEO",
]);
export const counselingScopeEnum = z.enum(["STUDENT", "PARENT", "BOTH"]);

export const createCounselingSchema = z
  .object({
    studentId: z.string().min(1),
    counseledAt: z.string().datetime({ offset: true }),
    category: counselingCategoryEnum,
    method: counselingMethodEnum,
    scope: counselingScopeEnum,
    topic: z.string().min(1).max(120),
    content: z.string().min(1),
    action: z.string().nullable().optional(),
    followUpAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    followUpDone: z.boolean().optional(),
    followUpNote: z.string().nullable().optional(),
  })
  .refine(
    (v) => {
      if (!v.followUpAt) return true;
      const counseledDate = v.counseledAt.slice(0, 10);
      return v.followUpAt >= counseledDate;
    },
    { path: ["followUpAt"], message: "후속조치 예정일은 상담일자 이후여야 합니다" },
  );

export const updateCounselingSchema = z
  .object({
    studentId: z.string().min(1).optional(),
    counseledAt: z.string().datetime({ offset: true }).optional(),
    category: counselingCategoryEnum.optional(),
    method: counselingMethodEnum.optional(),
    scope: counselingScopeEnum.optional(),
    topic: z.string().min(1).max(120).optional(),
    content: z.string().min(1).optional(),
    action: z.string().nullable().optional(),
    followUpAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    followUpDone: z.boolean().optional(),
    followUpNote: z.string().nullable().optional(),
  });

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(20),
  search: z.string().optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  studentId: z.string().optional(),
  category: counselingCategoryEnum.optional(),
  method: counselingMethodEnum.optional(),
  authorId: z.string().optional(),
  followUp: z.enum(["due", "done", "none"]).optional(),
  sort: z.enum(["counseledAt", "createdAt"]).default("counseledAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateCounselingInput = z.infer<typeof createCounselingSchema>;
export type UpdateCounselingInput = z.infer<typeof updateCounselingSchema>;
export type ListCounselingQuery = z.infer<typeof listQuerySchema>;
