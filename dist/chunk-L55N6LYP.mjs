// src/utils/admin-fetch.ts
var isRefreshing = false;
var refreshPromise = null;
async function tryRefresh() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        credentials: "same-origin"
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.success && data.data?.tokens) {
        localStorage.setItem("accessToken", data.data.tokens.accessToken);
        if (data.data.tokens.refreshToken) {
          localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
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
async function adminFetch(url, options = {}) {
  const accessToken = typeof localStorage !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "same-origin"
  });
  if (res.status === 401 && typeof window !== "undefined") {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const newToken = localStorage.getItem("accessToken");
      const retryHeaders = new Headers(options.headers);
      if (newToken) {
        retryHeaders.set("Authorization", `Bearer ${newToken}`);
      }
      return fetch(url, { ...options, headers: retryHeaders, credentials: "same-origin" });
    }
    window.location.href = "/admin/login";
  }
  return res;
}

export {
  adminFetch
};
//# sourceMappingURL=chunk-L55N6LYP.mjs.map