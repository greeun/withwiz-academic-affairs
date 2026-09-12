"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunk5JWNAAZFjs = require('./chunk-5JWNAAZF.js');


var _chunkJFJ42V3Wjs = require('./chunk-JFJ42V3W.js');


var _chunkDE323ATWjs = require('./chunk-DE323ATW.js');

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
        throw new (0, _chunkDE323ATWjs.AcademicAffairsError)(
          "VALIDATION",
          `menuKey "${key}" not declared in rbac.menuKeys (referenced by ${route})`,
          500
        );
      }
    }
  }
  const locale = {
    holidays: _nullishCoalesce(_optionalChain([config, 'access', _ => _.locale, 'optionalAccess', _2 => _2.holidays]), () => ( DEFAULT_LOCALE.holidays)),
    academicYearStart: _nullishCoalesce(_optionalChain([config, 'access', _3 => _3.locale, 'optionalAccess', _4 => _4.academicYearStart]), () => ( DEFAULT_LOCALE.academicYearStart))
  };
  const resolved = {
    locale,
    hasSms: Boolean(config.sms),
    hasMailer: Boolean(config.mailer),
    hasStorage: Boolean(config.storage)
  };
  const menuApi = _chunk5JWNAAZFjs.createMenuApi.call(void 0, {
    auth: config.auth,
    superAdminOnlyKeys: _nullishCoalesce(config.rbac.superAdminOnlyKeys, () => ( [])),
    superAdminCheck: config.rbac.superAdminCheck
  });
  return {
    config: resolved,
    rbac: {
      ...menuApi,
      isConfigured: () => menuKeys.size > 0,
      permissionsOf: (userId) => _chunkJFJ42V3Wjs.permissionsOf.call(void 0, config.prisma, userId)
    }
  };
}



exports.createSchoolAffairs = createSchoolAffairs;
//# sourceMappingURL=chunk-VRD7VXJQ.js.map