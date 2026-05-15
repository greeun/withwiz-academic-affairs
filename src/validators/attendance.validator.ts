import { z } from 'zod';

export const attendanceStatusEnum = z.enum(['PRESENT', 'ABSENT', 'LATE', 'EARLY_LEAVE', 'EXCUSED']);

export const createAttendanceSchema = z.object({
  studentId: z.string().min(1),
  date: z.coerce.date(),
  status: attendanceStatusEnum,
  reason: z.string().optional(),
});

export const updateAttendanceSchema = createAttendanceSchema.partial();

export const bulkAttendanceSchema = z.object({
  records: z.array(createAttendanceSchema).min(1),
});

export type CreateAttendanceDto = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceDto = z.infer<typeof updateAttendanceSchema>;
export type BulkAttendanceDto = z.infer<typeof bulkAttendanceSchema>;
