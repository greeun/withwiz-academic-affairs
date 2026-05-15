import { describe, it, expect } from 'vitest';
import { NextApiResponse } from '@/utils/api-response';

describe('NextApiResponse', () => {
  it('success returns 200 with data', async () => {
    const res = NextApiResponse.success({ id: '1' });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ success: true, data: { id: '1' } });
  });

  it('success allows custom status', async () => {
    const res = NextApiResponse.success({ id: '1' }, 201);
    expect(res.status).toBe(201);
  });

  it('created returns 201', async () => {
    const res = NextApiResponse.created({ id: '1' });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
  });

  it('noContent returns 204 with no body', async () => {
    const res = NextApiResponse.noContent();
    expect(res.status).toBe(204);
    expect(res.body).toBeNull();
  });

  it('error returns message and code', async () => {
    const res = NextApiResponse.error('Bad input', 400, 'VALIDATION');
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: { message: 'Bad input', code: 'VALIDATION' },
    });
  });

  it('notFound returns 404', async () => {
    const res = NextApiResponse.notFound('Item not found');
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('unauthorized returns 401', async () => {
    const res = NextApiResponse.unauthorized();
    expect(res.status).toBe(401);
  });

  it('forbidden returns 403', async () => {
    const res = NextApiResponse.forbidden();
    expect(res.status).toBe(403);
  });

  it('serverError returns 500', async () => {
    const res = NextApiResponse.serverError();
    expect(res.status).toBe(500);
  });

  it('paginated returns items with pagination metadata', async () => {
    const res = NextApiResponse.paginated(['a', 'b'], 1, 10, 50);
    const body = await res.json();

    expect(body.success).toBe(true);
    expect(body.data.items).toEqual(['a', 'b']);
    expect(body.data.pagination).toEqual({
      page: 1,
      pageSize: 10,
      total: 50,
      totalPages: 5,
      hasMore: true,
    });
  });
});
