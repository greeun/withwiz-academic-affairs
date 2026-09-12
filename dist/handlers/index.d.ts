import { S as StaffService, A as AcademicCalendarService, F as FaqService, c as StudentService, b as AttendanceService, C as CounselingService, a as AdmissionService } from '../admission.service-BsSbZXxc.js';
import { z } from 'zod';
import { S as StaffActor } from '../actor-DlbHf9VQ.js';
import { A as AdminHandler } from '../with-menu-api-D0BEIg7G.js';
import '../common-CinCPUTw.js';
import '../auth/index.js';

/**
 * Wrapper that turns an actor-aware handler into a Next.js route handler.
 *
 * Matches `createMenuApi(...).withAnyAdminApi` / `withSuperAdminApi` directly, and
 * `withMenuApi(menuKey, handler)` via partial application:
 *
 *   const withAdminApi: AdminApiWrapper = (h) => rbac.withMenuApi('students', h);
 */
type AdminApiWrapper = (handler: AdminHandler) => (req: Request, props?: unknown) => Promise<Response>;

declare const MAX_LIST_LIMIT = 200;
declare const DEFAULT_LIST_LIMIT = 20;
/** Shared pagination/sort query fields. Bounded so a single request cannot dump a table. */
declare const listQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortBy: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** Converts search params to a plain object, dropping empty values so optional enums parse. */
declare function queryObject(url: URL): Record<string, string>;
declare function parseQuery<S extends z.ZodTypeAny>(req: Request, schema: S): z.infer<S>;
/** Resolves a dynamic route param (sync or Promise-based, Next 15+). */
declare function resolveParam(props: unknown, key?: string): Promise<string | null>;
/**
 * Maps validation/domain errors to safe JSON responses. Unknown errors are rethrown so the
 * host's error middleware can log them; nothing internal is serialized here.
 */
declare function guard(handler: AdminHandler): AdminHandler;
/** Context shape produced by `@withwiz/toolkit` middleware wrappers. */
interface ContextLike {
    request: Request;
    user?: {
        id: string;
    };
}
/**
 * Bridges a context-style wrapper (e.g. toolkit `withAdminApi`) to `AdminApiWrapper` by resolving
 * the authenticated user into a `StaffActor`. Requests without a user or without a resolvable
 * actor are rejected before the domain handler runs.
 */
declare function adaptContextWrapper(wrap: (handler: (ctx: ContextLike, props?: unknown) => Promise<Response>) => (...args: any[]) => Promise<unknown>, resolveActor: (user: {
    id: string;
}, req: Request) => Promise<StaffActor | null>): AdminApiWrapper;

interface DomainConfig {
    staff?: boolean;
    academicCalendar?: boolean;
    faq?: boolean;
    student?: boolean;
    attendance?: boolean;
    counseling?: boolean;
    admission?: boolean;
}
interface AcademicSystemConfig {
    prisma: any;
    domains: DomainConfig;
    /**
     * Authentication/authorization wrapper applied to every generated handler. Required: there is
     * no unauthenticated default. Use `createMenuApi(...)` / `createSchoolAffairs(...).rbac`
     * (e.g. `(h) => rbac.withMenuApi('students', h)`) or `adaptContextWrapper` for toolkit wrappers.
     */
    withAdminApi: AdminApiWrapper;
}
interface HandlerSet {
    list: {
        GET: Function;
        POST: Function;
    };
    detail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
}
interface AcademicCalendarHandlerSet {
    list: {
        GET: Function;
        POST: Function;
    };
    detail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
    eventList: {
        GET: Function;
        POST: Function;
    };
    eventDetail: {
        GET: Function;
        PUT: Function;
        DELETE: Function;
    };
}
interface DashboardHandlerSet {
    stats: {
        GET: Function;
    };
}
interface AcademicSystem {
    services: {
        staff?: StaffService;
        academicCalendar?: AcademicCalendarService;
        faq?: FaqService;
        student?: StudentService;
        attendance?: AttendanceService;
        counseling?: CounselingService;
        admission?: AdmissionService;
    };
    handlers: {
        staff?: HandlerSet;
        academicCalendar?: AcademicCalendarHandlerSet;
        faq?: HandlerSet;
        student?: HandlerSet;
        attendance?: HandlerSet;
        counseling?: HandlerSet;
        admission?: HandlerSet;
        dashboard?: DashboardHandlerSet;
    };
}
declare function createAcademicSystem(config: AcademicSystemConfig): AcademicSystem;

declare function createStaffHandlers(service: StaffService, withAdminApi: AdminApiWrapper): {
    list: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        POST: (req: Request, props?: unknown) => Promise<Response>;
    };
    detail: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        PUT: (req: Request, props?: unknown) => Promise<Response>;
        DELETE: (req: Request, props?: unknown) => Promise<Response>;
    };
};

declare function createAcademicCalendarHandlers(service: AcademicCalendarService, withAdminApi: AdminApiWrapper): {
    list: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        POST: (req: Request, props?: unknown) => Promise<Response>;
    };
    detail: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        PUT: (req: Request, props?: unknown) => Promise<Response>;
        DELETE: (req: Request, props?: unknown) => Promise<Response>;
    };
    eventList: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        POST: (req: Request, props?: unknown) => Promise<Response>;
    };
    eventDetail: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        PUT: (req: Request, props?: unknown) => Promise<Response>;
        DELETE: (req: Request, props?: unknown) => Promise<Response>;
    };
};

declare function createFaqHandlers(service: FaqService, withAdminApi: AdminApiWrapper): {
    list: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        POST: (req: Request, props?: unknown) => Promise<Response>;
    };
    detail: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        PUT: (req: Request, props?: unknown) => Promise<Response>;
        DELETE: (req: Request, props?: unknown) => Promise<Response>;
    };
};

declare function createStudentHandlers(service: StudentService, withAdminApi: AdminApiWrapper): {
    list: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        POST: (req: Request, props?: unknown) => Promise<Response>;
    };
    detail: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        PUT: (req: Request, props?: unknown) => Promise<Response>;
        DELETE: (req: Request, props?: unknown) => Promise<Response>;
    };
};

declare function createAttendanceHandlers(service: AttendanceService, withAdminApi: AdminApiWrapper): {
    list: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        POST: (req: Request, props?: unknown) => Promise<Response>;
    };
    detail: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        PUT: (req: Request, props?: unknown) => Promise<Response>;
        DELETE: (req: Request, props?: unknown) => Promise<Response>;
    };
};

declare function createCounselingHandlers(service: CounselingService, withAdminApi: AdminApiWrapper): {
    list: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        POST: (req: Request, props?: unknown) => Promise<Response>;
    };
    detail: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        PUT: (req: Request, props?: unknown) => Promise<Response>;
        DELETE: (req: Request, props?: unknown) => Promise<Response>;
    };
};

declare function createAdmissionHandlers(service: AdmissionService, withAdminApi: AdminApiWrapper): {
    list: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        POST: (req: Request, props?: unknown) => Promise<Response>;
    };
    detail: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
        PUT: (req: Request, props?: unknown) => Promise<Response>;
        DELETE: (req: Request, props?: unknown) => Promise<Response>;
    };
};

interface DashboardServices {
    staff?: {
        getStats(): Promise<any>;
    };
    academicCalendar?: {
        getStats(): Promise<any>;
    };
    faq?: {
        getStats(): Promise<any>;
    };
    student?: {
        getStats(): Promise<any>;
    };
    attendance?: {
        getStats(): Promise<any>;
    };
    counseling?: {
        getStats(): Promise<any>;
    };
    admission?: {
        getStats(): Promise<any>;
    };
}
declare function createDashboardHandlers(services: DashboardServices, withAdminApi: AdminApiWrapper): {
    stats: {
        GET: (req: Request, props?: unknown) => Promise<Response>;
    };
};

export { type AcademicSystemConfig, type AdminApiWrapper, type ContextLike, DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT, adaptContextWrapper, createAcademicCalendarHandlers, createAcademicSystem, createAdmissionHandlers, createAttendanceHandlers, createCounselingHandlers, createDashboardHandlers, createFaqHandlers, createStaffHandlers, createStudentHandlers, guard, listQuerySchema, parseQuery, queryObject, resolveParam };
