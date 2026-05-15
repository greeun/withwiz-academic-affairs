import { describe, it, expect } from 'vitest';
import type { AdminShellConfig, NavItem } from '@/components/AdminShellConfig';

describe('AdminShellConfig types', () => {
  it('NavItem requires href, label, shortLabel', () => {
    const item: NavItem = {
      href: '/admin/dashboard',
      label: '대시보드',
      shortLabel: 'D',
    };

    expect(item.href).toBe('/admin/dashboard');
    expect(item.label).toBe('대시보드');
    expect(item.shortLabel).toBe('D');
  });

  it('AdminShellConfig requires brand, auth, navigation', () => {
    const config: AdminShellConfig = {
      brand: {
        name: '예룸예술학교',
        shortName: '예룸',
        homeUrl: '/',
      },
      auth: {
        meEndpoint: '/api/auth/me',
        logoutEndpoint: '/api/auth/logout',
        loginPath: '/admin/login',
      },
      navigation: [
        { href: '/admin/dashboard', label: '대시보드', shortLabel: 'D' },
        { href: '/admin/blog', label: '블로그', shortLabel: 'B' },
      ],
    };

    expect(config.brand.name).toBe('예룸예술학교');
    expect(config.auth.meEndpoint).toBe('/api/auth/me');
    expect(config.navigation).toHaveLength(2);
  });

  it('theme is optional with accentColor', () => {
    const config: AdminShellConfig = {
      brand: { name: 'Test', homeUrl: '/' },
      auth: {
        meEndpoint: '/api/auth/me',
        logoutEndpoint: '/api/auth/logout',
        loginPath: '/admin/login',
      },
      navigation: [],
      theme: { accentColor: '#FF0000' },
    };

    expect(config.theme?.accentColor).toBe('#FF0000');
  });
});
