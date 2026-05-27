import { describe, expect, it } from 'vitest';
import { SystemClock, type IClock } from '@/infrastructure/clock';

describe('SystemClock', () => {
  it('implements IClock', () => {
    const clock: IClock = new SystemClock();
    expect(typeof clock.now).toBe('function');
  });

  it('returns a Date close to the actual now()', () => {
    const clock = new SystemClock();
    const before = Date.now();
    const actual = clock.now().getTime();
    const after = Date.now();
    expect(actual).toBeGreaterThanOrEqual(before);
    expect(actual).toBeLessThanOrEqual(after);
  });
});
