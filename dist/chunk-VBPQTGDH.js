"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkRKWWRCLNjs = require('./chunk-RKWWRCLN.js');

// src/components/AdminShell.tsx
var _react = require('react');
var _link = require('next/link'); var _link2 = _interopRequireDefault(_link);
var _navigation = require('next/navigation');
var _dynamic = require('next/dynamic'); var _dynamic2 = _interopRequireDefault(_dynamic);

// src/components/nav-active.ts
function isNavItemActive(pathname, href) {
  const p = pathname.replace(/\/+$/, "");
  const h = href.replace(/\/+$/, "");
  if (p === h) return true;
  return p.startsWith(h + "/");
}

// src/components/nav-groups.ts
var STORAGE_KEY = "admin_collapsed_groups";
function toggleGroupCollapsed(collapsed, group) {
  return collapsed.includes(group) ? collapsed.filter((g) => g !== group) : [...collapsed, group];
}
function loadCollapsedGroups() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch (e2) {
    return [];
  }
}
function saveCollapsedGroups(collapsed) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  } catch (e3) {
  }
}

// src/components/AdminShell.tsx
var _jsxruntime = require('react/jsx-runtime');
var Toaster = _dynamic2.default.call(void 0, 
  () => Promise.resolve().then(() => _interopRequireWildcard(require("sonner"))).then((m) => m.Toaster),
  { ssr: false }
);
function AdminShell({ config, children }) {
  const pathname = _navigation.usePathname.call(void 0, );
  const router = _navigation.useRouter.call(void 0, );
  const routerRef = _react.useRef.call(void 0, router);
  routerRef.current = router;
  const [checking, setChecking] = _react.useState.call(void 0, true);
  const [user, setUser] = _react.useState.call(void 0, null);
  const [mobileOpen, setMobileOpen] = _react.useState.call(void 0, false);
  const [collapsedGroups, setCollapsedGroups] = _react.useState.call(void 0, []);
  _react.useEffect.call(void 0, () => {
    setCollapsedGroups(loadCollapsedGroups());
  }, []);
  function onToggleGroup(group) {
    setCollapsedGroups((prev) => {
      const next = toggleGroupCollapsed(prev, group);
      saveCollapsedGroups(next);
      return next;
    });
  }
  const [collapsed, setCollapsed] = _react.useState.call(void 0, () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_sidebar_collapsed") === "true";
    }
    return false;
  });
  const DEFAULT_WIDTH = 240;
  const MIN_WIDTH = 240;
  const MAX_WIDTH = 400;
  const [sidebarWidth, setSidebarWidth] = _react.useState.call(void 0, () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_sidebar_width");
      return saved ? Number(saved) : DEFAULT_WIDTH;
    }
    return DEFAULT_WIDTH;
  });
  const isResizing = _react.useRef.call(void 0, false);
  const widthRef = _react.useRef.call(void 0, sidebarWidth);
  const [dragging, setDragging] = _react.useState.call(void 0, false);
  const isLoginPage = pathname === config.auth.loginPath;
  _react.useEffect.call(void 0, () => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    async function checkAuth() {
      try {
        const res = await _chunkRKWWRCLNjs.adminFetch.call(void 0, config.auth.meEndpoint);
        if (cancelled) return;
        if (!res.ok) {
          routerRef.current.replace(config.auth.loginPath);
          return;
        }
        const data = await res.json();
        if (data.success && _optionalChain([data, 'access', _ => _.data, 'optionalAccess', _2 => _2.user])) {
          const u = data.data.user;
          setUser(
            (prev) => _optionalChain([prev, 'optionalAccess', _3 => _3.email]) === u.email && _optionalChain([prev, 'optionalAccess', _4 => _4.id]) === u.id ? prev : u
          );
        }
      } catch (e4) {
        if (!cancelled) {
          routerRef.current.replace(config.auth.loginPath);
          return;
        }
      }
      setChecking(false);
    }
    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [isLoginPage]);
  const handleMouseMove = _react.useCallback.call(void 0, (e) => {
    if (!isResizing.current) return;
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX));
    widthRef.current = newWidth;
    setSidebarWidth(newWidth);
  }, []);
  const handleMouseUp = _react.useCallback.call(void 0, () => {
    if (!isResizing.current) return;
    isResizing.current = false;
    setDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    localStorage.setItem("admin_sidebar_width", String(widthRef.current));
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);
  if (isLoginPage) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _jsxruntime.Fragment, { children });
  }
  if (checking) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "admin-auth-loading", children: "\uC778\uC99D \uD655\uC778 \uC911..." });
  }
  async function handleLogout() {
    try {
      await _chunkRKWWRCLNjs.adminFetch.call(void 0, config.auth.logoutEndpoint, { method: "POST" });
    } catch (e5) {
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      document.cookie = "accessToken=; path=/; max-age=0";
      router.replace(config.auth.loginPath);
    }
  }
  function toggleSidebar() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  }
  function startResize(e) {
    e.preventDefault();
    isResizing.current = true;
    setDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
  const brandDisplay = collapsed ? _nullishCoalesce(_optionalChain([config, 'access', _5 => _5.brand, 'access', _6 => _6.shortName, 'optionalAccess', _7 => _7[0]]), () => ( config.brand.name[0])) : config.brand.name;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: `admin-layout${collapsed ? " admin-sidebar-collapsed" : ""}${dragging ? " admin-resizing" : ""}${mobileOpen ? " admin-sidebar-mobile-open" : ""}`, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "button",
      {
        className: "admin-mobile-toggle",
        onClick: () => setMobileOpen(true),
        "aria-label": "\uBA54\uB274 \uC5F4\uAE30",
        children: "\u2630"
      }
    ),
    mobileOpen && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "admin-sidebar-overlay", onClick: () => setMobileOpen(false) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "aside",
      {
        className: "admin-sidebar",
        style: !collapsed ? { width: sidebarWidth } : void 0,
        children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "admin-sidebar-header", children: [
            !collapsed && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "admin-sidebar-logo", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { href: config.brand.homeUrl, className: "admin-logo-home", title: "\uC0AC\uC774\uD2B8 \uBCF4\uAE30", target: "_blank", rel: "noopener noreferrer", children: brandDisplay }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _link2.default, { href: "/admin", className: "admin-logo-admin", children: "Admin" })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "button",
              {
                className: "admin-sidebar-toggle",
                onClick: () => {
                  if (mobileOpen) {
                    setMobileOpen(false);
                  } else {
                    toggleSidebar();
                  }
                },
                title: collapsed ? "\uBA54\uB274 \uD3BC\uCE58\uAE30" : "\uBA54\uB274 \uC811\uAE30",
                children: mobileOpen ? "\u2715" : collapsed ? "\u203A" : "\u2039"
              }
            )
          ] }),
          !collapsed && user && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "admin-sidebar-user", children: user.email }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "nav", { className: "admin-sidebar-nav", children: (() => {
            let lastGroup;
            return config.navigation.map((item) => {
              const showGroup = !collapsed && item.group && item.group !== lastGroup;
              lastGroup = item.group;
              const groupCollapsed = !!item.group && collapsedGroups.includes(item.group);
              const hidden = !collapsed && groupCollapsed;
              const active = isNavItemActive(pathname, item.href);
              return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
                showGroup && item.group && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                  "button",
                  {
                    type: "button",
                    className: "admin-sidebar-group admin-sidebar-group-toggle",
                    onClick: () => onToggleGroup(item.group),
                    "aria-expanded": !groupCollapsed,
                    children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: item.group }),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", children: groupCollapsed ? "\u25B8" : "\u25BE" })
                    ]
                  }
                ),
                !hidden && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                  _link2.default,
                  {
                    href: item.href,
                    className: "admin-sidebar-link" + (active ? " admin-sidebar-link-active" : ""),
                    title: item.label,
                    "aria-label": item.label,
                    "aria-current": active ? "page" : void 0,
                    onClick: () => setMobileOpen(false),
                    children: [
                      item.icon ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "admin-sidebar-icon", "aria-hidden": "true", children: item.icon }) : null,
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "admin-sidebar-label", children: collapsed ? item.icon ? "" : item.shortLabel : item.label })
                    ]
                  }
                )
              ] }, item.href);
            });
          })() }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "admin-sidebar-footer", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { className: "admin-sidebar-logout", onClick: handleLogout, title: "\uB85C\uADF8\uC544\uC6C3", children: collapsed ? "\u2715" : "\uB85C\uADF8\uC544\uC6C3" }) }),
          !collapsed && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "div",
            {
              className: "admin-sidebar-resize",
              onMouseDown: startResize
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "main",
      {
        className: "admin-main",
        style: !collapsed ? { marginLeft: sidebarWidth, width: `calc(100vw - ${sidebarWidth}px)` } : void 0,
        children
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Toaster, { position: "top-center", richColors: true, closeButton: true, duration: 3e3 })
  ] });
}



exports.AdminShell = AdminShell;
//# sourceMappingURL=chunk-VBPQTGDH.js.map