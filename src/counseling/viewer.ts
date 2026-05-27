import type { CounselingViewer } from "./policy";

/**
 * Resolve the counseling viewer's identity + permissions.
 *
 * Note: this query intentionally looks only at userRoles (NOT userGroups),
 * matching the host's pre-S6.0 behavior verbatim. Group-based permissions
 * are not consulted for the counseling-view scope. If you need full 4-tier
 * permission resolution, use `permissionsOf` from '@/rbac' instead.
 *
 * Returns null when the user does not exist OR has no Staff record attached
 * (signed-in but not a registered staff member).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCounselingViewer(prisma: any, userId: string): Promise<CounselingViewer | null> {
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
  const isSystem = user.userRoles.some((ur: { role: { isSystem: boolean } }) => ur.role.isSystem);
  const allKeys: string[] = user.userRoles.flatMap(
    (ur: { role: { permissions: { menuKey: string }[] } }) =>
      ur.role.permissions.map((p: { menuKey: string }) => p.menuKey),
  );
  const menuKeys: string[] = [...new Set<string>(allKeys)];
  return { staffId: user.staff.id, menuKeys, isSystem };
}
