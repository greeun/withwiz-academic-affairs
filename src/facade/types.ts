import type { IAuthProvider } from '../auth/provider';
import type { ISmsClient } from '../infrastructure/sms';
import type { IMailer } from '../infrastructure/mailer';
import type { IObjectStorage } from '../infrastructure/storage';
import type { IClock } from '../infrastructure/clock';
import type { LocaleOptions } from '../types/locale';

export interface RbacConfig {
  /** Allowed menuKey values. Used for runtime validation in withMenuApi. */
  menuKeys: readonly string[];
  /** Map of route prefix → menuKey. Optional; some hosts derive at route level. */
  apiToMenu?: Record<string, string>;
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
  readonly rbac: {
    /** Placeholder; concrete withMenuApi lands in S1. */
    isConfigured(): boolean;
  };
}

export interface ResolvedConfig {
  locale: Required<LocaleOptions>;
  hasSms: boolean;
  hasMailer: boolean;
  hasStorage: boolean;
}
