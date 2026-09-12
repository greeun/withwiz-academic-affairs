import { z } from 'zod';
import { shortText, mediumText, longText, phoneText, partialUpdate } from './common';

export const counselingTypeEnum = z.enum(['INITIAL', 'REGULAR', 'EMERGENCY', 'PARENT', 'ADMISSION']);
export const counselingStatusEnum = z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']);

export const createCounselingSchema = z.object({
  studentId: z.string().max(64).optional(),
  counselorId: z.string().max(64).optional(),
  type: counselingTypeEnum,
  date: z.coerce.date(),
  title: shortText.min(1),
  content: longText.min(1),
  parentName: shortText.optional(),
  parentPhone: phoneText.optional(),
  status: counselingStatusEnum.default('SCHEDULED'),
  notes: mediumText.optional(),
});

/** `counselorId` is fixed at creation (defaults to the acting staff) and cannot be reassigned via update. */
export const updateCounselingSchema = partialUpdate(createCounselingSchema.omit({ counselorId: true }));

export type CreateCounselingDto = z.infer<typeof createCounselingSchema>;
export type UpdateCounselingDto = z.infer<typeof updateCounselingSchema>;
