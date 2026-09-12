// @withwiz/academic-affairs — HR(인사관리) 정책.
// counseling/policy.ts 와 동일하게 @prisma/client 비의존: Prisma where 는 loose type.
// 소비자(호스트)는 반환값을 prisma.employee.findMany({ where }) 에 그대로 전달한다.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaWhereInput = any;

export interface HrViewer {
  /** 본인 인사기록 id (셀프서비스 문맥에서만 채워짐) */
  employeeId?: string;
  /** 현재 로그인 staff id */
  staffId: string;
  /** 보유 menuKey 집합 */
  menuKeys: string[];
  /** 시스템 역할 여부(모든 체크 bypass) */
  isSystem: boolean;
}

/** 인사 모듈 전체 조회 권한 = 메뉴키 보유 또는 시스템 역할. */
export function canReadAll(v: HrViewer): boolean {
  return v.isSystem || v.menuKeys.includes("resource.personnel");
}

/** 주민번호 등 고유식별정보 평문 열람/수정 권한. */
export function canManagePii(v: HrViewer): boolean {
  return v.isSystem || v.menuKeys.includes("resource.personnel.pii");
}

/** 인사기록 편집 권한(현재는 조회 권한과 동일 게이트). */
export function canEdit(v: HrViewer): boolean {
  return canReadAll(v);
}

/**
 * 조회 범위.
 * - selfService 문맥에서 본인 employeeId 가 있으면 본인 레코드로 좁힌다.
 * - 그 외 전체 권한자(canReadAll)는 제한 없음(undefined).
 * - 권한도 셀프도 아니면 매칭 불가능한 where 로 차단한다.
 */
export function scopeWhere(v: HrViewer, selfService = false): PrismaWhereInput | undefined {
  if (selfService && v.employeeId) return { id: v.employeeId };
  if (canReadAll(v)) return undefined;
  return { id: "__none__" };
}
