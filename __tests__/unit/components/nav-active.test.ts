import { describe, it, expect } from 'vitest';
import { isNavItemActive } from '@/components/nav-active';

describe('isNavItemActive', () => {
  it('exact match is active', () => {
    expect(isNavItemActive('/admin/dashboard', '/admin/dashboard')).toBe(true);
  });

  it('nested path activates its parent nav item', () => {
    expect(isNavItemActive('/admin/attendance/daily', '/admin/attendance/daily')).toBe(true);
    expect(isNavItemActive('/admin/blog/123/edit', '/admin/blog')).toBe(true);
  });

  it('sibling prefix does NOT false-match (/admin/blog vs /admin/blogger)', () => {
    expect(isNavItemActive('/admin/blogger', '/admin/blog')).toBe(false);
  });

  it('unrelated path is not active', () => {
    expect(isNavItemActive('/admin/news', '/admin/blog')).toBe(false);
  });

  it('trailing slash tolerated', () => {
    expect(isNavItemActive('/admin/blog/', '/admin/blog')).toBe(true);
  });
});
