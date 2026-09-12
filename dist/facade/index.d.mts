import { IAuthProvider } from '../auth/index.mjs';
import { c as ISmsClient, a as IMailer, b as IObjectStorage, I as IClock } from '../clock-ApxcJEIv.mjs';
import { L as LocaleOptions } from '../locale-Do6G5msk.mjs';
import { EffectivePermissions } from '../rbac/index.mjs';
import { M as MenuApiBundle } from '../with-menu-api-Dux8zpRG.mjs';
import { S as StaffActor } from '../actor-DlbHf9VQ.mjs';

interface RbacConfig {
    /** Allowed menuKey values. Used for runtime validation in withMenuApi. */
    menuKeys: readonly string[];
    /** Map of route prefix → menuKey. Optional; some hosts derive at route level. */
    apiToMenu?: Record<string, string>;
    /** menuKeys gated to system roles only. Default: empty. */
    superAdminOnlyKeys?: readonly string[];
    /** Override the default super-admin check (Role.isSystem === true). */
    superAdminCheck?: (actor: StaffActor) => boolean;
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
