import { z } from 'zod';
import { mediumText, partialUpdate } from './common';

export const attendanceStatusEnum = z.enum(['PRESENT', 'ABSENT', 'LATE', 'EARLY_LEAVE', 'EXCUSED']);

export const MAX_BULK_ATTENDANCE = 500;

export const createAttendanceSchema = z.object({
  studentId: z.string().min(1).max(64),
  date: z.coerce.date(),
  status: attendanceStatusEnum,
  reason: mediumText.optional(),
});

/** A record stays attached to its student; `studentId` cannot be changed via update. */
export const updateAttendanceSchema = partialUpdate(createAttendanceSchema.omit({ studentId: true }));

export const bulkAttendanceSchema = z.object({
  records: z.array(createAttendanceSchema).min(1).max(MAX_BULK_ATTENDANCE),
});

export type CreateAttendanceDto = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceDto = z.infer<typeof updateAttendanceSchema>;
export type BulkAttendanceDto = z.infer<typeof bulkAttendanceSchema>;
