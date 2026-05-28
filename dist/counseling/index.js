"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/counseling/policy.ts
function hasViewAll(v) {
  return v.isSystem || v.menuKeys.includes("school.viewAll");
}
function canRead(v, r) {
  if (hasViewAll(v)) return true;
  if (r.authorId === v.staffId) return true;
  if (r.student.homeroomStaffId === v.staffId) return true;
  return false;
}
function canUpdate(v, r) {
  return r.authorId === v.staffId;
}
function canCreate(v, d) {
  if (hasViewAll(v)) return true;
  return d.student.homeroomStaffId === v.staffId;
}
function scopeWhere(v) {
  if (hasViewAll(v)) return void 0;
  return {
    OR: [
      { authorId: v.staffId },
      { student: { classGroup: { homeroomStaffId: v.staffId } } }
    ]
  };
}
function flattenForPolicy(record) {
  return {
    authorId: record.authorId,
    student: { homeroomStaffId: _nullishCoalesce(_optionalChain([record, 'access', _ => _.student, 'optionalAccess', _2 => _2.classGroup, 'optionalAccess', _3 => _3.homeroomStaffId]), () => ( null)) }
  };
}
function flattenStudentForPolicy(student) {
  return { homeroomStaffId: _nullishCoalesce(_optionalChain([student, 'access', _4 => _4.classGroup, 'optionalAccess', _5 => _5.homeroomStaffId]), () => ( null)) };
}

// src/counseling/schema.ts
var _zod = require('zod');
var counselingCategoryEnum = _zod.z.enum([
  "ACADEMIC",
  "LIFE",
  "PEER",
  "CAREER",
  "FAMILY",
  "ETC"
]);
var counselingMethodEnum = _zod.z.enum([
  "IN_PERSON",
  "PHONE",
  "TEXT",
  "VIDEO"
]);
var counselingScopeEnum = _zod.z.enum(["STUDENT", "PARENT", "BOTH"]);
var createCounselingSchema = _zod.z.object({
  studentId: _zod.z.string().min(1),
  counseledAt: _zod.z.string().datetime({ offset: true }),
  category: counselingCategoryEnum,
  method: counselingMethodEnum,
  scope: counselingScopeEnum,
  topic: _zod.z.string().min(1).max(120),
  content: _zod.z.string().min(1),
  action: _zod.z.string().nullable().optional(),
  followUpAt: _zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  followUpDone: _zod.z.boolean().optional(),
  followUpNote: _zod.z.string().nullable().optional()
}).refine(
  (v) => {
    if (!v.followUpAt) return true;
    const counseledDate = v.counseledAt.slice(0, 10);
    return v.followUpAt >= counseledDate;
  },
  { path: ["followUpAt"], message: "\uD6C4\uC18D\uC870\uCE58 \uC608\uC815\uC77C\uC740 \uC0C1\uB2F4\uC77C\uC790 \uC774\uD6C4\uC5EC\uC57C \uD569\uB2C8\uB2E4" }
);
var updateCounselingSchema = _zod.z.object({
  studentId: _zod.z.string().min(1).optional(),
  counseledAt: _zod.z.string().datetime({ offset: true }).optional(),
  category: counselingCategoryEnum.optional(),
  method: counselingMethodEnum.optional(),
  scope: counselingScopeEnum.optional(),
  topic: _zod.z.string().min(1).max(120).optional(),
  content: _zod.z.string().min(1).optional(),
  action: _zod.z.string().nullable().optional(),
  followUpAt: _zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  followUpDone: _zod.z.boolean().optional(),
  followUpNote: _zod.z.string().nullable().optional()
});
var listQuerySchema = _zod.z.object({
  page: _zod.z.coerce.number().int().min(1).default(1),
  limit: _zod.z.coerce.number().int().min(1).max(200).default(20),
  search: _zod.z.string().optional(),
  from: _zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: _zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  studentId: _zod.z.string().optional(),
  category: counselingCategoryEnum.optional(),
  method: counselingMethodEnum.optional(),
  authorId: _zod.z.string().optional(),
  followUp: _zod.z.enum(["due", "done", "none"]).optional(),
  sort: _zod.z.enum(["counseledAt", "createdAt"]).default("counseledAt"),
  order: _zod.z.enum(["asc", "desc"]).default("desc")
});

// src/counseling/viewer.ts
async function getCounselingViewer(prisma, userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      staff: { select: { id: true } },
      userRoles: {
        select: {
          role: {
            select: {
              isSystem: true,
              permissions: { select: { menuKey: true } }
            }
          }
        }
      }
    }
  });
  if (!_optionalChain([user, 'optionalAccess', _6 => _6.staff])) return null;
  const isSystem = user.userRoles.some((ur) => ur.role.isSystem);
  const allKeys = user.userRoles.flatMap(
    (ur) => ur.role.permissions.map((p) => p.menuKey)
  );
  const menuKeys = [...new Set(allKeys)];
  return { staffId: user.staff.id, menuKeys, isSystem };
}














exports.canCreate = canCreate; exports.canRead = canRead; exports.canUpdate = canUpdate; exports.counselingCategoryEnum = counselingCategoryEnum; exports.counselingMethodEnum = counselingMethodEnum; exports.counselingScopeEnum = counselingScopeEnum; exports.createCounselingSchema = createCounselingSchema; exports.flattenForPolicy = flattenForPolicy; exports.flattenStudentForPolicy = flattenStudentForPolicy; exports.getCounselingViewer = getCounselingViewer; exports.listQuerySchema = listQuerySchema; exports.scopeWhere = scopeWhere; exports.updateCounselingSchema = updateCounselingSchema;
//# sourceMappingURL=index.js.map