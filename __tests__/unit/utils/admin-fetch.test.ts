import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { adminFetch } from '@/utils/admin-fetch';

describe('adminFetch', () => {
  const originalFetch = globalThis.fetch;
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (key: string) => mockStorage[key] ?? null,
        setItem: (key: string, val: string) => { mockStorage[key] = val; },
        removeItem: (key: string) => { delete mockStorage[key]; },
      },
      writable: true,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'window', {
      value: { location: { href: '' } },
      writable: true,
      configurable: true,
    });
    // Clear storage
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('attaches Authorization header from localStorage', async () => {
    mockStorage['accessToken'] = 'test-token-123';

    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response('{}', { status: 200 })
    );

    await adminFetch('/api/admin/staff');

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0];
    const headers = new Headers(callArgs[1]?.headers);
    expect(headers.get('Authorization')).toBe('Bearer test-token-123');
  });

  it('makes request without Authorization when no token', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response('{}', { status: 200 })
    );

    await adminFetch('/api/admin/staff');

    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0];
    const headers = new Headers(callArgs[1]?.headers);
    expect(headers.get('Authorization')).toBeNull();
  });

  it('passes through custom options', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response('{}', { status: 200 })
    );

    await adminFetch('/api/admin/staff', {
      method: 'POST',
      body: JSON.stringify({ name: 'test' }),
    });

    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0];
    expect(callArgs[1]?.method).toBe('POST');
  });

  it('returns successful response as-is', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response('{"success":true}', { status: 200 })
    );

    const res = await adminFetch('/api/admin/staff');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('attempts refresh on 401 and retries', async () => {
    mockStorage['accessToken'] = 'expired-token';
    mockStorage['refreshToken'] = 'valid-refresh';

    let callCount = 0;
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      callCount++;
      if (url === '/api/auth/refresh') {
        return Promise.resolve(new Response(
          JSON.stringify({ success: true, data: { tokens: { accessToken: 'new-token', refreshToken: 'new-refresh' } } }),
          { status: 200 }
        ));
      }
      if (callCount === 1) {
        return Promise.resolve(new Response('{}', { status: 401 }));
      }
      return Promise.resolve(new Response('{"success":true}', { status: 200 }));
    });

    const res = await adminFetch('/api/admin/staff');
    expect(res.status).toBe(200);
    expect(mockStorage['accessToken']).toBe('new-token');
  });
});
