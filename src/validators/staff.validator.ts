import { z } from 'zod';

export const createStaffSchema = z.object({
  name: z.string().min(1),
  nameEn: z.string().optional(),
  role: z.string().min(1),
  department: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  photoUrl: z.string().optional(),
  bio: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const updateStaffSchema = createStaffSchema.partial();

export type CreateStaffDto = z.infer<typeof createStaffSchema>;
export type UpdateStaffDto = z.infer<typeof updateStaffSchema>;
