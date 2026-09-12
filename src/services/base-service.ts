import type { SortOrder } from '../types/common';

export { buildPaginatedResult } from '../types/common';
export type { PaginatedResult, SortOrder } from '../types/common';

export interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

export function parseSortParam(
  sortBy: string,
  allowed: string[],
  defaultField: string,
): { field: string; order: SortOrder } {
  const [field, order] = sortBy.split('_');
  const safeField = allowed.includes(field) ? field : defaultField;
  const safeOrder: SortOrder = order === 'asc' ? 'asc' : 'desc';
  return { field: safeField, order: safeOrder };
}

/**
 * Projection used when a student is embedded in another record (attendance, counseling).
 * Contact details, birth date and notes are deliberately excluded; fetch the student directly
 * when they are needed.
 */
export const STUDENT_SUMMARY_SELECT = {
  id: true,
  name: true,
  grade: true,
  classGroup: true,
  status: true,
} as const;
