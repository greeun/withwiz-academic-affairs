// Permission resolver: User → (direct roles ∪ group roles) → menuKeys (flattened, deduped).
// Pure function on Prisma. No middleware, no auth, no Web/Fetch types.

export interface RoleLike {
  id: string;
  name: string;
  isSystem: boolean;
  permissions: { menuKey: string }[];
}

export interface EffectivePermissions {
  roles: RoleLike[];
  menuKeys: Set<string>;
  isSystem: boolean;
  hasMenuKey(key: string): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function permissionsOf(prisma: any, userId: string): Promise<EffectivePermissions | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      userRoles: {
        select: {
          role: {
            select: {
              id: true,
              name: true,
              isSystem: true,
              permissions: { select: { menuKey: true } },
            },
          },
        },
      },
      userGroups: {
        select: {
          group: {
            select: {
              groupRoles: {
                select: {
                  role: {
                    select: {
                      id: true,
                      name: true,
                      isSystem: true,
                      permissions: { select: { menuKey: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!user) return null;

  const roleMap = new Map<string, RoleLike>();
  for (const ur of user.userRoles) roleMap.set(ur.role.id, ur.role);
  for (const ug of user.userGroups) {
    for (const gr of ug.group.groupRoles) roleMap.set(gr.role.id, gr.role);
  }

  const roles = [...roleMap.values()];
  const menuKeys = new Set<string>(roles.flatMap((r) => r.permissions.map((p) => p.menuKey)));
  const isSystem = roles.some((r) => r.isSystem);

  return {
    roles,
    menuKeys,
    isSystem,
    hasMenuKey: (k: string) => menuKeys.has(k),
  };
}
