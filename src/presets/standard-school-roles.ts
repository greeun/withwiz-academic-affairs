// Production-extracted preset for the standard Korean alt-school role set.
// Source of truth: host's roles + role_permissions tables (extracted 2026-05-27).
// Each entry maps 1:1 to a Role row + its RolePermission rows.

export interface RolePreset {
  /** Machine name (matches Role.name). */
  name: string;
  /** Human display name (Korean). */
  displayName: string;
  description?: string;
  /** System role bypasses all menuKey checks. */
  isSystem: boolean;
  /** Menu keys this role grants (includes virtual keys like 'school.viewAll'). */
  menuKeys: readonly string[];
}

export const STANDARD_SCHOOL_ROLES: readonly RolePreset[] = [
  {
    name: 'SUPER_ADMIN',
    displayName: '최고관리자',
    description: '최고 관리자 — 모든 메뉴 접근, 삭제 불가',
    isSystem: true,
    menuKeys: [],
  },
  {
    name: 'PRINCIPAL',
    displayName: '교장',
    description: '교장 — 권한 관리(roles) 외 전체',
    isSystem: false,
    menuKeys: [
      'academic.promotion', 'attendance', 'blog', 'briefing', 'class-journal',
      'consultation', 'dashboard', 'faq', 'hero', 'history', 'news',
      'outreach.notifications', 'resource.groups', 'resource.students',
      'resource.subjects', 'resource.users', 'schedule', 'school.viewAll',
      'settings', 'sms', 'student-counseling',
    ],
  },
  {
    name: 'VICE_PRINCIPAL',
    displayName: '교감',
    description: '교감 — 학사·소통·리소스 전반 + 전체 조회',
    isSystem: false,
    menuKeys: [
      'academic.promotion', 'attendance', 'blog', 'briefing', 'class-journal',
      'consultation', 'dashboard', 'news', 'outreach.notifications',
      'resource.groups', 'resource.students', 'resource.subjects', 'schedule',
      'school.viewAll', 'sms', 'student-counseling',
    ],
  },
  {
    name: 'ACADEMIC_HEAD',
    displayName: '교무부장',
    description: '교무부장 — VICE_PRINCIPAL과 동일 권한',
    isSystem: false,
    menuKeys: [
      'academic.promotion', 'attendance', 'blog', 'briefing', 'class-journal',
      'consultation', 'dashboard', 'news', 'outreach.notifications',
      'resource.groups', 'resource.students', 'resource.subjects', 'schedule',
      'school.viewAll', 'sms', 'student-counseling',
    ],
  },
  {
    name: 'ACADEMIC_AFFAIRS',
    displayName: '교무',
    description: '교무/교감 — 진급 도구 + 인물 프로필 전권',
    isSystem: false,
    menuKeys: [
      'academic.promotion', 'attendance', 'outreach.notifications',
      'resource.groups', 'resource.students',
    ],
  },
  {
    name: 'HOMEROOM',
    displayName: '담임',
    description: '담임/부담임 — 본인 (주/부)담임 ClassGroup 데이터만',
    isSystem: false,
    menuKeys: [
      'attendance', 'class-journal', 'dashboard', 'outreach.notifications',
      'resource.students', 'resource.subjects', 'student-counseling',
    ],
  },
  {
    name: 'TEACHER',
    displayName: '일반교사',
    description: '담임 아닌 교과/특별교사',
    isSystem: false,
    menuKeys: ['class-journal', 'dashboard', 'resource.subjects'],
  },
  {
    name: 'instructor',
    displayName: '강사',
    isSystem: false,
    menuKeys: ['class-journal'],
  },
  {
    name: 'WEB_EDITOR',
    displayName: '홈페이지 운영',
    description: '홈페이지 콘텐츠·소통 운영',
    isSystem: false,
    menuKeys: [
      'blog', 'briefing', 'consultation', 'dashboard', 'faq', 'hero',
      'history', 'news', 'resource.subjects',
    ],
  },
] as const;
