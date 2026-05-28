import { IAuthProvider } from '../auth/index.mjs';
import { S as StaffActor } from '../actor-DlbHf9VQ.mjs';

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

type AdminHandler = (req: Request, actor: StaffActor, props?: unknown) => Promise<Response>;
interface MenuApiConfig {
    auth: IAuthProvider;
    /** menuKeys that ONLY system roles may access (e.g. 'roles', 'groups', 'menu-resources'). */
    superAdminOnlyKeys: ReadonlyArray<string>;
}
interface MenuApiBundle {
    withMenuApi(menuKey: string, handler: AdminHandler): (req: Request, props?: unknown) => Promise<Response>;
    withAnyAdminApi(handler: AdminHandler): (req: Request, props?: unknown) => Promise<Response>;
    withSuperAdminApi(handler: AdminHandler): (req: Request, props?: unknown) => Promise<Response>;
}
declare function createMenuApi(config: MenuApiConfig): MenuApiBundle;

export { type AdminHandler, type EffectivePermissions, type MenuApiBundle, type MenuApiConfig, type RoleLike, createMenuApi, permissionsOf };
