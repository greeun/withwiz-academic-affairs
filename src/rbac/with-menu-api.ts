import type { IAuthProvider } from '../auth/provider';
import type { StaffActor } from '../types/actor';

export type AdminHandler = (req: Request, actor: StaffActor, props?: unknown) => Promise<Response>;

export interface MenuApiConfig {
  auth: IAuthProvider;
  /** menuKeys that ONLY system roles may access (e.g. 'roles', 'groups', 'menu-resources'). */
  superAdminOnlyKeys: ReadonlyArray<string>;
  /** Override the default super-admin check (`actor.role.isSystem === true`). */
  superAdminCheck?: (actor: StaffActor) => boolean;
}

function jsonError(status: number, message: string): Response {
  return new Response(
    JSON.stringify({ success: false, error: { message } }),
    { status, headers: { 'content-type': 'application/json' } }
  );
}

export interface MenuApiBundle {
  withMenuApi(menuKey: string, handler: AdminHandler): (req: Request, props?: unknown) => Promise<Response>;
  withAnyAdminApi(handler: AdminHandler): (req: Request, props?: unknown) => Promise<Response>;
  withSuperAdminApi(handler: AdminHandler): (req: Request, props?: unknown) => Promise<Response>;
}

export function createMenuApi(config: MenuApiConfig): MenuApiBundle {
  const { auth, superAdminOnlyKeys } = config;
  const isSuperAdmin = config.superAdminCheck ?? ((actor: StaffActor) => actor.role?.isSystem === true);

  async function resolveActor(req: Request): Promise<StaffActor | null> {
    return auth.getCurrentStaff(req);
  }

  function withMenuApi(menuKey: string, handler: AdminHandler) {
    return async (req: Request, props?: unknown): Promise<Response> => {
      const actor = await resolveActor(req);
      if (!actor) return jsonError(401, '인증이 필요합니다');

      const isSystem = isSuperAdmin(actor) === true;
      if (!actor.permissions.length && !isSystem) {
        return jsonError(403, '역할이 할당되지 않았습니다');
      }
      if (isSystem) return handler(req, actor, props);
      if (superAdminOnlyKeys.includes(menuKey)) {
        return jsonError(403, '최고 관리자만 접근할 수 있습니다');
      }
      if (!actor.permissions.includes(menuKey)) {
        return jsonError(403, '이 메뉴에 대한 권한이 없습니다');
      }
      return handler(req, actor, props);
    };
  }

  function withAnyAdminApi(handler: AdminHandler) {
    return async (req: Request, props?: unknown): Promise<Response> => {
      const actor = await resolveActor(req);
      if (!actor) return jsonError(401, '인증이 필요합니다');
      const isSystem = isSuperAdmin(actor) === true;
      if (!actor.permissions.length && !isSystem) {
        return jsonError(403, '역할이 할당되지 않았습니다');
      }
      return handler(req, actor, props);
    };
  }

  function withSuperAdminApi(handler: AdminHandler) {
    return async (req: Request, props?: unknown): Promise<Response> => {
      const actor = await resolveActor(req);
      if (!actor) return jsonError(401, '인증이 필요합니다');
      if (isSuperAdmin(actor) !== true) {
        return jsonError(403, '최고 관리자만 접근할 수 있습니다');
      }
      return handler(req, actor, props);
    };
  }

  return { withMenuApi, withAnyAdminApi, withSuperAdminApi };
}
