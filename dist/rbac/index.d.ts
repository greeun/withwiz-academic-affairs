export { A as AdminHandler, M as MenuApiBundle, a as MenuApiConfig, c as createMenuApi } from '../with-menu-api-D0BEIg7G.js';
import '../auth/index.js';
import '../actor-DlbHf9VQ.js';

interface RoleLike {
    id: string;
    name: string;
    isSystem: boolean;
    permissions: {
        menuKey: string;
    }[];
}
interface EffectivePermissions {
    roles: RoleLike[];
    menuKeys: Set<string>;
    isSystem: boolean;
    hasMenuKey(key: string): boolean;
}
declare function permissionsOf(prisma: any, userId: string): Promise<EffectivePermissions | null>;

export { type EffectivePermissions, type RoleLike, permissionsOf };
