import { IAuthProvider } from '../auth/index.js';
import { c as ISmsClient, a as IMailer, b as IObjectStorage, I as IClock } from '../clock-ApxcJEIv.js';
import { L as LocaleOptions } from '../locale-Do6G5msk.js';
import { MenuApiBundle, EffectivePermissions } from '../rbac/index.js';
import '../actor-DlbHf9VQ.js';

interface RbacConfig {
    /** Allowed menuKey values. Used for runtime validation in withMenuApi. */
    menuKeys: readonly string[];
    /** Map of route prefix → menuKey. Optional; some hosts derive at route level. */
    apiToMenu?: Record<string, string>;
    /** menuKeys gated to system roles only. Default: empty. */
    superAdminOnlyKeys?: readonly string[];
    /** Override the default super-admin check (Role.isSystem === true). */
    superAdminCheck?: (actor: {
        role?: {
            isSystem: boolean;
        };
    }) => boolean;
}
interface CreateSchoolAffairsConfig {
    prisma: any;
    auth: IAuthProvider;
    rbac: RbacConfig;
    locale?: LocaleOptions;
    sms?: ISmsClient;
    mailer?: IMailer;
    storage?: IObjectStorage;
    clock?: IClock;
}
/**
 * S0 surface: facade exposes only the rbac namespace stub.
 * Domain namespaces (staff, persons, classGroups, …) are added in S1+ sprints.
 */
interface SchoolAffairs {
    readonly config: ResolvedConfig;
    readonly rbac: MenuApiBundle & {
        isConfigured(): boolean;
        /** Resolve a user's effective permissions using the host's Prisma client. */
        permissionsOf(userId: string): Promise<EffectivePermissions | null>;
    };
}
interface ResolvedConfig {
    locale: Required<LocaleOptions>;
    hasSms: boolean;
    hasMailer: boolean;
    hasStorage: boolean;
}

declare function createSchoolAffairs(config: CreateSchoolAffairsConfig): SchoolAffairs;

export { type CreateSchoolAffairsConfig, type RbacConfig, type ResolvedConfig, type SchoolAffairs, createSchoolAffairs };
