import { z } from "zod";

export const employmentTypeEnum = z.enum(["REGULAR", "CONTRACT", "PART_TIME", "DISPATCH"]);
export const employeeStatusEnum = z.enum(["ACTIVE", "ON_LEAVE", "RESIGNED"]);

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 합니다");
const nationalId = z
  .string()
  .regex(/^\d{6}-?\d{7}$/, "주민등록번호 형식(13자리)이 아닙니다");

const employeeBase = {
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
  notes: z.string().max(2000).nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
};

export const createEmployeeSchema = z.object({
  ...employeeBase,
  employmentType: employmentTypeEnum.default("REGULAR"),
  status: employeeStatusEnum.default("ACTIVE"),
});

export const updateEmployeeSchema = z.object({
  ...employeeBase,
  name: z.string().min(1).max(60).optional(),
  employmentType: employmentTypeEnum.optional(),
  status: employeeStatusEnum.optional(),
  isActive: z.boolean().optional(),
});

export const listEmployeeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(20),
  search: z.string().optional(),
  status: employeeStatusEnum.optional(),
  employmentType: employmentTypeEnum.optional(),
  sort: z.enum(["sortOrder", "name", "hireDate", "createdAt"]).default("sortOrder"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type ListEmployeeQuery = z.infer<typeof listEmployeeQuerySchema>;

// ─── 하위 도메인: 학력 / 경력 / 가족 / 자격 ───────────────────────────────

export const careerTypeEnum = z.enum(["EDUCATIONAL", "NON_EDUCATIONAL"]);
export const qualificationTypeEnum = z.enum(["TEACHER_LICENSE", "GENERAL"]);

export const createEducationSchema = z.object({
  schoolName: z.string().min(1).max(120),
  major: z.string().max(120).nullable().optional(),
  degree: z.string().max(60).nullable().optional(),
  admissionDate: dateString.nullable().optional(),
  graduationDate: dateString.nullable().optional(),
  graduationType: z.string().max(40).nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
});
export const updateEducationSchema = createEducationSchema.partial();

export const createCareerSchema = z.object({
  orgName: z.string().min(1).max(160),
  position: z.string().max(80).nullable().optional(),
  duties: z.string().max(2000).nullable().optional(),
  startDate: dateString,
  endDate: dateString.nullable().optional(),
  careerType: careerTypeEnum.default("NON_EDUCATIONAL"),
  isVerified: z.boolean().default(false),
  convertedMonths: z.coerce.number().int().min(0).nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
});
export const updateCareerSchema = createCareerSchema.partial();

export const createFamilySchema = z.object({
  relation: z.string().min(1).max(40),
  name: z.string().min(1).max(60),
  birthDate: dateString.nullable().optional(),
  occupation: z.string().max(80).nullable().optional(),
  cohabiting: z.boolean().default(false),
  sortOrder: z.coerce.number().int().optional(),
});
export const updateFamilySchema = createFamilySchema.partial();

export const createQualificationSchema = z.object({
  type: qualificationTypeEnum.default("GENERAL"),
  name: z.string().min(1).max(120),
  grade: z.string().max(40).nullable().optional(),
  issuer: z.string().max(120).nullable().optional(),
  certNo: z.string().max(80).nullable().optional(),
  issueDate: dateString.nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
});
export const updateQualificationSchema = createQualificationSchema.partial();

export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type CreateCareerInput = z.infer<typeof createCareerSchema>;
export type CreateFamilyInput = z.infer<typeof createFamilySchema>;
export type CreateQualificationInput = z.infer<typeof createQualificationSchema>;

// ─── 하위 도메인: 근로계약 / 발령 ────────────────────────────────────────────

export const appointmentTypeEnum = z.enum([
  "NEW_HIRE", "TRANSFER", "PROMOTION", "POSITION_CHANGE", "LEAVE", "REINSTATE", "DISMISSAL",
]);

export const createContractSchema = z.object({
  contractType: employmentTypeEnum,
  startDate: dateString,
  endDate: dateString.nullable().optional(),
  jobTitle: z.string().max(80).nullable().optional(),
  salaryStep: z.coerce.number().int().min(0).nullable().optional(),
  salaryStepDeterminedAt: dateString.nullable().optional(),
  renewalOfId: z.string().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
});
export const updateContractSchema = createContractSchema.partial();

export const createAppointmentSchema = z.object({
  type: appointmentTypeEnum,
  effectiveDate: dateString,
  positionTitle: z.string().max(80).nullable().optional(),
  assignment: z.string().max(120).nullable().optional(),
  reason: z.string().max(2000).nullable().optional(),
  docNo: z.string().max(80).nullable().optional(),
});
export const updateAppointmentSchema = createAppointmentSchema.partial();

export type CreateContractInput = z.infer<typeof createContractSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

// ─── 하위 도메인: 휴가신청 / 연차잔여 ────────────────────────────────────────────

export const leaveTypeEnum = z.enum(["ANNUAL", "SICK", "OFFICIAL", "FAMILY_EVENT", "BUSINESS_TRIP", "OTHER"]);
export const leaveStatusEnum = z.enum(["REQUESTED", "APPROVED", "REJECTED", "CANCELED"]);

export const createLeaveSchema = z.object({
  type: leaveTypeEnum,
  startDate: dateString,
  endDate: dateString,
  days: z.coerce.number().min(0).max(366),
  reason: z.string().max(2000).nullable().optional(),
  status: leaveStatusEnum.default("REQUESTED"),
});
export const updateLeaveSchema = z.object({
  type: leaveTypeEnum.optional(),
  startDate: dateString.optional(),
  endDate: dateString.optional(),
  days: z.coerce.number().min(0).max(366).optional(),
  reason: z.string().max(2000).nullable().optional(),
  status: leaveStatusEnum.optional(),
  rejectReason: z.string().max(2000).nullable().optional(),
});

export const createLeaveBalanceSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  type: leaveTypeEnum.default("ANNUAL"),
  entitledDays: z.coerce.number().min(0).max(366),
});
export const updateLeaveBalanceSchema = z.object({
  entitledDays: z.coerce.number().min(0).max(366).optional(),
});

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type CreateLeaveBalanceInput = z.infer<typeof createLeaveBalanceSchema>;

// ─── 하위 도메인: 연수(TrainingRecord) / 평가(PerformanceReview) ──────────────

export const createTrainingSchema = z.object({
  title: z.string().min(1).max(160),
  institution: z.string().max(120).nullable().optional(),
  category: z.string().max(60).nullable().optional(),
  startDate: dateString.nullable().optional(),
  endDate: dateString.nullable().optional(),
  hours: z.coerce.number().int().min(0).nullable().optional(),
  certNo: z.string().max(80).nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
});
export const updateTrainingSchema = createTrainingSchema.partial();

export const createReviewSchema = z.object({
  periodYear: z.coerce.number().int().min(2000).max(2100),
  periodLabel: z.string().max(40).nullable().optional(),
  score: z.coerce.number().min(0).max(100).nullable().optional(),
  grade: z.string().max(40).nullable().optional(),
  comments: z.string().max(4000).nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
});
export const updateReviewSchema = createReviewSchema.partial();

export type CreateTrainingInput = z.infer<typeof createTrainingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
