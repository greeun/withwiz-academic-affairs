"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/rbac/with-menu-api.ts
function jsonError(status, message) {
  return new Response(
    JSON.stringify({ success: false, error: { message } }),
    { status, headers: { "content-type": "application/json" } }
  );
}
function createMenuApi(config) {
  const { auth, superAdminOnlyKeys } = config;
  const isSuperAdmin = _nullishCoalesce(config.superAdminCheck, () => ( ((actor) => _optionalChain([actor, 'access', _ => _.role, 'optionalAccess', _2 => _2.isSystem]) === true)));
  async function resolveActor(req) {
    return auth.getCurrentStaff(req);
  }
  function withMenuApi(menuKey, handler) {
    return async (req, props) => {
      const actor = await resolveActor(req);
      if (!actor) return jsonError(401, "\uC778\uC99D\uC774 \uD544\uC694\uD569\uB2C8\uB2E4");
      const isSystem = isSuperAdmin(actor) === true;
      if (!actor.permissions.length && !isSystem) {
        return jsonError(403, "\uC5ED\uD560\uC774 \uD560\uB2F9\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4");
      }
      if (isSystem) return handler(req, actor, props);
      if (superAdminOnlyKeys.includes(menuKey)) {
        return jsonError(403, "\uCD5C\uACE0 \uAD00\uB9AC\uC790\uB9CC \uC811\uADFC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4");
      }
      if (!actor.permissions.includes(menuKey)) {
        return jsonError(403, "\uC774 \uBA54\uB274\uC5D0 \uB300\uD55C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4");
      }
      return handler(req, actor, props);
    };
  }
  function withAnyAdminApi(handler) {
    return async (req, props) => {
      const actor = await resolveActor(req);
      if (!actor) return jsonError(401, "\uC778\uC99D\uC774 \uD544\uC694\uD569\uB2C8\uB2E4");
      const isSystem = isSuperAdmin(actor) === true;
      if (!actor.permissions.length && !isSystem) {
        return jsonError(403, "\uC5ED\uD560\uC774 \uD560\uB2F9\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4");
      }
      return handler(req, actor, props);
    };
  }
  function withSuperAdminApi(handler) {
    return async (req, props) => {
      const actor = await resolveActor(req);
      if (!actor) return jsonError(401, "\uC778\uC99D\uC774 \uD544\uC694\uD569\uB2C8\uB2E4");
      if (isSuperAdmin(actor) !== true) {
        return jsonError(403, "\uCD5C\uACE0 \uAD00\uB9AC\uC790\uB9CC \uC811\uADFC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4");
      }
      return handler(req, actor, props);
    };
  }
  return { withMenuApi, withAnyAdminApi, withSuperAdminApi };
}



exports.createMenuApi = createMenuApi;
//# sourceMappingURL=chunk-5JWNAAZF.js.map