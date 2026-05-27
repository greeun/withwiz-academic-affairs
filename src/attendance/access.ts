/**
 * Resolve the set of class groups the current user may read/write.
 *
 * S5-d: 레거시 4-튜플 (`ClassKey` / `resolveAccessibleClasses` /
 * `isAccessibleKey` / `compareClassKey`) 은 모두 제거됨. 모든 호출자는
 * `resolveAccessibleGroups` + `isAccessibleGroupId` 로 마이그레이트되어 있어야 한다.
 *
 *  - SUPER_ADMIN (isSystem=true role) → kind: "all" (no filter).
 *  - 다른 사용자: Staff 링크가 있고, 본인이 (주/부)담임으로 매핑된 isActive=true ClassGroup
 *    이 있으면 그 그룹 id 집합을 반환. 그 외에는 빈 집합.
 *
 * Writes additionally require a Staff link (see getCurrentStaffId).
 */
import { permissionsOf } from "../rbac/permissions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ClassGroupSummary {
  id: string;
  academicYear: number;
  name: string;
  sortOrder: number;
}

/** ClassGroup 단일 키 기반 access result. */
export type GroupAccessResult =
  | { kind: "all" }
  | { kind: "restricted"; groupIds: string[]; groups: ClassGroupSummary[] };

/**
 * Resolve the set of class groups the current user may read/write.
 *
 *  - SUPER_ADMIN (isSystem=true role) OR Role with RolePermission(menuKey="school.viewAll")
 *    → kind: "all" (no filter).
 *  - 다른 사용자: Staff 링크가 있고 본인이 (주/부)담임으로 매핑된 isActive=true ClassGroup
 *    이 있으면 그 그룹 id 집합을 반환. 그 외에는 빈 집합.
 *
 * Writes additionally require a Staff link (see getCurrentStaffId).
 */
export async function resolveAccessibleGroups(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  userId: string,
): Promise<GroupAccessResult> {
  const [user, eff] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        staff: { select: { id: true } },
      },
    }),
    permissionsOf(prisma, userId),
  ]);

  if (!user || !eff) return { kind: "restricted", groupIds: [], groups: [] };

  if (eff.isSystem || eff.hasMenuKey("school.viewAll")) return { kind: "all" };

  const staffId = user.staff?.id;
  if (!staffId) return { kind: "restricted", groupIds: [], groups: [] };

  const rows = await prisma.classGroup.findMany({
    where: {
      isActive: true,
      OR: [
        { homeroomStaffId: staffId },
        { assistantHomeroomStaffId: staffId },
      ],
    },
    select: {
      id: true,
      academicYear: true,
      name: true,
      sortOrder: true,
    },
    orderBy: [
      { academicYear: "desc" },
      { sortOrder: "asc" },
      { name: "asc" },
    ],
  });

  return {
    kind: "restricted",
    groupIds: rows.map((r: ClassGroupSummary) => r.id),
    groups: rows,
  };
}

/** 접근 가능 여부 판정. SUPER_ADMIN("all")이면 항상 true. */
export function isAccessibleGroupId(
  access: GroupAccessResult,
  groupId: string,
): boolean {
  if (access.kind === "all") return true;
  return access.groupIds.includes(groupId);
}
