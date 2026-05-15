/** 현재 pathname이 nav href에 해당하는지(중첩 경로 포함, 형제 접두사 오탐 방지). */
export function isNavItemActive(pathname: string, href: string): boolean {
  const p = pathname.replace(/\/+$/, '');
  const h = href.replace(/\/+$/, '');
  if (p === h) return true;
  return p.startsWith(h + '/');
}
