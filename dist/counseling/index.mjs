// src/counseling/policy.ts
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
    student: { homeroomStaffId: record.student?.classGroup?.homeroomStaffId ?? null }
  };
}
function flattenStudentForPolicy(student) {
  return { homeroomStaffId: student.classGroup?.homeroomStaffId ?? null };
}

// src/counseling/schema.ts
import { z } from "zod";
var counselingCategoryEnum = z.enum([
  "ACADEMIC",
  "LIFE",
  "PEER",
  "CAREER",
  "FAMILY",
  "ETC"
]);
var counselingMethodEnum = z.enum([
  "IN_PERSON",
  "PHONE",
  "TEXT",
  "VIDEO"
]);
var counselingScopeEnum = z.enum(["STUDENT", "PARENT", "BOTH"]);
var createCounselingSchema = z.object({
  studentId: z.string().min(1),
  counseledAt: z.string().datetime({ offset: true }),
  category: counselingCategoryEnum,
  method: counselingMethodEnum,
  scope: counselingScopeEnum,
  topic: z.string().min(1).max(120),
  content: z.string().min(1),
  action: z.string().nullable().optional(),
  followUpAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  followUpDone: z.boolean().optional(),
  followUpNote: z.string().nullable().optional()
}).refine(
  (v) => {
    if (!v.followUpAt) return true;
    const counseledDate = v.counseledAt.slice(0, 10);
    return v.followUpAt >= counseledDate;
  },
  { path: ["followUpAt"], message: "\uD6C4\uC18D\uC870\uCE58 \uC608\uC815\uC77C\uC740 \uC0C1\uB2F4\uC77C\uC790 \uC774\uD6C4\uC5EC\uC57C \uD569\uB2C8\uB2E4" }
);
var updateCounselingSchema = z.object({
  studentId: z.string().min(1).optional(),
  counseledAt: z.string().datetime({ offset: true }).optional(),
  category: counselingCategoryEnum.optional(),
  method: counselingMethodEnum.optional(),
  scope: counselingScopeEnum.optional(),
  topic: z.string().min(1).max(120).optional(),
  content: z.string().min(1).optional(),
  action: z.string().nullable().optional(),
  followUpAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  followUpDone: z.boolean().optional(),
  followUpNote: z.string().nullable().optional()
});
var listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(20),
  search: z.string().optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  studentId: z.string().optional(),
  category: counselingCategoryEnum.optional(),
  method: counselingMethodEnum.optional(),
  authorId: z.string().optional(),
  followUp: z.enum(["due", "done", "none"]).optional(),
  sort: z.enum(["counseledAt", "createdAt"]).default("counseledAt"),
  order: z.enum(["asc", "desc"]).default("desc")
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
  if (!user?.staff) return null;
  const isSystem = user.userRoles.some((ur) => ur.role.isSystem);
  const allKeys = user.userRoles.flatMap(
    (ur) => ur.role.permissions.map((p) => p.menuKey)
  );
  const menuKeys = [...new Set(allKeys)];
  return { staffId: user.staff.id, menuKeys, isSystem };
}
export {
  canCreate,
  canRead,
  canUpdate,
  counselingCategoryEnum,
  counselingMethodEnum,
  counselingScopeEnum,
  createCounselingSchema,
  flattenForPolicy,
  flattenStudentForPolicy,
  getCounselingViewer,
  listQuerySchema,
  scopeWhere,
  updateCounselingSchema
};
//# sourceMappingURL=index.mjs.map