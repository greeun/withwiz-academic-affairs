import { z } from 'zod';
import { shortText, mediumText, phoneText, partialUpdate } from './common';

export const studentStatusEnum = z.enum(['ACTIVE', 'ON_LEAVE', 'GRADUATED', 'WITHDRAWN']);

export const createStudentSchema = z.object({
  name: shortText.min(1),
  grade: z.number().int().min(1),
  classGroup: z.string().max(64).optional(),
  birthDate: z.coerce.date().optional(),
  phone: phoneText.optional(),
  parentPhone: phoneText.optional(),
  parentName: shortText.optional(),
  status: studentStatusEnum.default('ACTIVE'),
  notes: mediumText.optional(),
});

export const updateStudentSchema = partialUpdate(createStudentSchema);

export type CreateStudentDto = z.infer<typeof createStudentSchema>;
export type UpdateStudentDto = z.infer<typeof updateStudentSchema>;
