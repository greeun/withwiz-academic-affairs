"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/validators/staff.validator.ts
var _zod = require('zod');
var createStaffSchema = _zod.z.object({
  name: _zod.z.string().min(1),
  nameEn: _zod.z.string().optional(),
  role: _zod.z.string().min(1),
  department: _zod.z.string().optional(),
  phone: _zod.z.string().optional(),
  email: _zod.z.string().email().optional(),
  photoUrl: _zod.z.string().optional(),
  bio: _zod.z.string().optional(),
  sortOrder: _zod.z.number().int().default(0),
  isPublished: _zod.z.boolean().default(true)
});
var updateStaffSchema = createStaffSchema.partial();

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
  title: _zod.z.string().min(1),
  year: _zod.z.number().int().min(2e3).max(2100),
  semester: _zod.z.number().int().min(1).max(2),
  schoolLevel: _zod.z.string().min(1),
  fileUrl: _zod.z.string().optional(),
  content: _zod.z.string().optional(),
  isActive: _zod.z.boolean().default(true)
});
var updateTimetableSchema = createTimetableSchema.partial();
var createAcademicEventSchema = _zod.z.object({
  title: _zod.z.string().min(1),
  startDate: _zod.z.coerce.date(),
  endDate: _zod.z.coerce.date().optional(),
  type: academicEventTypeEnum,
  schoolLevel: _zod.z.string().optional(),
  description: _zod.z.string().optional(),
  isAllDay: _zod.z.boolean().default(true),
  color: _zod.z.string().optional(),
  isPublished: _zod.z.boolean().default(true)
});
var updateAcademicEventSchema = createAcademicEventSchema.partial();

// src/validators/faq.validator.ts

var createFaqSchema = _zod.z.object({
  question: _zod.z.string().min(1),
  answer: _zod.z.string().min(1),
  categoryId: _zod.z.string().optional(),
  order: _zod.z.number().int().default(0),
  isPublished: _zod.z.boolean().default(true)
});
var updateFaqSchema = createFaqSchema.partial();
var createFaqCategorySchema = _zod.z.object({
  name: _zod.z.string().min(1),
  order: _zod.z.number().int().default(0)
});
var updateFaqCategorySchema = createFaqCategorySchema.partial();

// src/validators/student.validator.ts

var studentStatusEnum = _zod.z.enum(["ACTIVE", "ON_LEAVE", "GRADUATED", "WITHDRAWN"]);
var createStudentSchema = _zod.z.object({
  name: _zod.z.string().min(1),
  grade: _zod.z.number().int().min(1),
  classGroup: _zod.z.string().optional(),
  birthDate: _zod.z.coerce.date().optional(),
  phone: _zod.z.string().optional(),
  parentPhone: _zod.z.string().optional(),
  parentName: _zod.z.string().optional(),
  status: studentStatusEnum.default("ACTIVE"),
  notes: _zod.z.string().optional()
});
var updateStudentSchema = createStudentSchema.partial();

// src/validators/attendance.validator.ts

var attendanceStatusEnum = _zod.z.enum(["PRESENT", "ABSENT", "LATE", "EARLY_LEAVE", "EXCUSED"]);
var createAttendanceSchema = _zod.z.object({
  studentId: _zod.z.string().min(1),
  date: _zod.z.coerce.date(),
  status: attendanceStatusEnum,
  reason: _zod.z.string().optional()
});
var updateAttendanceSchema = createAttendanceSchema.partial();
var bulkAttendanceSchema = _zod.z.object({
  records: _zod.z.array(createAttendanceSchema).min(1)
});

// src/validators/counseling.validator.ts

var counselingTypeEnum = _zod.z.enum(["INITIAL", "REGULAR", "EMERGENCY", "PARENT", "ADMISSION"]);
var counselingStatusEnum = _zod.z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]);
var createCounselingSchema = _zod.z.object({
  studentId: _zod.z.string().optional(),
  counselorId: _zod.z.string().optional(),
  type: counselingTypeEnum,
  date: _zod.z.coerce.date(),
  title: _zod.z.string().min(1),
  content: _zod.z.string().min(1),
  parentName: _zod.z.string().optional(),
  parentPhone: _zod.z.string().optional(),
  status: counselingStatusEnum.default("SCHEDULED"),
  notes: _zod.z.string().optional()
});
var updateCounselingSchema = createCounselingSchema.partial();

// src/validators/admission.validator.ts

var registrationStatusEnum = _zod.z.enum(["PENDING", "CONFIRMED", "CANCELLED", "ATTENDED"]);
var createAdmissionSessionSchema = _zod.z.object({
  title: _zod.z.string().min(1),
  date: _zod.z.coerce.date(),
  location: _zod.z.string().optional(),
  capacity: _zod.z.number().int().min(1).default(30),
  description: _zod.z.string().optional(),
  isOpen: _zod.z.boolean().default(true)
});
var updateAdmissionSessionSchema = createAdmissionSessionSchema.partial();
var createAdmissionRegistrationSchema = _zod.z.object({
  sessionId: _zod.z.string().min(1),
  applicantName: _zod.z.string().min(1),
  phone: _zod.z.string().min(1),
  email: _zod.z.string().email().optional(),
  studentName: _zod.z.string().min(1),
  studentGrade: _zod.z.string().optional(),
  message: _zod.z.string().optional(),
  status: registrationStatusEnum.default("PENDING")
});
var updateAdmissionRegistrationSchema = createAdmissionRegistrationSchema.partial();





























exports.createStaffSchema = createStaffSchema; exports.updateStaffSchema = updateStaffSchema; exports.academicEventTypeEnum = academicEventTypeEnum; exports.createTimetableSchema = createTimetableSchema; exports.updateTimetableSchema = updateTimetableSchema; exports.createAcademicEventSchema = createAcademicEventSchema; exports.updateAcademicEventSchema = updateAcademicEventSchema; exports.createFaqSchema = createFaqSchema; exports.updateFaqSchema = updateFaqSchema; exports.createFaqCategorySchema = createFaqCategorySchema; exports.updateFaqCategorySchema = updateFaqCategorySchema; exports.studentStatusEnum = studentStatusEnum; exports.createStudentSchema = createStudentSchema; exports.updateStudentSchema = updateStudentSchema; exports.attendanceStatusEnum = attendanceStatusEnum; exports.createAttendanceSchema = createAttendanceSchema; exports.updateAttendanceSchema = updateAttendanceSchema; exports.bulkAttendanceSchema = bulkAttendanceSchema; exports.counselingTypeEnum = counselingTypeEnum; exports.counselingStatusEnum = counselingStatusEnum; exports.createCounselingSchema = createCounselingSchema; exports.updateCounselingSchema = updateCounselingSchema; exports.registrationStatusEnum = registrationStatusEnum; exports.createAdmissionSessionSchema = createAdmissionSessionSchema; exports.updateAdmissionSessionSchema = updateAdmissionSessionSchema; exports.createAdmissionRegistrationSchema = createAdmissionRegistrationSchema; exports.updateAdmissionRegistrationSchema = updateAdmissionRegistrationSchema;
//# sourceMappingURL=chunk-MOQ5TP3C.js.map