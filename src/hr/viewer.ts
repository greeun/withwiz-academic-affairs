import type { HrViewer } from "./policy";

/**
 * 로그인 사용자의 인사 viewer(staff 식별 + 권한)를 해석한다.
 * counseling getCounselingViewer 와 동일하게 userRoles 만 본다(userGroups 미반영).
 * staff 레코드가 없으면 null.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getHrViewer(prisma: any, userId: string): Promise<HrViewer | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      staff: { select: { id: true } },
      userRoles: {
        select: {
          role: {
            select: {
              isSystem: true,
              permissions: { select: { menuKey: true } },
            },
          },
        },
      },
    },
  });
  if (!user?.staff) return null;
  const isSystem = user.userRoles.some(
    (ur: { role: { isSystem: boolean } }) => ur.role.isSystem,
  );
  const allKeys: string[] = user.userRoles.flatMap(
    (ur: { role: { permissions: { menuKey: string }[] } }) =>
      ur.role.permissions.map((p: { menuKey: string }) => p.menuKey),
  );
  const menuKeys: string[] = [...new Set<string>(allKeys)];
  return { staffId: user.staff.id, menuKeys, isSystem };
}
