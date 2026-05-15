import { describe, it, expect } from 'vitest';
import { parseSortParam, DEFAULT_PAGE, DEFAULT_LIMIT } from '@/services/base-service';

describe('parseSortParam', () => {
  const allowed = ['createdAt', 'name', 'sortOrder'];

  it('parses valid field and desc order', () => {
    const result = parseSortParam('createdAt_desc', allowed, 'createdAt');
    expect(result).toEqual({ field: 'createdAt', order: 'desc' });
  });

  it('parses valid field and asc order', () => {
    const result = parseSortParam('name_asc', allowed, 'createdAt');
    expect(result).toEqual({ field: 'name', order: 'asc' });
  });

  it('falls back to default field for unknown field', () => {
    const result = parseSortParam('unknown_asc', allowed, 'createdAt');
    expect(result).toEqual({ field: 'createdAt', order: 'asc' });
  });

  it('defaults to desc order when order is missing', () => {
    const result = parseSortParam('name', allowed, 'createdAt');
    expect(result.order).toBe('desc');
  });

  it('defaults to desc order for invalid order value', () => {
    const result = parseSortParam('name_invalid', allowed, 'createdAt');
    expect(result.order).toBe('desc');
  });
});

describe('constants', () => {
  it('DEFAULT_PAGE is 1', () => {
    expect(DEFAULT_PAGE).toBe(1);
  });

  it('DEFAULT_LIMIT is 20', () => {
    expect(DEFAULT_LIMIT).toBe(20);
  });
});
