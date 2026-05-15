import { z } from 'zod';

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
  title: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  semester: z.number().int().min(1).max(2),
  schoolLevel: z.string().min(1),
  fileUrl: z.string().optional(),
  content: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateTimetableSchema = createTimetableSchema.partial();

export const createAcademicEventSchema = z.object({
  title: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  type: academicEventTypeEnum,
  schoolLevel: z.string().optional(),
  description: z.string().optional(),
  isAllDay: z.boolean().default(true),
  color: z.string().optional(),
  isPublished: z.boolean().default(true),
});

export const updateAcademicEventSchema = createAcademicEventSchema.partial();

export type CreateTimetableDto = z.infer<typeof createTimetableSchema>;
export type UpdateTimetableDto = z.infer<typeof updateTimetableSchema>;
export type CreateAcademicEventDto = z.infer<typeof createAcademicEventSchema>;
export type UpdateAcademicEventDto = z.infer<typeof updateAcademicEventSchema>;
