import { describe, it, expect, vi } from 'vitest';
import { ZodError, z } from 'zod';
import {
  guard,
  parseQuery,
  resolveParam,
  adaptContextWrapper,
  listQuerySchema,
  MAX_LIST_LIMIT,
  type AdminApiWrapper,
} from '@/handlers/route';
import { createStudentHandlers } from '@/handlers/student.handler';
import { createCounselingHandlers } from '@/handlers/counseling.handler';
import { AcademicAffairsError } from '@/errors/academic-affairs-error';
import type { StaffActor } from '@/types/actor';

const actor: StaffActor = { userId: 'u1', staffId: 's1', permissions: ['students'], groups: [] };
const passthrough: AdminApiWrapper = (handler) => (req, props) => handler(req, actor, props);

describe('listQuerySchema', () => {
  it('caps limit and rejects negative page', () => {
    expect(() => listQuerySchema.parse({ limit: '1000000' })).toThrow(ZodError);
    expect(() => listQuerySchema.parse({ page: '-5' })).toThrow(ZodError);
    expect(listQuerySchema.parse({ limit: String(MAX_LIST_LIMIT) }).limit).toBe(MAX_LIST_LIMIT);
    expect(listQuerySchema.parse({})).toEqual({ page: 1, limit: 20 });
  });

  it('parseQuery drops empty params so optional enums pass', () => {
    const schema = listQuerySchema.extend({ status: z.enum(['A', 'B']).optional() });
    const req = new Request('http://x/api?status=&page=2');
    expect(parseQuery(req, schema)).toEqual({ page: 2, limit: 20 });
    expect(() => parseQuery(new Request('http://x/api?status=FOO'), schema)).toThrow(ZodError);
  });
});

describe('resolveParam', () => {
  it('reads sync and Promise params', async () => {
    expect(await resolveParam({ params: { id: 'a' } })).toBe('a');
    expect(await resolveParam({ params: Promise.resolve({ id: 'b' }) })).toBe('b');
    expect(await resolveParam(undefined)).toBeNull();
    expect(await resolveParam({ params: { id: '' } })).toBeNull();
  });
});

describe('guard', () => {
  it('maps ZodError to 400 without leaking details', async () => {
    const h = guard(async () => {
      z.string().parse(1);
      return new Response();
    });
    const res = await h(new Request('http://x'), actor);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('VALIDATION');
    expect(JSON.stringify(body)).not.toContain('expected');
  });

  it('maps AcademicAffairsError to its status and Prisma P2025 to 404', async () => {
    const h1 = guard(async () => {
      throw new AcademicAffairsError('FORBIDDEN', 'no', 403);
    });
    expect((await h1(new Request('http://x'), actor)).status).toBe(403);
    const h2 = guard(async () => {
      throw Object.assign(new Error('x'), { code: 'P2025' });
    });
    expect((await h2(new Request('http://x'), actor)).status).toBe(404);
  });

  it('rethrows unknown errors', async () => {
    const h = guard(async () => {
      throw new Error('boom');
    });
    await expect(h(new Request('http://x'), actor)).rejects.toThrow('boom');
  });
});

describe('adaptContextWrapper', () => {
  const wrap = (handler: (ctx: any, props?: unknown) => Promise<Response>) =>
    (ctx: any, props?: unknown) => handler(ctx, props);

  it('rejects requests without a user or without a resolvable actor', async () => {
    const adapted = adaptContextWrapper(wrap, async () => actor);
    const route = adapted(async () => new Response('ok'));
    expect((await route({ request: new Request('http://x') } as never)).status).toBe(401);
    const noActor = adaptContextWrapper(wrap, async () => null)(async () => new Response('ok'));
    expect((await noActor({ request: new Request('http://x'), user: { id: 'u' } } as never)).status).toBe(403);
  });

  it('passes the resolved actor through', async () => {
    const spy = vi.fn(async () => new Response('ok'));
    const route = adaptContextWrapper(wrap, async () => actor)(spy);
    const res = await route({ request: new Request('http://x'), user: { id: 'u1' } } as never, { params: { id: '1' } });
    expect(res.status).toBe(200);
    expect(spy).toHaveBeenCalledWith(expect.any(Request), actor, { params: { id: '1' } });
  });
});

describe('domain handlers with actor-aware wrapper', () => {
  it('student detail resolves Promise params and clamps list limit', async () => {
    const service = {
      getById: vi.fn().mockResolvedValue({ id: '1', name: 'A' }),
      list: vi.fn().mockResolvedValue({ items: [], pagination: {} }),
    };
    const h = createStudentHandlers(service as never, passthrough);
    const res = await h.detail.GET(new Request('http://x/api/students/1'), { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(200);
    expect(service.getById).toHaveBeenCalledWith('1');

    const bad = await h.list.GET(new Request('http://x/api/students?limit=99999'), undefined);
    expect(bad.status).toBe(400);
    expect(service.list).not.toHaveBeenCalled();

    const ok = await h.list.GET(new Request('http://x/api/students?status=ACTIVE&grade=2'), undefined);
    expect(ok.status).toBe(200);
    expect(service.list).toHaveBeenCalledWith({ page: 1, limit: 20, status: 'ACTIVE', grade: 2 });
  });

  it('counseling create defaults counselorId to the acting staff and update cannot reassign it', async () => {
    const service = {
      create: vi.fn().mockResolvedValue({ id: 'c1' }),
      update: vi.fn().mockResolvedValue({ id: 'c1' }),
    };
    const h = createCounselingHandlers(service as never, passthrough);
    const body = { type: 'REGULAR', date: '2026-03-02', title: 't', content: 'c' };
    await h.list.POST(new Request('http://x/api/c', { method: 'POST', body: JSON.stringify(body) }), undefined);
    expect(service.create.mock.calls[0][0].counselorId).toBe('s1');

    await h.detail.PUT(
      new Request('http://x/api/c/c1', { method: 'PUT', body: JSON.stringify({ counselorId: 'other', title: 'n' }) }),
      { params: { id: 'c1' } },
    );
    expect(service.update).toHaveBeenCalledWith('c1', { title: 'n' });
  });
});
