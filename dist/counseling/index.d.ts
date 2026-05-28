import { z } from 'zod';

type PrismaWhereInput = any;
interface CounselingViewer {
    staffId: string;
    menuKeys: string[];
    isSystem: boolean;
}
interface CounselingRecord {
    authorId: string;
    student: {
        homeroomStaffId: string | null;
    };
}
interface CounselingDraft {
    student: {
        homeroomStaffId: string | null;
    };
}
declare function canRead(v: CounselingViewer, r: CounselingRecord): boolean;
declare function canUpdate(v: CounselingViewer, r: CounselingRecord): boolean;
declare function canCreate(v: CounselingViewer, d: CounselingDraft): boolean;
declare function scopeWhere(v: CounselingViewer): PrismaWhereInput | undefined;
declare function flattenForPolicy(record: {
    authorId: string;
    student: {
        classGroup: {
            homeroomStaffId: string | null;
        } | null;
    } | null;
}): CounselingRecord;
declare function flattenStudentForPolicy(student: {
    classGroup: {
        homeroomStaffId: string | null;
    } | null;
}): CounselingDraft["student"];

declare const counselingCategoryEnum: z.ZodEnum<{
    ACADEMIC: "ACADEMIC";
    LIFE: "LIFE";
    PEER: "PEER";
    CAREER: "CAREER";
    FAMILY: "FAMILY";
    ETC: "ETC";
}>;
declare const counselingMethodEnum: z.ZodEnum<{
    IN_PERSON: "IN_PERSON";
    PHONE: "PHONE";
    TEXT: "TEXT";
    VIDEO: "VIDEO";
}>;
declare const counselingScopeEnum: z.ZodEnum<{
    STUDENT: "STUDENT";
    PARENT: "PARENT";
    BOTH: "BOTH";
}>;
declare const createCounselingSchema: z.ZodObject<{
    studentId: z.ZodString;
    counseledAt: z.ZodString;
    category: z.ZodEnum<{
        ACADEMIC: "ACADEMIC";
        LIFE: "LIFE";
        PEER: "PEER";
        CAREER: "CAREER";
        FAMILY: "FAMILY";
        ETC: "ETC";
    }>;
    method: z.ZodEnum<{
        IN_PERSON: "IN_PERSON";
        PHONE: "PHONE";
        TEXT: "TEXT";
        VIDEO: "VIDEO";
    }>;
    scope: z.ZodEnum<{
        STUDENT: "STUDENT";
        PARENT: "PARENT";
        BOTH: "BOTH";
    }>;
    topic: z.ZodString;
    content: z.ZodString;
    action: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    followUpAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    followUpDone: z.ZodOptional<z.ZodBoolean>;
    followUpNote: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
declare const updateCounselingSchema: z.ZodObject<{
    studentId: z.ZodOptional<z.ZodString>;
    counseledAt: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<{
        ACADEMIC: "ACADEMIC";
        LIFE: "LIFE";
        PEER: "PEER";
        CAREER: "CAREER";
        FAMILY: "FAMILY";
        ETC: "ETC";
    }>>;
    method: z.ZodOptional<z.ZodEnum<{
        IN_PERSON: "IN_PERSON";
        PHONE: "PHONE";
        TEXT: "TEXT";
        VIDEO: "VIDEO";
    }>>;
    scope: z.ZodOptional<z.ZodEnum<{
        STUDENT: "STUDENT";
        PARENT: "PARENT";
        BOTH: "BOTH";
    }>>;
    topic: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    followUpAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    followUpDone: z.ZodOptional<z.ZodBoolean>;
    followUpNote: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
declare const listQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    studentId: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<{
        ACADEMIC: "ACADEMIC";
        LIFE: "LIFE";
        PEER: "PEER";
        CAREER: "CAREER";
        FAMILY: "FAMILY";
        ETC: "ETC";
    }>>;
    method: z.ZodOptional<z.ZodEnum<{
        IN_PERSON: "IN_PERSON";
        PHONE: "PHONE";
        TEXT: "TEXT";
        VIDEO: "VIDEO";
    }>>;
    authorId: z.ZodOptional<z.ZodString>;
    followUp: z.ZodOptional<z.ZodEnum<{
        due: "due";
        done: "done";
        none: "none";
    }>>;
    sort: z.ZodDefault<z.ZodEnum<{
        counseledAt: "counseledAt";
        createdAt: "createdAt";
    }>>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
type CreateCounselingInput = z.infer<typeof createCounselingSchema>;
type UpdateCounselingInput = z.infer<typeof updateCounselingSchema>;
type ListCounselingQuery = z.infer<typeof listQuerySchema>;

/**
 * Resolve the counseling viewer's identity + permissions.
 *
 * Note: this query intentionally looks only at userRoles (NOT userGroups),
 * matching the host's pre-S6.0 behavior verbatim. Group-based permissions
 * are not consulted for the counseling-view scope. If you need full 4-tier
 * permission resolution, use `permissionsOf` from '@/rbac' instead.
 *
 * Returns null when the user does not exist OR has no Staff record attached
 * (signed-in but not a registered staff member).
 */
declare function getCounselingViewer(prisma: any, userId: string): Promise<CounselingViewer | null>;

export { type CounselingDraft, type CounselingRecord, type CounselingViewer, type CreateCounselingInput, type ListCounselingQuery, type UpdateCounselingInput, canCreate, canRead, canUpdate, counselingCategoryEnum, counselingMethodEnum, counselingScopeEnum, createCounselingSchema, flattenForPolicy, flattenStudentForPolicy, getCounselingViewer, listQuerySchema, scopeWhere, updateCounselingSchema };
