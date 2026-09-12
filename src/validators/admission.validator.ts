import { z } from 'zod';
import { shortText, mediumText, phoneText, partialUpdate } from './common';

export const registrationStatusEnum = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'ATTENDED']);

export const createAdmissionSessionSchema = z.object({
  title: shortText.min(1),
  date: z.coerce.date(),
  location: shortText.optional(),
  capacity: z.number().int().min(1).max(100000).default(30),
  description: mediumText.optional(),
  isOpen: z.boolean().default(true),
});

export const updateAdmissionSessionSchema = partialUpdate(createAdmissionSessionSchema);

export const createAdmissionRegistrationSchema = z.object({
  sessionId: z.string().min(1).max(64),
  applicantName: shortText.min(1),
  phone: phoneText.min(1),
  email: z.string().email().max(200).optional(),
  studentName: shortText.min(1),
  studentGrade: z.string().max(32).optional(),
  message: mediumText.optional(),
  status: registrationStatusEnum.default('PENDING'),
});

export const updateAdmissionRegistrationSchema = partialUpdate(createAdmissionRegistrationSchema);

export type CreateAdmissionSessionDto = z.infer<typeof createAdmissionSessionSchema>;
export type UpdateAdmissionSessionDto = z.infer<typeof updateAdmissionSessionSchema>;
export type CreateAdmissionRegistrationDto = z.infer<typeof createAdmissionRegistrationSchema>;
export type UpdateAdmissionRegistrationDto = z.infer<typeof updateAdmissionRegistrationSchema>;
