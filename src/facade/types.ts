import type { IAuthProvider } from '../auth/provider';
import type { ISmsClient } from '../infrastructure/sms';
import type { IMailer } from '../infrastructure/mailer';
import type { IObjectStorage } from '../infrastructure/storage';
import type { IClock } from '../infrastructure/clock';
import type { LocaleOptions } from '../types/locale';
import type { EffectivePermissions } from '../rbac/permissions';
import type { MenuApiBundle } from '../rbac/with-menu-api';

export interface RbacConfig {
  /** Allowed menuKey values. Used for runtime validation in withMenuApi. */
  menuKeys: readonly string[];
  /** Map of route prefix → menuKey. Optional; some hosts derive at route level. */
  apiToMenu?: Record<string, string>;
  /** menuKeys gated to system roles only. Default: empty. */
  superAdminOnlyKeys?: readonly string[];
  /** Override the default super-admin check (Role.isSystem === true). */
  superAdminCheck?: (actor: { role?: { isSystem: boolean } }) => boolean;
}

export interface CreateSchoolAffairsConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any; // PrismaClient — typed as any to avoid hard dep on @prisma/client
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
export interface SchoolAffairs {
  readonly config: ResolvedConfig;
  readonly rbac: MenuApiBundle & {
    isConfigured(): boolean;
    /** Resolve a user's effective permissions using the host's Prisma client. */
    permissionsOf(userId: string): Promise<EffectivePermissions | null>;
  };
}

export interface ResolvedConfig {
  locale: Required<LocaleOptions>;
  hasSms: boolean;
  hasMailer: boolean;
  hasStorage: boolean;
}
