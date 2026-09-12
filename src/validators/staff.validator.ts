import { z } from 'zod';
import { safeUrl, shortText, mediumText, phoneText, partialUpdate } from './common';

export const createStaffSchema = z.object({
  name: shortText.min(1),
  nameEn: shortText.optional(),
  role: shortText.min(1),
  department: shortText.optional(),
  phone: phoneText.optional(),
  email: z.string().email().max(200).optional(),
  photoUrl: safeUrl.optional(),
  bio: mediumText.optional(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const updateStaffSchema = partialUpdate(createStaffSchema);

export type CreateStaffDto = z.infer<typeof createStaffSchema>;
export type UpdateStaffDto = z.infer<typeof updateStaffSchema>;
