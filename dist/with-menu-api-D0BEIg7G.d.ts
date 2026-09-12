import { IAuthProvider } from './auth/index.js';
import { S as StaffActor } from './actor-DlbHf9VQ.js';

type AdminHandler = (req: Request, actor: StaffActor, props?: unknown) => Promise<Response>;
interface MenuApiConfig {
    auth: IAuthProvider;
    /** menuKeys that ONLY system roles may access (e.g. 'roles', 'groups', 'menu-resources'). */
    superAdminOnlyKeys: ReadonlyArray<string>;
    /** Override the default super-admin check (`actor.role.isSystem === true`). */
    superAdminCheck?: (actor: StaffActor) => boolean;
}
interface MenuApiBundle {
    withMenuApi(menuKey: string, handler: AdminHandler): (req: Request, props?: unknown) => Promise<Response>;
    withAnyAdminApi(handler: AdminHandler): (req: Request, props?: unknown) => Promise<Response>;
    withSuperAdminApi(handler: AdminHandler): (req: Request, props?: unknown) => Promise<Response>;
}
declare function createMenuApi(config: MenuApiConfig): MenuApiBundle;

export { type AdminHandler as A, type MenuApiBundle as M, type MenuApiConfig as a, createMenuApi as c };
