import { z } from 'zod';

export const createFaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  categoryId: z.string().optional(),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const updateFaqSchema = createFaqSchema.partial();

export const createFaqCategorySchema = z.object({
  name: z.string().min(1),
  order: z.number().int().default(0),
});

export const updateFaqCategorySchema = createFaqCategorySchema.partial();

export type CreateFaqDto = z.infer<typeof createFaqSchema>;
export type UpdateFaqDto = z.infer<typeof updateFaqSchema>;
export type CreateFaqCategoryDto = z.infer<typeof createFaqCategorySchema>;
export type UpdateFaqCategoryDto = z.infer<typeof updateFaqCategorySchema>;
