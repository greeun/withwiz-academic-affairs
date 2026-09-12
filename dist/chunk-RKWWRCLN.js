"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/utils/admin-fetch.ts
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
      if (data.success && _optionalChain([data, 'access', _ => _.data, 'optionalAccess', _2 => _2.tokens])) {
        localStorage.setItem("accessToken", data.data.tokens.accessToken);
        if (data.data.tokens.refreshToken) {
          localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
        }
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  })().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });
  return refreshPromise;
}
function isSameOrigin(url) {
  if (typeof window === "undefined") return false;
  if (url.startsWith("/")) return !url.startsWith("//");
  try {
    return new URL(url, window.location.href).origin === window.location.origin;
  } catch (e2) {
    return false;
  }
}
async function adminFetch(url, options = {}) {
  const sameOrigin = isSameOrigin(url);
  const accessToken = sameOrigin && typeof localStorage !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "same-origin"
  });
  if (res.status === 401 && sameOrigin) {
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




exports.isSameOrigin = isSameOrigin; exports.adminFetch = adminFetch;
//# sourceMappingURL=chunk-RKWWRCLN.js.map