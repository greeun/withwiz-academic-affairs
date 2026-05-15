"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { AdminShellConfig } from "./AdminShellConfig";
import { adminFetch } from "../utils/admin-fetch";

const Toaster = dynamic(
  () => import("sonner").then((m) => m.Toaster),
  { ssr: false }
);

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface Props {
  config: AdminShellConfig;
  children: React.ReactNode;
}

export default function AdminShell({ config, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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
          const u = data.data.user as AdminUser;
          setUser((prev) =>
            prev?.email === u.email && prev?.id === u.id ? prev : u
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
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginPage]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
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
    return <>{children}</>;
  }

  if (checking) {
    return <div className="admin-auth-loading">인증 확인 중...</div>;
  }

  async function handleLogout() {
    try {
      await adminFetch(config.auth.logoutEndpoint, { method: "POST" });
    } catch {
      // ignore
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

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    isResizing.current = true;
    setDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  const brandDisplay = collapsed
    ? (config.brand.shortName?.[0] ?? config.brand.name[0])
    : config.brand.name;

  return (
    <div className={`admin-layout${collapsed ? " admin-sidebar-collapsed" : ""}${dragging ? " admin-resizing" : ""}${mobileOpen ? " admin-sidebar-mobile-open" : ""}`}>
      <button
        className="admin-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="메뉴 열기"
      >
        ☰
      </button>
      {mobileOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className="admin-sidebar"
        style={!collapsed ? { width: sidebarWidth } : undefined}
      >
        <div className="admin-sidebar-header">
          {!collapsed && (
            <div className="admin-sidebar-logo">
              <a href={config.brand.homeUrl} className="admin-logo-home" title="사이트 보기" target="_blank" rel="noopener noreferrer">
                {brandDisplay}
              </a>
              <Link href="/admin" className="admin-logo-admin">Admin</Link>
            </div>
          )}
          <button
            className="admin-sidebar-toggle"
            onClick={() => {
              if (mobileOpen) {
                setMobileOpen(false);
              } else {
                toggleSidebar();
              }
            }}
            title={collapsed ? "메뉴 펼치기" : "메뉴 접기"}
          >
            {mobileOpen ? "✕" : collapsed ? "›" : "‹"}
          </button>
        </div>
        {!collapsed && user && (
          <div className="admin-sidebar-user">{user.email}</div>
        )}
        <nav className="admin-sidebar-nav">
          {(() => {
            let lastGroup: string | undefined;
            return config.navigation.map((item) => {
              const showGroup = !collapsed && item.group && item.group !== lastGroup;
              lastGroup = item.group;
              return (
                <div key={item.href}>
                  {showGroup && (
                    <div className="admin-sidebar-group">{item.group}</div>
                  )}
                  <Link
                    href={item.href}
                    className="admin-sidebar-link"
                    title={item.label}
                    onClick={() => setMobileOpen(false)}
                  >
                    {collapsed ? item.shortLabel : item.label}
                  </Link>
                </div>
              );
            });
          })()}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-sidebar-logout" onClick={handleLogout} title="로그아웃">
            {collapsed ? "✕" : "로그아웃"}
          </button>
        </div>
        {!collapsed && (
          <div
            className="admin-sidebar-resize"
            onMouseDown={startResize}
          />
        )}
      </aside>
      <main
        className="admin-main"
        style={!collapsed ? { marginLeft: sidebarWidth, width: `calc(100vw - ${sidebarWidth}px)` } : undefined}
      >{children}</main>
      <Toaster position="top-center" richColors closeButton duration={3000} />
    </div>
  );
}
