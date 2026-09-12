import { z, ZodError } from 'zod';
import type { StaffActor } from '../types/actor';
import type { AdminHandler } from '../rbac/with-menu-api';
import { NextApiResponse } from '../utils/api-response';
import { AcademicAffairsError } from '../errors/academic-affairs-error';

/**
 * Wrapper that turns an actor-aware handler into a Next.js route handler.
 *
 * Matches `createMenuApi(...).withAnyAdminApi` / `withSuperAdminApi` directly, and
 * `withMenuApi(menuKey, handler)` via partial application:
 *
 *   const withAdminApi: AdminApiWrapper = (h) => rbac.withMenuApi('students', h);
 */
export type AdminApiWrapper = (
  handler: AdminHandler,
) => (req: Request, props?: unknown) => Promise<Response>;

export type { AdminHandler, StaffActor };

export const MAX_LIST_LIMIT = 200;
export const DEFAULT_LIST_LIMIT = 20;

/** Shared pagination/sort query fields. Bounded so a single request cannot dump a table. */
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_LIST_LIMIT).default(DEFAULT_LIST_LIMIT),
  sortBy: z.string().max(64).optional(),
});

/** Converts search params to a plain object, dropping empty values so optional enums parse. */
export function queryObject(url: URL): Record<string, string> {
  const out: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    if (value !== '') out[key] = value;
  });
  return out;
}

export function parseQuery<S extends z.ZodTypeAny>(req: Request, schema: S): z.infer<S> {
  return schema.parse(queryObject(new URL(req.url)));
}

interface RouteProps {
  params?: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
}

/** Resolves a dynamic route param (sync or Promise-based, Next 15+). */
export async function resolveParam(props: unknown, key: string = 'id'): Promise<string | null> {
  const params = await (props as RouteProps | undefined)?.params;
  const value = params?.[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

/**
 * Maps validation/domain errors to safe JSON responses. Unknown errors are rethrown so the
 * host's error middleware can log them; nothing internal is serialized here.
 */
export function guard(handler: AdminHandler): AdminHandler {
  return async (req, actor, props) => {
    try {
      return await handler(req, actor, props);
    } catch (err) {
      if (err instanceof ZodError) {
        return NextApiResponse.error('입력값이 올바르지 않습니다', 400, 'VALIDATION');
      }
      if (err instanceof AcademicAffairsError) {
        return NextApiResponse.error(err.message, err.httpStatus, err.code);
      }
      if (isPrismaNotFound(err)) {
        return NextApiResponse.notFound();
      }
      throw err;
    }
  };
}

function isPrismaNotFound(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: unknown }).code === 'P2025';
}

/** Context shape produced by `@withwiz/toolkit` middleware wrappers. */
export interface ContextLike {
  request: Request;
  user?: { id: string };
}

/**
 * Bridges a context-style wrapper (e.g. toolkit `withAdminApi`) to `AdminApiWrapper` by resolving
 * the authenticated user into a `StaffActor`. Requests without a user or without a resolvable
 * actor are rejected before the domain handler runs.
 */
export function adaptContextWrapper(
  wrap: (handler: (ctx: ContextLike, props?: unknown) => Promise<Response>) => (...args: any[]) => Promise<unknown>,
  resolveActor: (user: { id: string }, req: Request) => Promise<StaffActor | null>,
): AdminApiWrapper {
  return (handler) => {
    const wrapped = wrap(async (ctx, props) => {
      if (!ctx.user) return NextApiResponse.unauthorized('인증이 필요합니다');
      const actor = await resolveActor(ctx.user, ctx.request);
      if (!actor || (!actor.permissions.length && actor.role?.isSystem !== true)) {
        return NextApiResponse.forbidden('역할이 할당되지 않았습니다');
      }
      return handler(ctx.request, actor, props);
    });
    return (req: Request, props?: unknown) => wrapped(req, props) as Promise<Response>;
  };
}
