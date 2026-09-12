let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        credentials: 'same-origin',
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (data.success && data.data?.tokens) {
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        if (data.data.tokens.refreshToken) {
          localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  })().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

/** Bearer tokens are only attached to same-origin requests so they never leak to third-party hosts. */
export function isSameOrigin(url: string): boolean {
  if (typeof window === 'undefined') return false;
  // Site-relative paths always target the current origin (protocol-relative `//host` does not).
  if (url.startsWith('/')) return !url.startsWith('//');
  try {
    return new URL(url, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

export async function adminFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const sameOrigin = isSameOrigin(url);
  const accessToken = sameOrigin && typeof localStorage !== 'undefined'
    ? localStorage.getItem('accessToken')
    : null;
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  if (res.status === 401 && sameOrigin) {
    const refreshed = await tryRefresh();

    if (refreshed) {
      const newToken = localStorage.getItem('accessToken');
      const retryHeaders = new Headers(options.headers);
      if (newToken) {
        retryHeaders.set('Authorization', `Bearer ${newToken}`);
      }
      return fetch(url, { ...options, headers: retryHeaders, credentials: 'same-origin' });
    }

    window.location.href = '/admin/login';
  }

  return res;
}
