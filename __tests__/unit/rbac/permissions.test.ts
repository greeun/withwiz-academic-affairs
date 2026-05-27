import { describe, expect, it, vi } from 'vitest';
import { permissionsOf } from '@/rbac/permissions';

function makePrismaMock(userPayload: unknown) {
  return {
    user: {
      findUnique: vi.fn(async () => userPayload),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe('permissionsOf', () => {
  it('returns null when user not found', async () => {
    const prisma = makePrismaMock(null);
    const result = await permissionsOf(prisma, 'u1');
    expect(result).toBeNull();
  });

  it('flattens menuKeys from direct user roles', async () => {
    const prisma = makePrismaMock({
      userRoles: [
        { role: { id: 'r1', name: 'admin', isSystem: false, permissions: [{ menuKey: 'attendance' }, { menuKey: 'blog' }] } },
      ],
      userGroups: [],
    });
    const result = await permissionsOf(prisma, 'u1');
    expect(result).not.toBeNull();
    expect([...result!.menuKeys].sort()).toEqual(['attendance', 'blog']);
    expect(result!.isSystem).toBe(false);
    expect(result!.hasMenuKey('attendance')).toBe(true);
    expect(result!.hasMenuKey('news')).toBe(false);
  });

  it('flattens menuKeys from user groups (4-tier)', async () => {
    const prisma = makePrismaMock({
      userRoles: [],
      userGroups: [
        {
          group: {
            groupRoles: [
              { role: { id: 'r2', name: 'teacher', isSystem: false, permissions: [{ menuKey: 'class-journal' }] } },
            ],
          },
        },
      ],
    });
    const result = await permissionsOf(prisma, 'u1');
    expect([...result!.menuKeys].sort()).toEqual(['class-journal']);
  });

  it('dedupes menuKeys across direct roles and group roles', async () => {
    const prisma = makePrismaMock({
      userRoles: [
        { role: { id: 'r1', name: 'admin', isSystem: false, permissions: [{ menuKey: 'attendance' }] } },
      ],
      userGroups: [
        {
          group: {
            groupRoles: [
              { role: { id: 'r1', name: 'admin', isSystem: false, permissions: [{ menuKey: 'attendance' }] } },
            ],
          },
        },
      ],
    });
    const result = await permissionsOf(prisma, 'u1');
    expect([...result!.menuKeys]).toEqual(['attendance']);
    expect(result!.roles).toHaveLength(1);
  });

  it('reports isSystem true when any role is system', async () => {
    const prisma = makePrismaMock({
      userRoles: [
        { role: { id: 'r1', name: 'super', isSystem: true, permissions: [] } },
      ],
      userGroups: [],
    });
    const result = await permissionsOf(prisma, 'u1');
    expect(result!.isSystem).toBe(true);
  });
});
