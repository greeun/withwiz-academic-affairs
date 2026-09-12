import { z } from 'zod';
import { safeUrl, hexColor, shortText, mediumText, longText, partialUpdate } from './common';

export const academicEventTypeEnum = z.enum([
  'SEMESTER_START',
  'SEMESTER_END',
  'EXAM',
  'VACATION',
  'HOLIDAY',
  'EVENT',
  'FIELD_TRIP',
  'PARENT_MEETING',
  'OTHER',
]);

export const createTimetableSchema = z.object({
  title: shortText.min(1),
  year: z.number().int().min(2000).max(2100),
  semester: z.number().int().min(1).max(2),
  schoolLevel: z.string().min(1).max(32),
  fileUrl: safeUrl.optional(),
  content: longText.optional(),
  isActive: z.boolean().default(true),
});

export const updateTimetableSchema = partialUpdate(createTimetableSchema);

export const createAcademicEventSchema = z.object({
  title: shortText.min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  type: academicEventTypeEnum,
  schoolLevel: z.string().max(32).optional(),
  description: mediumText.optional(),
  isAllDay: z.boolean().default(true),
  color: hexColor.optional(),
  isPublished: z.boolean().default(true),
});

export const updateAcademicEventSchema = partialUpdate(createAcademicEventSchema);

export type CreateTimetableDto = z.infer<typeof createTimetableSchema>;
export type UpdateTimetableDto = z.infer<typeof updateTimetableSchema>;
export type CreateAcademicEventDto = z.infer<typeof createAcademicEventSchema>;
export type UpdateAcademicEventDto = z.infer<typeof updateAcademicEventSchema>;
