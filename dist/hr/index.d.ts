import { z } from 'zod';

type PrismaWhereInput = any;
interface HrViewer {
    /** 본인 인사기록 id (셀프서비스 문맥에서만 채워짐) */
    employeeId?: string;
    /** 현재 로그인 staff id */
    staffId: string;
    /** 보유 menuKey 집합 */
    menuKeys: string[];
    /** 시스템 역할 여부(모든 체크 bypass) */
    isSystem: boolean;
}
/** 인사 모듈 전체 조회 권한 = 메뉴키 보유 또는 시스템 역할. */
declare function canReadAll(v: HrViewer): boolean;
/** 주민번호 등 고유식별정보 평문 열람/수정 권한. */
declare function canManagePii(v: HrViewer): boolean;
/** 인사기록 편집 권한(현재는 조회 권한과 동일 게이트). */
declare function canEdit(v: HrViewer): boolean;
/**
 * 조회 범위.
 * - selfService 문맥에서 본인 employeeId 가 있으면 본인 레코드로 좁힌다.
 * - 그 외 전체 권한자(canReadAll)는 제한 없음(undefined).
 * - 권한도 셀프도 아니면 매칭 불가능한 where 로 차단한다.
 */
declare function scopeWhere(v: HrViewer, selfService?: boolean): PrismaWhereInput | undefined;

declare const employmentTypeEnum: z.ZodEnum<{
    REGULAR: "REGULAR";
    CONTRACT: "CONTRACT";
    PART_TIME: "PART_TIME";
    DISPATCH: "DISPATCH";
}>;
declare const employeeStatusEnum: z.ZodEnum<{
    ACTIVE: "ACTIVE";
    ON_LEAVE: "ON_LEAVE";
    RESIGNED: "RESIGNED";
}>;
declare const createEmployeeSchema: z.ZodObject<{
    employmentType: z.ZodDefault<z.ZodEnum<{
        REGULAR: "REGULAR";
        CONTRACT: "CONTRACT";
        PART_TIME: "PART_TIME";
        DISPATCH: "DISPATCH";
    }>>;
    status: z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        ON_LEAVE: "ON_LEAVE";
        RESIGNED: "RESIGNED";
    }>>;
    employeeNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    nameHanja: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    nameEng: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    birthDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    gender: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    nationalId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bloodType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    militaryService: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phoneMobile: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phoneHome: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodEmail>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    domicile: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    jobCategory: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    hireDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resignDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
/**
 * General edit path. `nationalId` is intentionally excluded: it is gated by `canManagePii`
 * and must go through `updateEmployeePiiSchema` after that check.
 */
declare const updateEmployeeSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    employmentType: z.ZodOptional<z.ZodEnum<{
        REGULAR: "REGULAR";
        CONTRACT: "CONTRACT";
        PART_TIME: "PART_TIME";
        DISPATCH: "DISPATCH";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        ON_LEAVE: "ON_LEAVE";
        RESIGNED: "RESIGNED";
    }>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    employeeNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    nameHanja: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    nameEng: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    birthDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    gender: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bloodType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    militaryService: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phoneMobile: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phoneHome: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodEmail>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    domicile: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    jobCategory: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    hireDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resignDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
/** PII-only edit path; the host must verify `canManagePii` before applying it. */
declare const updateEmployeePiiSchema: z.ZodObject<{
    nationalId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
declare const listEmployeeQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        ON_LEAVE: "ON_LEAVE";
        RESIGNED: "RESIGNED";
    }>>;
    employmentType: z.ZodOptional<z.ZodEnum<{
        REGULAR: "REGULAR";
        CONTRACT: "CONTRACT";
        PART_TIME: "PART_TIME";
        DISPATCH: "DISPATCH";
    }>>;
    sort: z.ZodDefault<z.ZodEnum<{
        name: "name";
        hireDate: "hireDate";
        sortOrder: "sortOrder";
        createdAt: "createdAt";
    }>>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
type UpdateEmployeePiiInput = z.infer<typeof updateEmployeePiiSchema>;
type ListEmployeeQuery = z.infer<typeof listEmployeeQuerySchema>;
declare const careerTypeEnum: z.ZodEnum<{
    EDUCATIONAL: "EDUCATIONAL";
    NON_EDUCATIONAL: "NON_EDUCATIONAL";
}>;
declare const qualificationTypeEnum: z.ZodEnum<{
    TEACHER_LICENSE: "TEACHER_LICENSE";
    GENERAL: "GENERAL";
}>;
declare const createEducationSchema: z.ZodObject<{
    schoolName: z.ZodString;
    major: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    degree: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    admissionDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    graduationDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    graduationType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const updateEducationSchema: z.ZodObject<{
    schoolName: z.ZodOptional<z.ZodString>;
    major: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    degree: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    admissionDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    graduationDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    graduationType: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    sortOrder: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
declare const createCareerSchema: z.ZodObject<{
    orgName: z.ZodString;
    position: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    duties: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    careerType: z.ZodDefault<z.ZodEnum<{
        EDUCATIONAL: "EDUCATIONAL";
        NON_EDUCATIONAL: "NON_EDUCATIONAL";
    }>>;
    isVerified: z.ZodDefault<z.ZodBoolean>;
    convertedMonths: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    sortOrder: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const updateCareerSchema: z.ZodObject<{
    orgName: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    duties: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    careerType: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        EDUCATIONAL: "EDUCATIONAL";
        NON_EDUCATIONAL: "NON_EDUCATIONAL";
    }>>>;
    isVerified: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    convertedMonths: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>>;
    sortOrder: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
declare const createFamilySchema: z.ZodObject<{
    relation: z.ZodString;
    name: z.ZodString;
    birthDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    occupation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    cohabiting: z.ZodDefault<z.ZodBoolean>;
    sortOrder: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const updateFamilySchema: z.ZodObject<{
    relation: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    birthDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    occupation: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    cohabiting: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    sortOrder: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
declare const createQualificationSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodEnum<{
        TEACHER_LICENSE: "TEACHER_LICENSE";
        GENERAL: "GENERAL";
    }>>;
    name: z.ZodString;
    grade: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    issuer: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    certNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    issueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const updateQualificationSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        TEACHER_LICENSE: "TEACHER_LICENSE";
        GENERAL: "GENERAL";
    }>>>;
    name: z.ZodOptional<z.ZodString>;
    grade: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    issuer: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    certNo: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    issueDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    sortOrder: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
type CreateEducationInput = z.infer<typeof createEducationSchema>;
type CreateCareerInput = z.infer<typeof createCareerSchema>;
type CreateFamilyInput = z.infer<typeof createFamilySchema>;
type CreateQualificationInput = z.infer<typeof createQualificationSchema>;
declare const appointmentTypeEnum: z.ZodEnum<{
    NEW_HIRE: "NEW_HIRE";
    TRANSFER: "TRANSFER";
    PROMOTION: "PROMOTION";
    POSITION_CHANGE: "POSITION_CHANGE";
    LEAVE: "LEAVE";
    REINSTATE: "REINSTATE";
    DISMISSAL: "DISMISSAL";
}>;
declare const createContractSchema: z.ZodObject<{
    contractType: z.ZodEnum<{
        REGULAR: "REGULAR";
        CONTRACT: "CONTRACT";
        PART_TIME: "PART_TIME";
        DISPATCH: "DISPATCH";
    }>;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    jobTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    salaryStep: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    salaryStepDeterminedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    renewalOfId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const updateContractSchema: z.ZodObject<{
    contractType: z.ZodOptional<z.ZodEnum<{
        REGULAR: "REGULAR";
        CONTRACT: "CONTRACT";
        PART_TIME: "PART_TIME";
        DISPATCH: "DISPATCH";
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    jobTitle: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    salaryStep: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>>;
    salaryStepDeterminedAt: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    renewalOfId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    sortOrder: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
declare const createAppointmentSchema: z.ZodObject<{
    type: z.ZodEnum<{
        NEW_HIRE: "NEW_HIRE";
        TRANSFER: "TRANSFER";
        PROMOTION: "PROMOTION";
        POSITION_CHANGE: "POSITION_CHANGE";
        LEAVE: "LEAVE";
        REINSTATE: "REINSTATE";
        DISMISSAL: "DISMISSAL";
    }>;
    effectiveDate: z.ZodString;
    positionTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    assignment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    docNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
declare const updateAppointmentSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        NEW_HIRE: "NEW_HIRE";
        TRANSFER: "TRANSFER";
        PROMOTION: "PROMOTION";
        POSITION_CHANGE: "POSITION_CHANGE";
        LEAVE: "LEAVE";
        REINSTATE: "REINSTATE";
        DISMISSAL: "DISMISSAL";
    }>>;
    effectiveDate: z.ZodOptional<z.ZodString>;
    positionTitle: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    assignment: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    reason: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    docNo: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, z.core.$strip>;
type CreateContractInput = z.infer<typeof createContractSchema>;
type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
declare const leaveTypeEnum: z.ZodEnum<{
    ANNUAL: "ANNUAL";
    SICK: "SICK";
    OFFICIAL: "OFFICIAL";
    FAMILY_EVENT: "FAMILY_EVENT";
    BUSINESS_TRIP: "BUSINESS_TRIP";
    OTHER: "OTHER";
}>;
declare const leaveStatusEnum: z.ZodEnum<{
    REQUESTED: "REQUESTED";
    APPROVED: "APPROVED";
    REJECTED: "REJECTED";
    CANCELED: "CANCELED";
}>;
declare const createLeaveSchema: z.ZodObject<{
    type: z.ZodEnum<{
        ANNUAL: "ANNUAL";
        SICK: "SICK";
        OFFICIAL: "OFFICIAL";
        FAMILY_EVENT: "FAMILY_EVENT";
        BUSINESS_TRIP: "BUSINESS_TRIP";
        OTHER: "OTHER";
    }>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    days: z.ZodCoercedNumber<unknown>;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        REQUESTED: "REQUESTED";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        CANCELED: "CANCELED";
    }>>;
}, z.core.$strip>;
declare const updateLeaveSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        ANNUAL: "ANNUAL";
        SICK: "SICK";
        OFFICIAL: "OFFICIAL";
        FAMILY_EVENT: "FAMILY_EVENT";
        BUSINESS_TRIP: "BUSINESS_TRIP";
        OTHER: "OTHER";
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    days: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        REQUESTED: "REQUESTED";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        CANCELED: "CANCELED";
    }>>;
    rejectReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
declare const createLeaveBalanceSchema: z.ZodObject<{
    year: z.ZodCoercedNumber<unknown>;
    type: z.ZodDefault<z.ZodEnum<{
        ANNUAL: "ANNUAL";
        SICK: "SICK";
        OFFICIAL: "OFFICIAL";
        FAMILY_EVENT: "FAMILY_EVENT";
        BUSINESS_TRIP: "BUSINESS_TRIP";
        OTHER: "OTHER";
    }>>;
    entitledDays: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
declare const updateLeaveBalanceSchema: z.ZodObject<{
    entitledDays: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
type CreateLeaveBalanceInput = z.infer<typeof createLeaveBalanceSchema>;
declare const createTrainingSchema: z.ZodObject<{
    title: z.ZodString;
    institution: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    category: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    startDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    hours: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    certNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const updateTrainingSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    institution: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    category: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    startDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    hours: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>>;
    certNo: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    sortOrder: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
declare const createReviewSchema: z.ZodObject<{
    periodYear: z.ZodCoercedNumber<unknown>;
    periodLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    score: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    grade: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    comments: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const updateReviewSchema: z.ZodObject<{
    periodYear: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    periodLabel: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    score: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>>;
    grade: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    comments: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    sortOrder: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
type CreateTrainingInput = z.infer<typeof createTrainingSchema>;
type CreateReviewInput = z.infer<typeof createReviewSchema>;

/**
 * 로그인 사용자의 인사 viewer(staff 식별 + 권한)를 해석한다.
 * counseling getCounselingViewer 와 동일하게 userRoles 만 본다(userGroups 미반영).
 * staff 레코드가 없으면 null.
 */
declare function getHrViewer(prisma: any, userId: string): Promise<HrViewer | null>;

export { type CreateAppointmentInput, type CreateCareerInput, type CreateContractInput, type CreateEducationInput, type CreateEmployeeInput, type CreateFamilyInput, type CreateLeaveBalanceInput, type CreateLeaveInput, type CreateQualificationInput, type CreateReviewInput, type CreateTrainingInput, type HrViewer, type ListEmployeeQuery, type UpdateEmployeeInput, type UpdateEmployeePiiInput, appointmentTypeEnum, canEdit, canManagePii, canReadAll, careerTypeEnum, createAppointmentSchema, createCareerSchema, createContractSchema, createEducationSchema, createEmployeeSchema, createFamilySchema, createLeaveBalanceSchema, createLeaveSchema, createQualificationSchema, createReviewSchema, createTrainingSchema, employeeStatusEnum, employmentTypeEnum, getHrViewer, leaveStatusEnum, leaveTypeEnum, listEmployeeQuerySchema, qualificationTypeEnum, scopeWhere, updateAppointmentSchema, updateCareerSchema, updateContractSchema, updateEducationSchema, updateEmployeePiiSchema, updateEmployeeSchema, updateFamilySchema, updateLeaveBalanceSchema, updateLeaveSchema, updateQualificationSchema, updateReviewSchema, updateTrainingSchema };
