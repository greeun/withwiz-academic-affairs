import { describe, expect, it, vi } from 'vitest';
import { createMenuApi } from '@/rbac/with-menu-api';
import type { IAuthProvider } from '@/auth/provider';
import type { StaffActor } from '@/types/actor';

function fakeAuth(actor: StaffActor | null): IAuthProvider {
  return {
    async getCurrentStaff() {
      return actor;
    },
  };
}

const okHandler = vi.fn(async () =>
  new Response(JSON.stringify({ success: true, data: 'ok' }), { status: 200 })
);

function makeReq() {
  return new Request('http://test.local/api/admin/x');
}

describe('createMenuApi → withMenuApi', () => {
  it('returns 401 when actor is null', async () => {
    const { withMenuApi } = createMenuApi({
      auth: fakeAuth(null),
      superAdminOnlyKeys: ['roles'],
    });
    const wrapped = withMenuApi('attendance', okHandler);
    const res = await wrapped(makeReq());
    expect(res.status).toBe(401);
  });

  it('returns 403 when actor has no permissions and is not system', async () => {
    const actor: StaffActor = { userId: 'u1', staffId: 's1', permissions: [], groups: [] };
    const { withMenuApi } = createMenuApi({
      auth: fakeAuth(actor),
      superAdminOnlyKeys: ['roles'],
    });
    const wrapped = withMenuApi('attendance', okHandler);
    const res = await wrapped(makeReq());
    expect(res.status).toBe(403);
  });

  it('passes through when actor permissions include menuKey', async () => {
    const actor: StaffActor = { userId: 'u1', staffId: 's1', permissions: ['attendance'], groups: [] };
    const { withMenuApi } = createMenuApi({
      auth: fakeAuth(actor),
      superAdminOnlyKeys: ['roles'],
    });
    const wrapped = withMenuApi('attendance', okHandler);
    const res = await wrapped(makeReq());
    expect(res.status).toBe(200);
  });

  it('bypasses menuKey check when actor.role.isSystem is true', async () => {
    const actor: StaffActor = {
      userId: 'u1', staffId: 's1', permissions: [], groups: [],
      role: { key: 'super', isSystem: true },
    };
    const { withMenuApi } = createMenuApi({
      auth: fakeAuth(actor),
      superAdminOnlyKeys: ['roles'],
    });
    const wrapped = withMenuApi('attendance', okHandler);
    const res = await wrapped(makeReq());
    expect(res.status).toBe(200);
  });

  it('rejects super-admin-only menuKey for non-system actor', async () => {
    const actor: StaffActor = { userId: 'u1', staffId: 's1', permissions: ['roles'], groups: [] };
    const { withMenuApi } = createMenuApi({
      auth: fakeAuth(actor),
      superAdminOnlyKeys: ['roles', 'groups'],
    });
    const wrapped = withMenuApi('roles', okHandler);
    const res = await wrapped(makeReq());
    expect(res.status).toBe(403);
  });

  it('withSuperAdminApi denies non-system actor', async () => {
    const actor: StaffActor = { userId: 'u1', staffId: 's1', permissions: ['attendance'], groups: [] };
    const { withSuperAdminApi } = createMenuApi({
      auth: fakeAuth(actor),
      superAdminOnlyKeys: ['roles'],
    });
    const wrapped = withSuperAdminApi(okHandler);
    const res = await wrapped(makeReq());
    expect(res.status).toBe(403);
  });

  it('withAnyAdminApi accepts any actor with non-empty permissions', async () => {
    const actor: StaffActor = { userId: 'u1', staffId: 's1', permissions: ['blog'], groups: [] };
    const { withAnyAdminApi } = createMenuApi({
      auth: fakeAuth(actor),
      superAdminOnlyKeys: ['roles'],
    });
    const wrapped = withAnyAdminApi(okHandler);
    const res = await wrapped(makeReq());
    expect(res.status).toBe(200);
  });
});
