import { z } from "zod";

export const academicScheduleSchema = z.object({
  academicYear: z.number().int().min(2020).max(2100),
  semester: z.enum(["FIRST", "SECOND"]),
  title: z.string().min(1, "일정명을 입력해주세요").max(100),
  startDate: z.string().min(1, "시작일을 입력해주세요"),
  endDate: z.string().optional().default(""),
  scheduleType: z.enum([
    "HOLIDAY",
    "EVENT",
    "EXAM",
    "VACATION",
    "FIELD_TRIP",
    "OTHER",
  ]),
  isHighlight: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  schoolLevel: z
    .union([z.enum(["ELEMENTARY", "MIDDLE", "HIGH"]), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
});

export const SCHOOL_LEVEL_LABELS: Record<string, string> = {
  ELEMENTARY: "초등",
  MIDDLE: "중등",
  HIGH: "고등",
};

export type AcademicScheduleInput = z.infer<typeof academicScheduleSchema>;

export const SEMESTER_LABELS: Record<string, string> = {
  FIRST: "1학기",
  SECOND: "2학기",
};

export const SCHEDULE_TYPE_LABELS: Record<string, string> = {
  HOLIDAY: "공휴일",
  EVENT: "행사",
  EXAM: "시험",
  VACATION: "방학",
  FIELD_TRIP: "체험학습",
  OTHER: "기타",
};

export const SCHEDULE_TYPE_COLORS: Record<
  string,
  { bg: string; text: string }
> = {
  HOLIDAY: { bg: "#FEE2E2", text: "#DC2626" },
  EVENT: { bg: "#DBEAFE", text: "#2563EB" },
  EXAM: { bg: "#FEF3C7", text: "#D97706" },
  VACATION: { bg: "#D1FAE5", text: "#059669" },
  FIELD_TRIP: { bg: "#E0E7FF", text: "#4F46E5" },
  OTHER: { bg: "#F3F4F6", text: "#6B7280" },
};

export function formatScheduleDate(
  startDate: Date,
  endDate: Date | null,
): string {
  const fmt = (d: Date) => {
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${m}월 ${day}일`;
  };
  if (!endDate) return fmt(startDate);
  return `${fmt(startDate)}~${fmt(endDate)}`;
}
