import { describe, expect, it } from 'vitest';
import { createSchoolAffairs } from '@/facade';
import type { IAuthProvider } from '@/auth/provider';

const fakeAuth: IAuthProvider = {
  async getCurrentStaff() {
    return null;
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fakePrisma = {} as any;

describe('createSchoolAffairs', () => {
  it('resolves locale defaults', () => {
    const sa = createSchoolAffairs({
      prisma: fakePrisma,
      auth: fakeAuth,
      rbac: { menuKeys: ['attendance'] },
    });
    expect(sa.config.locale.holidays).toBeNull();
    expect(sa.config.locale.academicYearStart).toEqual({ month: 3, day: 1 });
  });

  it('honors caller-provided locale', () => {
    const sa = createSchoolAffairs({
      prisma: fakePrisma,
      auth: fakeAuth,
      rbac: { menuKeys: [] },
      locale: { holidays: 'ko-KR', academicYearStart: { month: 4, day: 1 } },
    });
    expect(sa.config.locale.holidays).toBe('ko-KR');
    expect(sa.config.locale.academicYearStart).toEqual({ month: 4, day: 1 });
  });

  it('reports presence of optional capabilities', () => {
    const sa = createSchoolAffairs({
      prisma: fakePrisma,
      auth: fakeAuth,
      rbac: { menuKeys: [] },
    });
    expect(sa.config.hasSms).toBe(false);
    expect(sa.config.hasMailer).toBe(false);
    expect(sa.config.hasStorage).toBe(false);
  });

  it('throws on empty rbac.menuKeys when apiToMenu references keys not in the set', () => {
    expect(() =>
      createSchoolAffairs({
        prisma: fakePrisma,
        auth: fakeAuth,
        rbac: { menuKeys: ['a'], apiToMenu: { '/x': 'b' } },
      })
    ).toThrow(/menuKey "b" not declared/);
  });

  it('rbac.isConfigured returns true when menuKeys non-empty', () => {
    const sa = createSchoolAffairs({
      prisma: fakePrisma,
      auth: fakeAuth,
      rbac: { menuKeys: ['attendance'] },
    });
    expect(sa.rbac.isConfigured()).toBe(true);
  });

  it('exposes rbac.permissionsOf bound to prisma', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaMock = { user: { findUnique: async () => null } } as any;
    const sa = createSchoolAffairs({
      prisma: prismaMock,
      auth: fakeAuth,
      rbac: { menuKeys: ['attendance'] },
    });
    expect(typeof sa.rbac.permissionsOf).toBe('function');
    const result = await sa.rbac.permissionsOf('u1');
    expect(result).toBeNull();
  });

  it('exposes rbac.withMenuApi/withAnyAdminApi/withSuperAdminApi', () => {
    const sa = createSchoolAffairs({
      prisma: fakePrisma,
      auth: fakeAuth,
      rbac: { menuKeys: ['attendance'], superAdminOnlyKeys: ['roles'] },
    });
    expect(typeof sa.rbac.withMenuApi).toBe('function');
    expect(typeof sa.rbac.withAnyAdminApi).toBe('function');
    expect(typeof sa.rbac.withSuperAdminApi).toBe('function');
  });
});
