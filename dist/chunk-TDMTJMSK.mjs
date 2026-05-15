import {
  adminFetch
} from "./chunk-L55N6LYP.mjs";

// src/components/AdminShell.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

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
  } catch {
    return [];
  }
}
function saveCollapsedGroups(collapsed) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  } catch {
  }
}

// src/components/AdminShell.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var Toaster = dynamic(
  () => import("sonner").then((m) => m.Toaster),
  { ssr: false }
);
function AdminShell({ config, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState([]);
  useEffect(() => {
    setCollapsedGroups(loadCollapsedGroups());
  }, []);
  function onToggleGroup(group) {
    setCollapsedGroups((prev) => {
      const next = toggleGroupCollapsed(prev, group);
      saveCollapsedGroups(next);
      return next;
    });
  }
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_sidebar_collapsed") === "true";
    }
    return false;
  });
  const DEFAULT_WIDTH = 240;
  const MIN_WIDTH = 240;
  const MAX_WIDTH = 400;
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_sidebar_width");
      return saved ? Number(saved) : DEFAULT_WIDTH;
    }
    return DEFAULT_WIDTH;
  });
  const isResizing = useRef(false);
  const widthRef = useRef(sidebarWidth);
  const [dragging, setDragging] = useState(false);
  const isLoginPage = pathname === config.auth.loginPath;
  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    async function checkAuth() {
      try {
        const res = await adminFetch(config.auth.meEndpoint);
        if (cancelled) return;
        if (!res.ok) {
          routerRef.current.replace(config.auth.loginPath);
          return;
        }
        const data = await res.json();
        if (data.success && data.data?.user) {
          const u = data.data.user;
          setUser(
            (prev) => prev?.email === u.email && prev?.id === u.id ? prev : u
          );
        }
      } catch {
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
  const handleMouseMove = useCallback((e) => {
    if (!isResizing.current) return;
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX));
    widthRef.current = newWidth;
    setSidebarWidth(newWidth);
  }, []);
  const handleMouseUp = useCallback(() => {
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
    return /* @__PURE__ */ jsx(Fragment, { children });
  }
  if (checking) {
    return /* @__PURE__ */ jsx("div", { className: "admin-auth-loading", children: "\uC778\uC99D \uD655\uC778 \uC911..." });
  }
  async function handleLogout() {
    try {
      await adminFetch(config.auth.logoutEndpoint, { method: "POST" });
    } catch {
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
  const brandDisplay = collapsed ? config.brand.shortName?.[0] ?? config.brand.name[0] : config.brand.name;
  return /* @__PURE__ */ jsxs("div", { className: `admin-layout${collapsed ? " admin-sidebar-collapsed" : ""}${dragging ? " admin-resizing" : ""}${mobileOpen ? " admin-sidebar-mobile-open" : ""}`, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "admin-mobile-toggle",
        onClick: () => setMobileOpen(true),
        "aria-label": "\uBA54\uB274 \uC5F4\uAE30",
        children: "\u2630"
      }
    ),
    mobileOpen && /* @__PURE__ */ jsx("div", { className: "admin-sidebar-overlay", onClick: () => setMobileOpen(false) }),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: "admin-sidebar",
        style: !collapsed ? { width: sidebarWidth } : void 0,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "admin-sidebar-header", children: [
            !collapsed && /* @__PURE__ */ jsxs("div", { className: "admin-sidebar-logo", children: [
              /* @__PURE__ */ jsx("a", { href: config.brand.homeUrl, className: "admin-logo-home", title: "\uC0AC\uC774\uD2B8 \uBCF4\uAE30", target: "_blank", rel: "noopener noreferrer", children: brandDisplay }),
              /* @__PURE__ */ jsx(Link, { href: "/admin", className: "admin-logo-admin", children: "Admin" })
            ] }),
            /* @__PURE__ */ jsx(
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
          !collapsed && user && /* @__PURE__ */ jsx("div", { className: "admin-sidebar-user", children: user.email }),
          /* @__PURE__ */ jsx("nav", { className: "admin-sidebar-nav", children: (() => {
            let lastGroup;
            return config.navigation.map((item) => {
              const showGroup = !collapsed && item.group && item.group !== lastGroup;
              lastGroup = item.group;
              const groupCollapsed = !!item.group && collapsedGroups.includes(item.group);
              const hidden = !collapsed && groupCollapsed;
              const active = isNavItemActive(pathname, item.href);
              return /* @__PURE__ */ jsxs("div", { children: [
                showGroup && item.group && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    className: "admin-sidebar-group admin-sidebar-group-toggle",
                    onClick: () => onToggleGroup(item.group),
                    "aria-expanded": !groupCollapsed,
                    children: [
                      /* @__PURE__ */ jsx("span", { children: item.group }),
                      /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: groupCollapsed ? "\u25B8" : "\u25BE" })
                    ]
                  }
                ),
                !hidden && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: item.href,
                    className: "admin-sidebar-link" + (active ? " admin-sidebar-link-active" : ""),
                    title: item.label,
                    "aria-label": item.label,
                    "aria-current": active ? "page" : void 0,
                    onClick: () => setMobileOpen(false),
                    children: [
                      item.icon ? /* @__PURE__ */ jsx("span", { className: "admin-sidebar-icon", "aria-hidden": "true", children: item.icon }) : null,
                      /* @__PURE__ */ jsx("span", { className: "admin-sidebar-label", children: collapsed ? item.icon ? "" : item.shortLabel : item.label })
                    ]
                  }
                )
              ] }, item.href);
            });
          })() }),
          /* @__PURE__ */ jsx("div", { className: "admin-sidebar-footer", children: /* @__PURE__ */ jsx("button", { className: "admin-sidebar-logout", onClick: handleLogout, title: "\uB85C\uADF8\uC544\uC6C3", children: collapsed ? "\u2715" : "\uB85C\uADF8\uC544\uC6C3" }) }),
          !collapsed && /* @__PURE__ */ jsx(
            "div",
            {
              className: "admin-sidebar-resize",
              onMouseDown: startResize
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "main",
      {
        className: "admin-main",
        style: !collapsed ? { marginLeft: sidebarWidth, width: `calc(100vw - ${sidebarWidth}px)` } : void 0,
        children
      }
    ),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center", richColors: true, closeButton: true, duration: 3e3 })
  ] });
}

export {
  AdminShell
};
//# sourceMappingURL=chunk-TDMTJMSK.mjs.map