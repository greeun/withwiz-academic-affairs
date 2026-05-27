/**
 * Shared zod schemas for the daily attendance API.
 *
 * Concurrency: GET returns `snapshotAt` (server-side ISO timestamp); POST echoes
 * it back. The server compares `max(entry.updatedAt, history.changedAt)` for
 * every affected (studentId, date) against `snapshotAt` and returns 409 if any
 * row is newer. Future-date input is rejected server-side (KST today is the cap).
 *
 * S5-b: 4-튜플 키 (academicYear/schoolLevel/yeroomGrade/yeroomClass) 제거 →
 * `classGroupId` 단일 키. 레거시 키가 본문/쿼리에 섞여 오면 422 + 명시적 마이그레이션
 * 메시지로 거부한다. UI 마이그레이션이 끝날 때까지 "silent fallback"은 금지.
 */
import { z } from "zod";

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const dateOnlyString = z
  .string()
  .trim()
  .regex(dateOnlyRegex, "YYYY-MM-DD 형식이어야 합니다.")
  .refine((s) => {
    const [y, m, d] = s.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return (
      dt.getUTCFullYear() === y &&
      dt.getUTCMonth() + 1 === m &&
      dt.getUTCDate() === d
    );
  }, "유효하지 않은 날짜입니다.");

/** S5-b: 레거시 4-튜플 키들. 검출되면 명시적 마이그레이션 메시지로 거부한다. */
export const LEGACY_ENTRY_KEYS = [
  "academicYear",
  "schoolLevel",
  "yeroomGrade",
  "yeroomClass",
] as const;

export const LEGACY_KEY_MESSAGE =
  "S5: classGroupId only — 4-튜플 키(academicYear/schoolLevel/yeroomGrade/yeroomClass)는 더 이상 지원하지 않습니다.";

/**
 * Returns the legacy key names present in the given record, or null if none.
 * Used by route handlers to short-circuit with a 422 migration message before
 * the schema parse layer reports a generic "Unrecognized key" error.
 */
export function detectLegacyEntryKeys(
  source: Record<string, unknown> | URLSearchParams,
): string[] | null {
  const has = (k: string): boolean =>
    source instanceof URLSearchParams
      ? source.has(k)
      : Object.prototype.hasOwnProperty.call(source, k);
  const found = LEGACY_ENTRY_KEYS.filter(has);
  return found.length ? found : null;
}

export const entryListQuerySchema = z
  .object({
    date: dateOnlyString,
    classGroupId: z.string().min(1, "classGroupId가 필요합니다."),
  })
  .strict();

export type EntryListQuery = z.infer<typeof entryListQuerySchema>;

export const entryChangeSchema = z.object({
  studentId: z.string().min(1),
  codeId: z.string().min(1).nullable(),
  memo: z.string().max(500).nullable().optional().transform((v) => v ?? null),
});

export type EntryChange = z.infer<typeof entryChangeSchema>;

export const entryBulkUpsertSchema = z
  .object({
    date: dateOnlyString,
    classGroupId: z.string().min(1, "classGroupId가 필요합니다."),
    snapshotAt: z.iso.datetime({ offset: true }),
    changes: z.array(entryChangeSchema).min(1, "변경할 항목이 없습니다."),
  })
  .strict();

export type EntryBulkUpsertInput = z.infer<typeof entryBulkUpsertSchema>;
