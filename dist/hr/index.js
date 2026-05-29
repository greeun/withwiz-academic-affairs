"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/hr/policy.ts
function canReadAll(v) {
  return v.isSystem || v.menuKeys.includes("resource.personnel");
}
function canManagePii(v) {
  return v.isSystem || v.menuKeys.includes("resource.personnel.pii");
}
function canEdit(v) {
  return canReadAll(v);
}
function scopeWhere(v, selfService = false) {
  if (selfService && v.employeeId) return { id: v.employeeId };
  if (canReadAll(v)) return void 0;
  return { id: "__none__" };
}

// src/hr/schema.ts
var _zod = require('zod');
var employmentTypeEnum = _zod.z.enum(["REGULAR", "CONTRACT", "PART_TIME", "DISPATCH"]);
var employeeStatusEnum = _zod.z.enum(["ACTIVE", "ON_LEAVE", "RESIGNED"]);
var dateString = _zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4");
var nationalId = _zod.z.string().regex(/^\d{6}-?\d{7}$/, "\uC8FC\uBBFC\uB4F1\uB85D\uBC88\uD638 \uD615\uC2DD(13\uC790\uB9AC)\uC774 \uC544\uB2D9\uB2C8\uB2E4");
var employeeBase = {
  employeeNo: _zod.z.string().max(40).nullable().optional(),
  name: _zod.z.string().min(1).max(60),
  nameHanja: _zod.z.string().max(60).nullable().optional(),
  nameEng: _zod.z.string().max(120).nullable().optional(),
  birthDate: dateString.nullable().optional(),
  gender: _zod.z.string().max(20).nullable().optional(),
  // 평문 주민번호: 호스트가 받아 암호화 후 저장(원문 컬럼 없음). 옵션.
  nationalId: nationalId.nullable().optional(),
  bloodType: _zod.z.string().max(10).nullable().optional(),
  militaryService: _zod.z.string().max(200).nullable().optional(),
  phoneMobile: _zod.z.string().max(40).nullable().optional(),
  phoneHome: _zod.z.string().max(40).nullable().optional(),
  email: _zod.z.email().max(200).nullable().optional(),
  address: _zod.z.string().max(500).nullable().optional(),
  domicile: _zod.z.string().max(500).nullable().optional(),
  jobCategory: _zod.z.string().max(60).nullable().optional(),
  hireDate: dateString.nullable().optional(),
  resignDate: dateString.nullable().optional(),
  notes: _zod.z.string().max(2e3).nullable().optional(),
  sortOrder: _zod.z.coerce.number().int().optional()
};
var createEmployeeSchema = _zod.z.object({
  ...employeeBase,
  employmentType: employmentTypeEnum.default("REGULAR"),
  status: employeeStatusEnum.default("ACTIVE")
});
var updateEmployeeSchema = _zod.z.object({
  ...employeeBase,
  name: _zod.z.string().min(1).max(60).optional(),
  employmentType: employmentTypeEnum.optional(),
  status: employeeStatusEnum.optional(),
  isActive: _zod.z.boolean().optional()
});
var listEmployeeQuerySchema = _zod.z.object({
  page: _zod.z.coerce.number().int().min(1).default(1),
  limit: _zod.z.coerce.number().int().min(1).max(200).default(20),
  search: _zod.z.string().optional(),
  status: employeeStatusEnum.optional(),
  employmentType: employmentTypeEnum.optional(),
  sort: _zod.z.enum(["sortOrder", "name", "hireDate", "createdAt"]).default("sortOrder"),
  order: _zod.z.enum(["asc", "desc"]).default("asc")
});
var careerTypeEnum = _zod.z.enum(["EDUCATIONAL", "NON_EDUCATIONAL"]);
var qualificationTypeEnum = _zod.z.enum(["TEACHER_LICENSE", "GENERAL"]);
var createEducationSchema = _zod.z.object({
  schoolName: _zod.z.string().min(1).max(120),
  major: _zod.z.string().max(120).nullable().optional(),
  degree: _zod.z.string().max(60).nullable().optional(),
  admissionDate: dateString.nullable().optional(),
  graduationDate: dateString.nullable().optional(),
  graduationType: _zod.z.string().max(40).nullable().optional(),
  sortOrder: _zod.z.coerce.number().int().optional()
});
var updateEducationSchema = createEducationSchema.partial();
var createCareerSchema = _zod.z.object({
  orgName: _zod.z.string().min(1).max(160),
  position: _zod.z.string().max(80).nullable().optional(),
  duties: _zod.z.string().max(2e3).nullable().optional(),
  startDate: dateString,
  endDate: dateString.nullable().optional(),
  careerType: careerTypeEnum.default("NON_EDUCATIONAL"),
  isVerified: _zod.z.boolean().default(false),
  convertedMonths: _zod.z.coerce.number().int().min(0).nullable().optional(),
  sortOrder: _zod.z.coerce.number().int().optional()
});
var updateCareerSchema = createCareerSchema.partial();
var createFamilySchema = _zod.z.object({
  relation: _zod.z.string().min(1).max(40),
  name: _zod.z.string().min(1).max(60),
  birthDate: dateString.nullable().optional(),
  occupation: _zod.z.string().max(80).nullable().optional(),
  cohabiting: _zod.z.boolean().default(false),
  sortOrder: _zod.z.coerce.number().int().optional()
});
var updateFamilySchema = createFamilySchema.partial();
var createQualificationSchema = _zod.z.object({
  type: qualificationTypeEnum.default("GENERAL"),
  name: _zod.z.string().min(1).max(120),
  grade: _zod.z.string().max(40).nullable().optional(),
  issuer: _zod.z.string().max(120).nullable().optional(),
  certNo: _zod.z.string().max(80).nullable().optional(),
  issueDate: dateString.nullable().optional(),
  sortOrder: _zod.z.coerce.number().int().optional()
});
var updateQualificationSchema = createQualificationSchema.partial();

// src/hr/viewer.ts
async function getHrViewer(prisma, userId) {
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
  if (!_optionalChain([user, 'optionalAccess', _ => _.staff])) return null;
  const isSystem = user.userRoles.some(
    (ur) => ur.role.isSystem
  );
  const allKeys = user.userRoles.flatMap(
    (ur) => ur.role.permissions.map((p) => p.menuKey)
  );
  const menuKeys = [...new Set(allKeys)];
  return { staffId: user.staff.id, menuKeys, isSystem };
}





















exports.canEdit = canEdit; exports.canManagePii = canManagePii; exports.canReadAll = canReadAll; exports.careerTypeEnum = careerTypeEnum; exports.createCareerSchema = createCareerSchema; exports.createEducationSchema = createEducationSchema; exports.createEmployeeSchema = createEmployeeSchema; exports.createFamilySchema = createFamilySchema; exports.createQualificationSchema = createQualificationSchema; exports.employeeStatusEnum = employeeStatusEnum; exports.employmentTypeEnum = employmentTypeEnum; exports.getHrViewer = getHrViewer; exports.listEmployeeQuerySchema = listEmployeeQuerySchema; exports.qualificationTypeEnum = qualificationTypeEnum; exports.scopeWhere = scopeWhere; exports.updateCareerSchema = updateCareerSchema; exports.updateEducationSchema = updateEducationSchema; exports.updateEmployeeSchema = updateEmployeeSchema; exports.updateFamilySchema = updateFamilySchema; exports.updateQualificationSchema = updateQualificationSchema;
//# sourceMappingURL=index.js.map