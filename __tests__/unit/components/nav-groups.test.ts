import { describe, it, expect } from 'vitest';
import { toggleGroupCollapsed } from '@/components/nav-groups';

describe('toggleGroupCollapsed', () => {
  it('adds a group when not present (collapses it)', () => {
    expect(toggleGroupCollapsed([], '콘텐츠')).toEqual(['콘텐츠']);
  });

  it('removes a group when present (expands it)', () => {
    expect(toggleGroupCollapsed(['콘텐츠', '출결'], '콘텐츠')).toEqual(['출결']);
  });

  it('does not mutate the input array', () => {
    const input = ['콘텐츠'];
    toggleGroupCollapsed(input, '출결');
    expect(input).toEqual(['콘텐츠']);
  });
});
