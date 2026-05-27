/**
 * Sprint 3 — monthly attendance aggregation for notifications.
 *
 * Produces:
 * - `counts`: 16 cells keyed `${aggregateCategory}_${aggregateReason}`.
 *   `EXPERIENCE_LEARNING` is naturally folded into `ABSENT_AUTHORIZED` because
 *   its aggregateCategory/aggregateReason are set so in the seed.
 * - `drafts`: 16 cells of auto-draft text built from entries' code displayName
 *   + memo. Tokens joined by **two spaces** (Sprint 3 contract Q9 + amendment
 *   (h)). Tokens are NOT date-collapsed (one entry → one token).
 *
 * Invariant (amendment (n)): each AttendanceEntry contributes to exactly ONE
 * of the 16 cells. EXPERIENCE_LEARNING never appears in 2 cells.
 */

export const CATEGORIES = ["ABSENT", "LATE", "EARLY_LEAVE", "RESULT"] as const;
export const REASONS = ["SICK", "UNAUTH", "OTHER", "AUTHORIZED"] as const;

export type CategoryKey = (typeof CATEGORIES)[number];
export type ReasonKey = (typeof REASONS)[number];
export type CellKey = `${CategoryKey}_${ReasonKey}`;

export const CELL_KEYS: CellKey[] = CATEGORIES.flatMap((c) =>
  REASONS.map((r) => `${c}_${r}` as CellKey),
);

export function makeEmptyCounts(): Record<CellKey, number> {
  const out = {} as Record<CellKey, number>;
  for (const k of CELL_KEYS) out[k] = 0;
  return out;
}

export function makeEmptyDrafts(): Record<CellKey, string> {
  const out = {} as Record<CellKey, string>;
  for (const k of CELL_KEYS) out[k] = "";
  return out;
}

export interface EntryWithCode {
  date: Date;
  memo: string | null;
  code: {
    aggregateCategory: CategoryKey;
    aggregateReason: ReasonKey;
    displayName: string;
  };
}

export interface AggregateResult {
  counts: Record<CellKey, number>;
  drafts: Record<CellKey, string>;
}

/**
 * Aggregate one student's entries for a calendar (year, month).
 * Caller must pre-filter to a single student and the desired month.
 */
export function aggregateEntries(entries: EntryWithCode[]): AggregateResult {
  const counts = makeEmptyCounts();
  // Per-cell token buffer (preserving sort + memo trimming rules).
  const tokens: Record<CellKey, string[]> = {} as Record<CellKey, string[]>;
  for (const k of CELL_KEYS) tokens[k] = [];

  const sorted = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
  for (const e of sorted) {
    const key = `${e.code.aggregateCategory}_${e.code.aggregateReason}` as CellKey;
    counts[key] = (counts[key] ?? 0) + 1;
    // Use UTC parts because entry.date is stored as @db.Date (UTC midnight).
    const m = e.date.getUTCMonth() + 1;
    const d = e.date.getUTCDate();
    const memo = (e.memo ?? "").trim();
    const token = memo
      ? `${m}/${d} ${e.code.displayName}(${memo})`
      : `${m}/${d} ${e.code.displayName}`;
    tokens[key].push(token);
  }

  const drafts = makeEmptyDrafts();
  for (const k of CELL_KEYS) {
    drafts[k] = tokens[k].join("  ");
  }
  return { counts, drafts };
}

/**
 * Validate that an arbitrary record has exactly the 16 expected keys and no
 * extras. Returns null on success or an error message.
 */
export function validateCellKeySet(obj: Record<string, unknown>): string | null {
  const keys = Object.keys(obj);
  if (keys.length !== CELL_KEYS.length) {
    return "출결 특이사항 16칸 모두 키가 필요합니다.";
  }
  for (const k of CELL_KEYS) {
    if (!(k in obj)) return "출결 특이사항 16칸 모두 키가 필요합니다.";
  }
  for (const k of keys) {
    if (!(CELL_KEYS as readonly string[]).includes(k)) {
      return "출결 특이사항 키 형식이 올바르지 않습니다.";
    }
  }
  return null;
}

/**
 * Resolve the final per-cell display text for a notification.
 * Sprint 3 amendment (f): whitespace-only override == draft.
 */
export function resolveCellTexts(
  drafts: Record<CellKey, string>,
  override: Partial<Record<CellKey, string>> | null | undefined,
): Record<CellKey, string> {
  const out = makeEmptyDrafts();
  for (const k of CELL_KEYS) {
    const ov = override?.[k];
    const trimmed = typeof ov === "string" ? ov.trim() : "";
    out[k] = trimmed.length > 0 ? (ov as string) : drafts[k];
  }
  return out;
}
