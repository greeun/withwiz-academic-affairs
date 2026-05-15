import { describe, it, expect } from 'vitest';
import { buildPaginatedResult } from '@/types/common';

describe('buildPaginatedResult', () => {
  it('builds correct pagination for first page', () => {
    const result = buildPaginatedResult(['a', 'b', 'c'], 10, 1, 3);

    expect(result.items).toEqual(['a', 'b', 'c']);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 3,
      total: 10,
      totalPages: 4,
      hasMore: true,
    });
  });

  it('builds correct pagination for last page', () => {
    const result = buildPaginatedResult(['j'], 10, 4, 3);

    expect(result.pagination.page).toBe(4);
    expect(result.pagination.hasMore).toBe(false);
  });

  it('handles empty items', () => {
    const result = buildPaginatedResult([], 0, 1, 10);

    expect(result.items).toEqual([]);
    expect(result.pagination.total).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
    expect(result.pagination.hasMore).toBe(false);
  });

  it('handles single page', () => {
    const result = buildPaginatedResult([1, 2, 3], 3, 1, 10);

    expect(result.pagination.totalPages).toBe(1);
    expect(result.pagination.hasMore).toBe(false);
  });
});
