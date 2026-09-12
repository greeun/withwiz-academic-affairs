import { z } from 'zod';

export const SHORT_TEXT_MAX = 200;
export const MEDIUM_TEXT_MAX = 2000;
export const LONG_TEXT_MAX = 20000;
export const URL_MAX = 2048;
export const PHONE_MAX = 40;

const SAFE_URL_SCHEMES = ['http:', 'https:'];

/** Accepts absolute http(s) URLs or site-relative paths; rejects `javascript:` and other schemes. */
export function isSafeUrl(value: string): boolean {
  if (value.startsWith('/')) return !value.startsWith('//');
  try {
    const parsed = new URL(value);
    return SAFE_URL_SCHEMES.includes(parsed.protocol);
  } catch {
    return false;
  }
}

export const safeUrl = z
  .string()
  .max(URL_MAX)
  .refine(isSafeUrl, 'http(s) URL 또는 사이트 내 경로만 허용됩니다');

export const hexColor = z.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, '#RRGGBB 형식이어야 합니다');

export const shortText = z.string().max(SHORT_TEXT_MAX);
export const mediumText = z.string().max(MEDIUM_TEXT_MAX);
export const longText = z.string().max(LONG_TEXT_MAX);
export const phoneText = z.string().max(PHONE_MAX);

type StripDefault<T> = T extends z.ZodDefault<infer U> ? U : T;
type UpdateShape<T extends z.ZodRawShape> = { [K in keyof T]: z.ZodOptional<StripDefault<T[K]>> };

/**
 * Builds a partial-update schema. Unlike `.partial()`, fields declared with `.default()` lose
 * their default, so a PUT with a subset of fields never silently resets the others.
 */
export function partialUpdate<T extends z.ZodRawShape>(schema: z.ZodObject<T>): z.ZodObject<UpdateShape<T>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const [key, field] of Object.entries(schema.shape) as [string, z.ZodTypeAny][]) {
    const base = (field instanceof z.ZodDefault ? field.removeDefault() : field) as z.ZodTypeAny;
    shape[key] = base.optional();
  }
  return z.object(shape) as unknown as z.ZodObject<UpdateShape<T>>;
}
