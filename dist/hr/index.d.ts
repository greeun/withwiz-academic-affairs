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
        sortOrder: "sortOrder";
        hireDate: "hireDate";
        createdAt: "createdAt";
    }>>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
type ListEmployeeQuery = z.infer<typeof listEmployeeQuerySchema>;

/**
 * 로그인 사용자의 인사 viewer(staff 식별 + 권한)를 해석한다.
 * counseling getCounselingViewer 와 동일하게 userRoles 만 본다(userGroups 미반영).
 * staff 레코드가 없으면 null.
 */
declare function getHrViewer(prisma: any, userId: string): Promise<HrViewer | null>;

export { type CreateEmployeeInput, type HrViewer, type ListEmployeeQuery, type UpdateEmployeeInput, canEdit, canManagePii, canReadAll, createEmployeeSchema, employeeStatusEnum, employmentTypeEnum, getHrViewer, listEmployeeQuerySchema, scopeWhere, updateEmployeeSchema };
