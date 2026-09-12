import {
  createMenuApi
} from "./chunk-VQZ32TWX.mjs";
import {
  permissionsOf
} from "./chunk-PKLKFT73.mjs";
import {
  AcademicAffairsError
} from "./chunk-QIK4YES6.mjs";

// src/facade/create-school-affairs.ts
var DEFAULT_LOCALE = {
  holidays: null,
  academicYearStart: { month: 3, day: 1 }
};
function createSchoolAffairs(config) {
  const menuKeys = new Set(config.rbac.menuKeys);
  if (config.rbac.apiToMenu) {
    for (const [route, key] of Object.entries(config.rbac.apiToMenu)) {
      if (!menuKeys.has(key)) {
        throw new AcademicAffairsError(
          "VALIDATION",
          `menuKey "${key}" not declared in rbac.menuKeys (referenced by ${route})`,
          500
        );
      }
    }
  }
  const locale = {
    holidays: config.locale?.holidays ?? DEFAULT_LOCALE.holidays,
    academicYearStart: config.locale?.academicYearStart ?? DEFAULT_LOCALE.academicYearStart
  };
  const resolved = {
    locale,
    hasSms: Boolean(config.sms),
    hasMailer: Boolean(config.mailer),
    hasStorage: Boolean(config.storage)
  };
  const menuApi = createMenuApi({
    auth: config.auth,
    superAdminOnlyKeys: config.rbac.superAdminOnlyKeys ?? [],
    superAdminCheck: config.rbac.superAdminCheck
  });
  return {
    config: resolved,
    rbac: {
      ...menuApi,
      isConfigured: () => menuKeys.size > 0,
      permissionsOf: (userId) => permissionsOf(config.prisma, userId)
    }
  };
}

export {
  createSchoolAffairs
};
//# sourceMappingURL=chunk-WRJCFX4U.mjs.map