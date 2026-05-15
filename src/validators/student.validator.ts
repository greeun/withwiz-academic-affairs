import { z } from 'zod';

export const studentStatusEnum = z.enum(['ACTIVE', 'ON_LEAVE', 'GRADUATED', 'WITHDRAWN']);

export const createStudentSchema = z.object({
  name: z.string().min(1),
  grade: z.number().int().min(1),
  classGroup: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  phone: z.string().optional(),
  parentPhone: z.string().optional(),
  parentName: z.string().optional(),
  status: studentStatusEnum.default('ACTIVE'),
  notes: z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.partial();

export type CreateStudentDto = z.infer<typeof createStudentSchema>;
export type UpdateStudentDto = z.infer<typeof updateStudentSchema>;
