// src/validators/staff.validator.ts
import { z } from "zod";
var createStaffSchema = z.object({
  name: z.string().min(1),
  nameEn: z.string().optional(),
  role: z.string().min(1),
  department: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  photoUrl: z.string().optional(),
  bio: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true)
});
var updateStaffSchema = createStaffSchema.partial();

// src/validators/academic-calendar.validator.ts
import { z as z2 } from "zod";
var academicEventTypeEnum = z2.enum([
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
var createTimetableSchema = z2.object({
  title: z2.string().min(1),
  year: z2.number().int().min(2e3).max(2100),
  semester: z2.number().int().min(1).max(2),
  schoolLevel: z2.string().min(1),
  fileUrl: z2.string().optional(),
  content: z2.string().optional(),
  isActive: z2.boolean().default(true)
});
var updateTimetableSchema = createTimetableSchema.partial();
var createAcademicEventSchema = z2.object({
  title: z2.string().min(1),
  startDate: z2.coerce.date(),
  endDate: z2.coerce.date().optional(),
  type: academicEventTypeEnum,
  schoolLevel: z2.string().optional(),
  description: z2.string().optional(),
  isAllDay: z2.boolean().default(true),
  color: z2.string().optional(),
  isPublished: z2.boolean().default(true)
});
var updateAcademicEventSchema = createAcademicEventSchema.partial();

// src/validators/faq.validator.ts
import { z as z3 } from "zod";
var createFaqSchema = z3.object({
  question: z3.string().min(1),
  answer: z3.string().min(1),
  categoryId: z3.string().optional(),
  order: z3.number().int().default(0),
  isPublished: z3.boolean().default(true)
});
var updateFaqSchema = createFaqSchema.partial();
var createFaqCategorySchema = z3.object({
  name: z3.string().min(1),
  order: z3.number().int().default(0)
});
var updateFaqCategorySchema = createFaqCategorySchema.partial();

// src/validators/student.validator.ts
import { z as z4 } from "zod";
var studentStatusEnum = z4.enum(["ACTIVE", "ON_LEAVE", "GRADUATED", "WITHDRAWN"]);
var createStudentSchema = z4.object({
  name: z4.string().min(1),
  grade: z4.number().int().min(1),
  classGroup: z4.string().optional(),
  birthDate: z4.coerce.date().optional(),
  phone: z4.string().optional(),
  parentPhone: z4.string().optional(),
  parentName: z4.string().optional(),
  status: studentStatusEnum.default("ACTIVE"),
  notes: z4.string().optional()
});
var updateStudentSchema = createStudentSchema.partial();

// src/validators/attendance.validator.ts
import { z as z5 } from "zod";
var attendanceStatusEnum = z5.enum(["PRESENT", "ABSENT", "LATE", "EARLY_LEAVE", "EXCUSED"]);
var createAttendanceSchema = z5.object({
  studentId: z5.string().min(1),
  date: z5.coerce.date(),
  status: attendanceStatusEnum,
  reason: z5.string().optional()
});
var updateAttendanceSchema = createAttendanceSchema.partial();
var bulkAttendanceSchema = z5.object({
  records: z5.array(createAttendanceSchema).min(1)
});

// src/validators/counseling.validator.ts
import { z as z6 } from "zod";
var counselingTypeEnum = z6.enum(["INITIAL", "REGULAR", "EMERGENCY", "PARENT", "ADMISSION"]);
var counselingStatusEnum = z6.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]);
var createCounselingSchema = z6.object({
  studentId: z6.string().optional(),
  counselorId: z6.string().optional(),
  type: counselingTypeEnum,
  date: z6.coerce.date(),
  title: z6.string().min(1),
  content: z6.string().min(1),
  parentName: z6.string().optional(),
  parentPhone: z6.string().optional(),
  status: counselingStatusEnum.default("SCHEDULED"),
  notes: z6.string().optional()
});
var updateCounselingSchema = createCounselingSchema.partial();

// src/validators/admission.validator.ts
import { z as z7 } from "zod";
var registrationStatusEnum = z7.enum(["PENDING", "CONFIRMED", "CANCELLED", "ATTENDED"]);
var createAdmissionSessionSchema = z7.object({
  title: z7.string().min(1),
  date: z7.coerce.date(),
  location: z7.string().optional(),
  capacity: z7.number().int().min(1).default(30),
  description: z7.string().optional(),
  isOpen: z7.boolean().default(true)
});
var updateAdmissionSessionSchema = createAdmissionSessionSchema.partial();
var createAdmissionRegistrationSchema = z7.object({
  sessionId: z7.string().min(1),
  applicantName: z7.string().min(1),
  phone: z7.string().min(1),
  email: z7.string().email().optional(),
  studentName: z7.string().min(1),
  studentGrade: z7.string().optional(),
  message: z7.string().optional(),
  status: registrationStatusEnum.default("PENDING")
});
var updateAdmissionRegistrationSchema = createAdmissionRegistrationSchema.partial();

export {
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
//# sourceMappingURL=chunk-PDPSZ56T.mjs.map