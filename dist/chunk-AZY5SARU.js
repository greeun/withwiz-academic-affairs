"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/validators/common.ts
var _zod = require('zod');
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
  } catch (e) {
    return false;
  }
}
var safeUrl = _zod.z.string().max(URL_MAX).refine(isSafeUrl, "http(s) URL \uB610\uB294 \uC0AC\uC774\uD2B8 \uB0B4 \uACBD\uB85C\uB9CC \uD5C8\uC6A9\uB429\uB2C8\uB2E4");
var hexColor = _zod.z.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "#RRGGBB \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4");
var shortText = _zod.z.string().max(SHORT_TEXT_MAX);
var mediumText = _zod.z.string().max(MEDIUM_TEXT_MAX);
var longText = _zod.z.string().max(LONG_TEXT_MAX);
var phoneText = _zod.z.string().max(PHONE_MAX);
function partialUpdate(schema) {
  const shape = {};
  for (const [key, field] of Object.entries(schema.shape)) {
    const base = field instanceof _zod.z.ZodDefault ? field.removeDefault() : field;
    shape[key] = base.optional();
  }
  return _zod.z.object(shape);
}

// src/validators/staff.validator.ts

var createStaffSchema = _zod.z.object({
  name: shortText.min(1),
  nameEn: shortText.optional(),
  role: shortText.min(1),
  department: shortText.optional(),
  phone: phoneText.optional(),
  email: _zod.z.string().email().max(200).optional(),
  photoUrl: safeUrl.optional(),
  bio: mediumText.optional(),
  sortOrder: _zod.z.number().int().default(0),
  isPublished: _zod.z.boolean().default(true)
});
var updateStaffSchema = partialUpdate(createStaffSchema);

// src/validators/academic-calendar.validator.ts

var academicEventTypeEnum = _zod.z.enum([
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
var createTimetableSchema = _zod.z.object({
  title: shortText.min(1),
  year: _zod.z.number().int().min(2e3).max(2100),
  semester: _zod.z.number().int().min(1).max(2),
  schoolLevel: _zod.z.string().min(1).max(32),
  fileUrl: safeUrl.optional(),
  content: longText.optional(),
  isActive: _zod.z.boolean().default(true)
});
var updateTimetableSchema = partialUpdate(createTimetableSchema);
var createAcademicEventSchema = _zod.z.object({
  title: shortText.min(1),
  startDate: _zod.z.coerce.date(),
  endDate: _zod.z.coerce.date().optional(),
  type: academicEventTypeEnum,
  schoolLevel: _zod.z.string().max(32).optional(),
  description: mediumText.optional(),
  isAllDay: _zod.z.boolean().default(true),
  color: hexColor.optional(),
  isPublished: _zod.z.boolean().default(true)
});
var updateAcademicEventSchema = partialUpdate(createAcademicEventSchema);

// src/validators/faq.validator.ts

var createFaqSchema = _zod.z.object({
  question: _zod.z.string().min(1).max(500),
  answer: longText.min(1),
  categoryId: _zod.z.string().max(64).optional(),
  order: _zod.z.number().int().default(0),
  isPublished: _zod.z.boolean().default(true)
});
var updateFaqSchema = partialUpdate(createFaqSchema);
var createFaqCategorySchema = _zod.z.object({
  name: shortText.min(1),
  order: _zod.z.number().int().default(0)
});
var updateFaqCategorySchema = partialUpdate(createFaqCategorySchema);

// src/validators/student.validator.ts

var studentStatusEnum = _zod.z.enum(["ACTIVE", "ON_LEAVE", "GRADUATED", "WITHDRAWN"]);
var createStudentSchema = _zod.z.object({
  name: shortText.min(1),
  grade: _zod.z.number().int().min(1),
  classGroup: _zod.z.string().max(64).optional(),
  birthDate: _zod.z.coerce.date().optional(),
  phone: phoneText.optional(),
  parentPhone: phoneText.optional(),
  parentName: shortText.optional(),
  status: studentStatusEnum.default("ACTIVE"),
  notes: mediumText.optional()
});
var updateStudentSchema = partialUpdate(createStudentSchema);

// src/validators/attendance.validator.ts

var attendanceStatusEnum = _zod.z.enum(["PRESENT", "ABSENT", "LATE", "EARLY_LEAVE", "EXCUSED"]);
var MAX_BULK_ATTENDANCE = 500;
var createAttendanceSchema = _zod.z.object({
  studentId: _zod.z.string().min(1).max(64),
  date: _zod.z.coerce.date(),
  status: attendanceStatusEnum,
  reason: mediumText.optional()
});
var updateAttendanceSchema = partialUpdate(createAttendanceSchema.omit({ studentId: true }));
var bulkAttendanceSchema = _zod.z.object({
  records: _zod.z.array(createAttendanceSchema).min(1).max(MAX_BULK_ATTENDANCE)
});

// src/validators/counseling.validator.ts

var counselingTypeEnum = _zod.z.enum(["INITIAL", "REGULAR", "EMERGENCY", "PARENT", "ADMISSION"]);
var counselingStatusEnum = _zod.z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]);
var createCounselingSchema = _zod.z.object({
  studentId: _zod.z.string().max(64).optional(),
  counselorId: _zod.z.string().max(64).optional(),
  type: counselingTypeEnum,
  date: _zod.z.coerce.date(),
  title: shortText.min(1),
  content: longText.min(1),
  parentName: shortText.optional(),
  parentPhone: phoneText.optional(),
  status: counselingStatusEnum.default("SCHEDULED"),
  notes: mediumText.optional()
});
var updateCounselingSchema = partialUpdate(createCounselingSchema.omit({ counselorId: true }));

// src/validators/admission.validator.ts

var registrationStatusEnum = _zod.z.enum(["PENDING", "CONFIRMED", "CANCELLED", "ATTENDED"]);
var createAdmissionSessionSchema = _zod.z.object({
  title: shortText.min(1),
  date: _zod.z.coerce.date(),
  location: shortText.optional(),
  capacity: _zod.z.number().int().min(1).max(1e5).default(30),
  description: mediumText.optional(),
  isOpen: _zod.z.boolean().default(true)
});
var updateAdmissionSessionSchema = partialUpdate(createAdmissionSessionSchema);
var createAdmissionRegistrationSchema = _zod.z.object({
  sessionId: _zod.z.string().min(1).max(64),
  applicantName: shortText.min(1),
  phone: phoneText.min(1),
  email: _zod.z.string().email().max(200).optional(),
  studentName: shortText.min(1),
  studentGrade: _zod.z.string().max(32).optional(),
  message: mediumText.optional(),
  status: registrationStatusEnum.default("PENDING")
});
var updateAdmissionRegistrationSchema = partialUpdate(createAdmissionRegistrationSchema);











































exports.SHORT_TEXT_MAX = SHORT_TEXT_MAX; exports.MEDIUM_TEXT_MAX = MEDIUM_TEXT_MAX; exports.LONG_TEXT_MAX = LONG_TEXT_MAX; exports.URL_MAX = URL_MAX; exports.PHONE_MAX = PHONE_MAX; exports.isSafeUrl = isSafeUrl; exports.safeUrl = safeUrl; exports.hexColor = hexColor; exports.shortText = shortText; exports.mediumText = mediumText; exports.longText = longText; exports.phoneText = phoneText; exports.partialUpdate = partialUpdate; exports.createStaffSchema = createStaffSchema; exports.updateStaffSchema = updateStaffSchema; exports.academicEventTypeEnum = academicEventTypeEnum; exports.createTimetableSchema = createTimetableSchema; exports.updateTimetableSchema = updateTimetableSchema; exports.createAcademicEventSchema = createAcademicEventSchema; exports.updateAcademicEventSchema = updateAcademicEventSchema; exports.createFaqSchema = createFaqSchema; exports.updateFaqSchema = updateFaqSchema; exports.createFaqCategorySchema = createFaqCategorySchema; exports.updateFaqCategorySchema = updateFaqCategorySchema; exports.studentStatusEnum = studentStatusEnum; exports.createStudentSchema = createStudentSchema; exports.updateStudentSchema = updateStudentSchema; exports.attendanceStatusEnum = attendanceStatusEnum; exports.MAX_BULK_ATTENDANCE = MAX_BULK_ATTENDANCE; exports.createAttendanceSchema = createAttendanceSchema; exports.updateAttendanceSchema = updateAttendanceSchema; exports.bulkAttendanceSchema = bulkAttendanceSchema; exports.counselingTypeEnum = counselingTypeEnum; exports.counselingStatusEnum = counselingStatusEnum; exports.createCounselingSchema = createCounselingSchema; exports.updateCounselingSchema = updateCounselingSchema; exports.registrationStatusEnum = registrationStatusEnum; exports.createAdmissionSessionSchema = createAdmissionSessionSchema; exports.updateAdmissionSessionSchema = updateAdmissionSessionSchema; exports.createAdmissionRegistrationSchema = createAdmissionRegistrationSchema; exports.updateAdmissionRegistrationSchema = updateAdmissionRegistrationSchema;
//# sourceMappingURL=chunk-AZY5SARU.js.map