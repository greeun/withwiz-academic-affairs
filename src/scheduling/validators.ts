import { z } from "zod";

const dayOfWeekEnum = z.enum(["MON", "TUE", "WED", "THU", "FRI"]);

const cellSchema = z.object({
  dayOfWeek: dayOfWeekEnum,
  content: z.string(),
});

const timeSlotSchema = z.object({
  time: z.string().min(1, "시간을 입력해주세요."),
  sortOrder: z.number().int().min(0),
  cells: z.array(cellSchema).min(1, "최소 1개 요일의 수업 내용이 필요합니다."),
});

export const scheduleCreateSchema = z.object({
  schoolLevel: z.enum(["ELEMENTARY", "MIDDLE", "HIGH"]),
  semester: z.number().int().min(1).max(2),
  year: z.number().int().min(2020).max(2100),
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().nullish(),
  timeSlots: z.array(timeSlotSchema).min(1, "최소 1개 시간대가 필요합니다."),
});

export const scheduleUpdateSchema = scheduleCreateSchema;

export type ScheduleCreateInput = z.infer<typeof scheduleCreateSchema>;
export type ScheduleUpdateInput = z.infer<typeof scheduleUpdateSchema>;
