// src/hr/policy.ts
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
import { z } from "zod";
var employmentTypeEnum = z.enum(["REGULAR", "CONTRACT", "PART_TIME", "DISPATCH"]);
var employeeStatusEnum = z.enum(["ACTIVE", "ON_LEAVE", "RESIGNED"]);
var dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4");
var nationalId = z.string().regex(/^\d{6}-?\d{7}$/, "\uC8FC\uBBFC\uB4F1\uB85D\uBC88\uD638 \uD615\uC2DD(13\uC790\uB9AC)\uC774 \uC544\uB2D9\uB2C8\uB2E4");
var employeeBase = {
  employeeNo: z.string().max(40).nullable().optional(),
  name: z.string().min(1).max(60),
  nameHanja: z.string().max(60).nullable().optional(),
  nameEng: z.string().max(120).nullable().optional(),
  birthDate: dateString.nullable().optional(),
  gender: z.string().max(20).nullable().optional(),
  // 평문 주민번호: 호스트가 받아 암호화 후 저장(원문 컬럼 없음). 옵션.
  nationalId: nationalId.nullable().optional(),
  bloodType: z.string().max(10).nullable().optional(),
  militaryService: z.string().max(200).nullable().optional(),
  phoneMobile: z.string().max(40).nullable().optional(),
  phoneHome: z.string().max(40).nullable().optional(),
  email: z.email().max(200).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  domicile: z.string().max(500).nullable().optional(),
  jobCategory: z.string().max(60).nullable().optional(),
  hireDate: dateString.nullable().optional(),
  resignDate: dateString.nullable().optional(),
  notes: z.string().max(2e3).nullable().optional(),
  sortOrder: z.coerce.number().int().optional()
};
var createEmployeeSchema = z.object({
  ...employeeBase,
  employmentType: employmentTypeEnum.default("REGULAR"),
  status: employeeStatusEnum.default("ACTIVE")
});
var updateEmployeeSchema = z.object({
  ...employeeBase,
  name: z.string().min(1).max(60).optional(),
  employmentType: employmentTypeEnum.optional(),
  status: employeeStatusEnum.optional(),
  isActive: z.boolean().optional()
});
var listEmployeeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(20),
  search: z.string().optional(),
  status: employeeStatusEnum.optional(),
  employmentType: employmentTypeEnum.optional(),
  sort: z.enum(["sortOrder", "name", "hireDate", "createdAt"]).default("sortOrder"),
  order: z.enum(["asc", "desc"]).default("asc")
});
var careerTypeEnum = z.enum(["EDUCATIONAL", "NON_EDUCATIONAL"]);
var qualificationTypeEnum = z.enum(["TEACHER_LICENSE", "GENERAL"]);
var createEducationSchema = z.object({
  schoolName: z.string().min(1).max(120),
  major: z.string().max(120).nullable().optional(),
  degree: z.string().max(60).nullable().optional(),
  admissionDate: dateString.nullable().optional(),
  graduationDate: dateString.nullable().optional(),
  graduationType: z.string().max(40).nullable().optional(),
  sortOrder: z.coerce.number().int().optional()
});
var updateEducationSchema = createEducationSchema.partial();
var createCareerSchema = z.object({
  orgName: z.string().min(1).max(160),
  position: z.string().max(80).nullable().optional(),
  duties: z.string().max(2e3).nullable().optional(),
  startDate: dateString,
  endDate: dateString.nullable().optional(),
  careerType: careerTypeEnum.default("NON_EDUCATIONAL"),
  isVerified: z.boolean().default(false),
  convertedMonths: z.coerce.number().int().min(0).nullable().optional(),
  sortOrder: z.coerce.number().int().optional()
});
var updateCareerSchema = createCareerSchema.partial();
var createFamilySchema = z.object({
  relation: z.string().min(1).max(40),
  name: z.string().min(1).max(60),
  birthDate: dateString.nullable().optional(),
  occupation: z.string().max(80).nullable().optional(),
  cohabiting: z.boolean().default(false),
  sortOrder: z.coerce.number().int().optional()
});
var updateFamilySchema = createFamilySchema.partial();
var createQualificationSchema = z.object({
  type: qualificationTypeEnum.default("GENERAL"),
  name: z.string().min(1).max(120),
  grade: z.string().max(40).nullable().optional(),
  issuer: z.string().max(120).nullable().optional(),
  certNo: z.string().max(80).nullable().optional(),
  issueDate: dateString.nullable().optional(),
  sortOrder: z.coerce.number().int().optional()
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
  if (!user?.staff) return null;
  const isSystem = user.userRoles.some(
    (ur) => ur.role.isSystem
  );
  const allKeys = user.userRoles.flatMap(
    (ur) => ur.role.permissions.map((p) => p.menuKey)
  );
  const menuKeys = [...new Set(allKeys)];
  return { staffId: user.staff.id, menuKeys, isSystem };
}
export {
  canEdit,
  canManagePii,
  canReadAll,
  careerTypeEnum,
  createCareerSchema,
  createEducationSchema,
  createEmployeeSchema,
  createFamilySchema,
  createQualificationSchema,
  employeeStatusEnum,
  employmentTypeEnum,
  getHrViewer,
  listEmployeeQuerySchema,
  qualificationTypeEnum,
  scopeWhere,
  updateCareerSchema,
  updateEducationSchema,
  updateEmployeeSchema,
  updateFamilySchema,
  updateQualificationSchema
};
//# sourceMappingURL=index.mjs.map