// src/validators/common.ts
import { z } from "zod";
var SHORT_TEXT_MAX = 200;
var MEDIUM_TEXT_MAX = 2e3;
var LONG_TEXT_MAX = 2e4;
var URL_MAX = 2048;
var PHONE_MAX = 40;
var SAFE_URL_SCHEMES = ["http:", "https:"];
function isSafeUrl(value) {
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const parsed = new URL(value);
    return SAFE_URL_SCHEMES.includes(parsed.protocol);
  } catch {
    return false;
  }
}
var safeUrl = z.string().max(URL_MAX).refine(isSafeUrl, "http(s) URL \uB610\uB294 \uC0AC\uC774\uD2B8 \uB0B4 \uACBD\uB85C\uB9CC \uD5C8\uC6A9\uB429\uB2C8\uB2E4");
var hexColor = z.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "#RRGGBB \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4");
var shortText = z.string().max(SHORT_TEXT_MAX);
var mediumText = z.string().max(MEDIUM_TEXT_MAX);
var longText = z.string().max(LONG_TEXT_MAX);
var phoneText = z.string().max(PHONE_MAX);
function partialUpdate(schema) {
  const shape = {};
  for (const [key, field] of Object.entries(schema.shape)) {
    const base = field instanceof z.ZodDefault ? field.removeDefault() : field;
    shape[key] = base.optional();
  }
  return z.object(shape);
}

// src/validators/staff.validator.ts
import { z as z2 } from "zod";
var createStaffSchema = z2.object({
  name: shortText.min(1),
  nameEn: shortText.optional(),
  role: shortText.min(1),
  department: shortText.optional(),
  phone: phoneText.optional(),
  email: z2.string().email().max(200).optional(),
  photoUrl: safeUrl.optional(),
  bio: mediumText.optional(),
  sortOrder: z2.number().int().default(0),
  isPublished: z2.boolean().default(true)
});
var updateStaffSchema = partialUpdate(createStaffSchema);

// src/validators/academic-calendar.validator.ts
import { z as z3 } from "zod";
var academicEventTypeEnum = z3.enum([
  "SEMESTER_START",
  "SEMESTER_END",
  "EXAM",
  "VACATION",
  "HOLIDAY",
  "EVENT",
  "FIELD_TRIP",
  "PARENT_MEETING",
  "OTHER"
]);
var createTimetableSchema = z3.object({
  title: shortText.min(1),
  year: z3.number().int().min(2e3).max(2100),
  semester: z3.number().int().min(1).max(2),
  schoolLevel: z3.string().min(1).max(32),
  fileUrl: safeUrl.optional(),
  content: longText.optional(),
  isActive: z3.boolean().default(true)
});
var updateTimetableSchema = partialUpdate(createTimetableSchema);
var createAcademicEventSchema = z3.object({
  title: shortText.min(1),
  startDate: z3.coerce.date(),
  endDate: z3.coerce.date().optional(),
  type: academicEventTypeEnum,
  schoolLevel: z3.string().max(32).optional(),
  description: mediumText.optional(),
  isAllDay: z3.boolean().default(true),
  color: hexColor.optional(),
  isPublished: z3.boolean().default(true)
});
var updateAcademicEventSchema = partialUpdate(createAcademicEventSchema);

// src/validators/faq.validator.ts
import { z as z4 } from "zod";
var createFaqSchema = z4.object({
  question: z4.string().min(1).max(500),
  answer: longText.min(1),
  categoryId: z4.string().max(64).optional(),
  order: z4.number().int().default(0),
  isPublished: z4.boolean().default(true)
});
var updateFaqSchema = partialUpdate(createFaqSchema);
var createFaqCategorySchema = z4.object({
  name: shortText.min(1),
  order: z4.number().int().default(0)
});
var updateFaqCategorySchema = partialUpdate(createFaqCategorySchema);

// src/validators/student.validator.ts
import { z as z5 } from "zod";
var studentStatusEnum = z5.enum(["ACTIVE", "ON_LEAVE", "GRADUATED", "WITHDRAWN"]);
var createStudentSchema = z5.object({
  name: shortText.min(1),
  grade: z5.number().int().min(1),
  classGroup: z5.string().max(64).optional(),
  birthDate: z5.coerce.date().optional(),
  phone: phoneText.optional(),
  parentPhone: phoneText.optional(),
  parentName: shortText.optional(),
  status: studentStatusEnum.default("ACTIVE"),
  notes: mediumText.optional()
});
var updateStudentSchema = partialUpdate(createStudentSchema);

// src/validators/attendance.validator.ts
import { z as z6 } from "zod";
var attendanceStatusEnum = z6.enum(["PRESENT", "ABSENT", "LATE", "EARLY_LEAVE", "EXCUSED"]);
var MAX_BULK_ATTENDANCE = 500;
var createAttendanceSchema = z6.object({
  studentId: z6.string().min(1).max(64),
  date: z6.coerce.date(),
  status: attendanceStatusEnum,
  reason: mediumText.optional()
});
var updateAttendanceSchema = partialUpdate(createAttendanceSchema.omit({ studentId: true }));
var bulkAttendanceSchema = z6.object({
  records: z6.array(createAttendanceSchema).min(1).max(MAX_BULK_ATTENDANCE)
});

// src/validators/counseling.validator.ts
import { z as z7 } from "zod";
var counselingTypeEnum = z7.enum(["INITIAL", "REGULAR", "EMERGENCY", "PARENT", "ADMISSION"]);
var counselingStatusEnum = z7.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]);
var createCounselingSchema = z7.object({
  studentId: z7.string().max(64).optional(),
  counselorId: z7.string().max(64).optional(),
  type: counselingTypeEnum,
  date: z7.coerce.date(),
  title: shortText.min(1),
  content: longText.min(1),
  parentName: shortText.optional(),
  parentPhone: phoneText.optional(),
  status: counselingStatusEnum.default("SCHEDULED"),
  notes: mediumText.optional()
});
var updateCounselingSchema = partialUpdate(createCounselingSchema.omit({ counselorId: true }));

// src/validators/admission.validator.ts
import { z as z8 } from "zod";
var registrationStatusEnum = z8.enum(["PENDING", "CONFIRMED", "CANCELLED", "ATTENDED"]);
var createAdmissionSessionSchema = z8.object({
  title: shortText.min(1),
  date: z8.coerce.date(),
  location: shortText.optional(),
  capacity: z8.number().int().min(1).max(1e5).default(30),
  description: mediumText.optional(),
  isOpen: z8.boolean().default(true)
});
var updateAdmissionSessionSchema = partialUpdate(createAdmissionSessionSchema);
var createAdmissionRegistrationSchema = z8.object({
  sessionId: z8.string().min(1).max(64),
  applicantName: shortText.min(1),
  phone: phoneText.min(1),
  email: z8.string().email().max(200).optional(),
  studentName: shortText.min(1),
  studentGrade: z8.string().max(32).optional(),
  message: mediumText.optional(),
  status: registrationStatusEnum.default("PENDING")
});
var updateAdmissionRegistrationSchema = partialUpdate(createAdmissionRegistrationSchema);

export {
  SHORT_TEXT_MAX,
  MEDIUM_TEXT_MAX,
  LONG_TEXT_MAX,
  URL_MAX,
  PHONE_MAX,
  isSafeUrl,
  safeUrl,
  hexColor,
  shortText,
  mediumText,
  longText,
  phoneText,
  partialUpdate,
  createStaffSchema,
  updateStaffSchema,
  academicEventTypeEnum,
  createTimetableSchema,
  updateTimetableSchema,
  createAcademicEventSchema,
  updateAcademicEventSchema,
  createFaqSchema,
  updateFaqSchema,
  createFaqCategorySchema,
  updateFaqCategorySchema,
  studentStatusEnum,
  createStudentSchema,
  updateStudentSchema,
  attendanceStatusEnum,
  MAX_BULK_ATTENDANCE,
  createAttendanceSchema,
  updateAttendanceSchema,
  bulkAttendanceSchema,
  counselingTypeEnum,
  counselingStatusEnum,
  createCounselingSchema,
  updateCounselingSchema,
  registrationStatusEnum,
  createAdmissionSessionSchema,
  updateAdmissionSessionSchema,
  createAdmissionRegistrationSchema,
  updateAdmissionRegistrationSchema
};
//# sourceMappingURL=chunk-T3WKWIOX.mjs.map