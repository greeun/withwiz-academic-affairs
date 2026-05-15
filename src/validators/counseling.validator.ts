import { z } from 'zod';

export const counselingTypeEnum = z.enum(['INITIAL', 'REGULAR', 'EMERGENCY', 'PARENT', 'ADMISSION']);
export const counselingStatusEnum = z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']);

export const createCounselingSchema = z.object({
  studentId: z.string().optional(),
  counselorId: z.string().optional(),
  type: counselingTypeEnum,
  date: z.coerce.date(),
  title: z.string().min(1),
  content: z.string().min(1),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  status: counselingStatusEnum.default('SCHEDULED'),
  notes: z.string().optional(),
});

export const updateCounselingSchema = createCounselingSchema.partial();

export type CreateCounselingDto = z.infer<typeof createCounselingSchema>;
export type UpdateCounselingDto = z.infer<typeof updateCounselingSchema>;
