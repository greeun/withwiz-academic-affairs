import { describe, it, expect } from 'vitest';
import { formatDate, timeAgo } from '@/utils/date';

describe('formatDate', () => {
  it('formats date in Korean locale', () => {
    const result = formatDate('2026-03-15T00:00:00Z');
    expect(result).toMatch(/2026/);
    expect(result).toMatch(/3/);
    expect(result).toMatch(/15/);
  });

  it('handles Date object input', () => {
    const result = formatDate(new Date('2026-01-01'));
    expect(result).toMatch(/2026/);
  });
});

describe('timeAgo', () => {
  it('returns "방금" for less than 1 minute', () => {
    const now = new Date();
    expect(timeAgo(now.toISOString())).toBe('방금');
  });

  it('returns minutes for less than 1 hour', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(timeAgo(date.toISOString())).toBe('5분 전');
  });

  it('returns hours for less than 1 day', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(timeAgo(date.toISOString())).toBe('3시간 전');
  });

  it('returns days for less than 7 days', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(timeAgo(date.toISOString())).toBe('2일 전');
  });

  it('returns formatted date for 7+ days', () => {
    const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const result = timeAgo(date.toISOString());
    expect(result).toMatch(/\d/);
    expect(result).not.toContain('전');
  });
});
