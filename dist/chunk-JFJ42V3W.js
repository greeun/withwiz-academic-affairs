"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/rbac/permissions.ts
async function permissionsOf(prisma, userId) {
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
              permissions: { select: { menuKey: true } }
            }
          }
        }
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
                      permissions: { select: { menuKey: true } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  if (!user) return null;
  const roleMap = /* @__PURE__ */ new Map();
  for (const ur of user.userRoles) roleMap.set(ur.role.id, ur.role);
  for (const ug of user.userGroups) {
    for (const gr of ug.group.groupRoles) roleMap.set(gr.role.id, gr.role);
  }
  const roles = [...roleMap.values()];
  const menuKeys = new Set(roles.flatMap((r) => r.permissions.map((p) => p.menuKey)));
  const isSystem = roles.some((r) => r.isSystem);
  return {
    roles,
    menuKeys,
    isSystem,
    hasMenuKey: (k) => menuKeys.has(k)
  };
}



exports.permissionsOf = permissionsOf;
//# sourceMappingURL=chunk-JFJ42V3W.js.map