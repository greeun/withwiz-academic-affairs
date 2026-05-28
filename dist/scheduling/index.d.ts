import { z } from 'zod';

declare const academicScheduleSchema: z.ZodObject<{
    academicYear: z.ZodNumber;
    semester: z.ZodEnum<{
        FIRST: "FIRST";
        SECOND: "SECOND";
    }>;
    title: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    scheduleType: z.ZodEnum<{
        HOLIDAY: "HOLIDAY";
        EVENT: "EVENT";
        EXAM: "EXAM";
        VACATION: "VACATION";
        FIELD_TRIP: "FIELD_TRIP";
        OTHER: "OTHER";
    }>;
    isHighlight: z.ZodDefault<z.ZodBoolean>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    schoolLevel: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        ELEMENTARY: "ELEMENTARY";
        MIDDLE: "MIDDLE";
        HIGH: "HIGH";
    }>, z.ZodLiteral<"">, z.ZodNull]>>, z.ZodTransform<"ELEMENTARY" | "MIDDLE" | "HIGH" | null, "" | "ELEMENTARY" | "MIDDLE" | "HIGH" | null | undefined>>;
}, z.core.$strip>;
declare const SCHOOL_LEVEL_LABELS: Record<string, string>;
type AcademicScheduleInput = z.infer<typeof academicScheduleSchema>;
declare const SEMESTER_LABELS: Record<string, string>;
declare const SCHEDULE_TYPE_LABELS: Record<string, string>;
declare const SCHEDULE_TYPE_COLORS: Record<string, {
    bg: string;
    text: string;
}>;
declare function formatScheduleDate(startDate: Date, endDate: Date | null): string;

declare const scheduleCreateSchema: z.ZodObject<{
    schoolLevel: z.ZodEnum<{
        ELEMENTARY: "ELEMENTARY";
        MIDDLE: "MIDDLE";
        HIGH: "HIGH";
    }>;
    semester: z.ZodNumber;
    year: z.ZodNumber;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    timeSlots: z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        sortOrder: z.ZodNumber;
        cells: z.ZodArray<z.ZodObject<{
            dayOfWeek: z.ZodEnum<{
                MON: "MON";
                TUE: "TUE";
                WED: "WED";
                THU: "THU";
                FRI: "FRI";
            }>;
            content: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const scheduleUpdateSchema: z.ZodObject<{
    schoolLevel: z.ZodEnum<{
        ELEMENTARY: "ELEMENTARY";
        MIDDLE: "MIDDLE";
        HIGH: "HIGH";
    }>;
    semester: z.ZodNumber;
    year: z.ZodNumber;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    timeSlots: z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        sortOrder: z.ZodNumber;
        cells: z.ZodArray<z.ZodObject<{
            dayOfWeek: z.ZodEnum<{
                MON: "MON";
                TUE: "TUE";
                WED: "WED";
                THU: "THU";
                FRI: "FRI";
            }>;
            content: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ScheduleCreateInput = z.infer<typeof scheduleCreateSchema>;
type ScheduleUpdateInput = z.infer<typeof scheduleUpdateSchema>;

type SchoolLevel = any;
interface ParsedSubject {
    name: string;
    levels: SchoolLevel[];
}
/**
 * 자유 문자열 과목 필드를 분해해 (과목명, 학년단 배열) 후보 리스트로 반환한다.
 *
 * @param raw      Staff.subject 와 같은 자유 텍스트. null/undefined/공란 허용.
 * @param position Staff.position 같은 보조 문자열 — raw 에 괄호 학년단이 없을 때 추론에 사용.
 * @returns         과목 후보 배열. trim, 빈 토큰 제거. 빈 입력은 빈 배열.
 */
declare function parseSubjectField(raw: string | null | undefined, position?: string | null): ParsedSubject[];

export { type AcademicScheduleInput, type ParsedSubject, SCHEDULE_TYPE_COLORS, SCHEDULE_TYPE_LABELS, SCHOOL_LEVEL_LABELS, SEMESTER_LABELS, type ScheduleCreateInput, type ScheduleUpdateInput, academicScheduleSchema, formatScheduleDate, parseSubjectField, scheduleCreateSchema, scheduleUpdateSchema };
