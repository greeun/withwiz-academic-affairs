const STORAGE_KEY = 'admin_collapsed_groups';

/** 접힌 그룹 목록을 토글한 새 배열 반환(불변). */
export function toggleGroupCollapsed(collapsed: string[], group: string): string[] {
  return collapsed.includes(group)
    ? collapsed.filter((g) => g !== group)
    : [...collapsed, group];
}

/** localStorage에서 접힌 그룹 로드(SSR/오류 시 빈 배열). */
export function loadCollapsedGroups(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** 접힌 그룹 저장(오류 무시). */
export function saveCollapsedGroups(collapsed: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  } catch {
    /* ignore quota/availability errors */
  }
}
