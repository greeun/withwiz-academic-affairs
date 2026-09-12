import { z } from 'zod';
import { shortText, longText, partialUpdate } from './common';

export const createFaqSchema = z.object({
  question: z.string().min(1).max(500),
  answer: longText.min(1),
  categoryId: z.string().max(64).optional(),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const updateFaqSchema = partialUpdate(createFaqSchema);

export const createFaqCategorySchema = z.object({
  name: shortText.min(1),
  order: z.number().int().default(0),
});

export const updateFaqCategorySchema = partialUpdate(createFaqCategorySchema);

export type CreateFaqDto = z.infer<typeof createFaqSchema>;
export type UpdateFaqDto = z.infer<typeof updateFaqSchema>;
export type CreateFaqCategoryDto = z.infer<typeof createFaqCategorySchema>;
export type UpdateFaqCategoryDto = z.infer<typeof updateFaqCategorySchema>;
