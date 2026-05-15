import { z } from 'zod';

export const registrationStatusEnum = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'ATTENDED']);

export const createAdmissionSessionSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  location: z.string().optional(),
  capacity: z.number().int().min(1).default(30),
  description: z.string().optional(),
  isOpen: z.boolean().default(true),
});

export const updateAdmissionSessionSchema = createAdmissionSessionSchema.partial();

export const createAdmissionRegistrationSchema = z.object({
  sessionId: z.string().min(1),
  applicantName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  studentName: z.string().min(1),
  studentGrade: z.string().optional(),
  message: z.string().optional(),
  status: registrationStatusEnum.default('PENDING'),
});

export const updateAdmissionRegistrationSchema = createAdmissionRegistrationSchema.partial();

export type CreateAdmissionSessionDto = z.infer<typeof createAdmissionSessionSchema>;
export type UpdateAdmissionSessionDto = z.infer<typeof updateAdmissionSessionSchema>;
export type CreateAdmissionRegistrationDto = z.infer<typeof createAdmissionRegistrationSchema>;
export type UpdateAdmissionRegistrationDto = z.infer<typeof updateAdmissionRegistrationSchema>;
