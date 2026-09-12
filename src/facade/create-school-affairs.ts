import { AcademicAffairsError } from '../errors/academic-affairs-error';
import type {
  CreateSchoolAffairsConfig,
  ResolvedConfig,
  SchoolAffairs,
} from './types';
import type { LocaleOptions } from '../types/locale';
import { createMenuApi } from '../rbac/with-menu-api';
import { permissionsOf } from '../rbac/permissions';

const DEFAULT_LOCALE: Required<LocaleOptions> = {
  holidays: null,
  academicYearStart: { month: 3, day: 1 },
};

export function createSchoolAffairs(
  config: CreateSchoolAffairsConfig
): SchoolAffairs {
  const menuKeys = new Set(config.rbac.menuKeys);

  if (config.rbac.apiToMenu) {
    for (const [route, key] of Object.entries(config.rbac.apiToMenu)) {
      if (!menuKeys.has(key)) {
        throw new AcademicAffairsError(
          'VALIDATION',
          `menuKey "${key}" not declared in rbac.menuKeys (referenced by ${route})`,
          500
        );
      }
    }
  }

  const locale: Required<LocaleOptions> = {
    holidays: config.locale?.holidays ?? DEFAULT_LOCALE.holidays,
    academicYearStart:
      config.locale?.academicYearStart ?? DEFAULT_LOCALE.academicYearStart,
  };

  const resolved: ResolvedConfig = {
    locale,
    hasSms: Boolean(config.sms),
    hasMailer: Boolean(config.mailer),
    hasStorage: Boolean(config.storage),
  };

  const menuApi = createMenuApi({
    auth: config.auth,
    superAdminOnlyKeys: config.rbac.superAdminOnlyKeys ?? [],
    superAdminCheck: config.rbac.superAdminCheck,
  });

  return {
    config: resolved,
    rbac: {
      ...menuApi,
      isConfigured: () => menuKeys.size > 0,
      permissionsOf: (userId: string) => permissionsOf(config.prisma, userId),
    },
  };
}
