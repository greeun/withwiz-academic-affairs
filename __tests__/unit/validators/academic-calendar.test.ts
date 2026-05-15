import { describe, it, expect } from 'vitest';
import {
  createTimetableSchema,
  updateTimetableSchema,
  createAcademicEventSchema,
  updateAcademicEventSchema,
  academicEventTypeEnum,
} from '@/validators/academic-calendar.validator';

describe('createTimetableSchema', () => {
  it('accepts valid timetable data', () => {
    const data = {
      title: '2024학년도 1학기 시간표',
      year: 2024,
      semester: 1,
      schoolLevel: '중등',
    };
    const result = createTimetableSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('requires title', () => {
    const result = createTimetableSchema.safeParse({ year: 2024, semester: 1, schoolLevel: '중등' });
    expect(result.success).toBe(false);
  });

  it('requires year', () => {
    const result = createTimetableSchema.safeParse({ title: '시간표', semester: 1, schoolLevel: '중등' });
    expect(result.success).toBe(false);
  });

  it('defaults isActive to true', () => {
    const result = createTimetableSchema.parse({ title: '시간표', year: 2024, semester: 1, schoolLevel: '중등' });
    expect(result.isActive).toBe(true);
  });
});

describe('updateTimetableSchema', () => {
  it('accepts partial data', () => {
    const result = updateTimetableSchema.safeParse({ title: '수정된 시간표' });
    expect(result.success).toBe(true);
  });

  it('accepts empty object', () => {
    const result = updateTimetableSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('createAcademicEventSchema', () => {
  it('accepts valid event data', () => {
    const data = {
      title: '1학기 개학',
      startDate: '2024-03-04',
      type: 'SEMESTER_START',
    };
    const result = createAcademicEventSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('requires title', () => {
    const result = createAcademicEventSchema.safeParse({
      startDate: '2024-03-04',
      type: 'SEMESTER_START',
    });
    expect(result.success).toBe(false);
  });

  it('validates AcademicEventType enum', () => {
    const result = createAcademicEventSchema.safeParse({
      title: '이벤트',
      startDate: '2024-03-04',
      type: 'INVALID_TYPE',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid AcademicEventType values', () => {
    const validTypes = [
      'SEMESTER_START', 'SEMESTER_END', 'EXAM', 'VACATION',
      'HOLIDAY', 'EVENT', 'FIELD_TRIP', 'PARENT_MEETING', 'OTHER',
    ];
    for (const type of validTypes) {
      const result = academicEventTypeEnum.safeParse(type);
      expect(result.success).toBe(true);
    }
  });

  it('defaults isAllDay to true', () => {
    const result = createAcademicEventSchema.parse({
      title: '개학',
      startDate: '2024-03-04',
      type: 'SEMESTER_START',
    });
    expect(result.isAllDay).toBe(true);
  });

  it('defaults isPublished to true', () => {
    const result = createAcademicEventSchema.parse({
      title: '개학',
      startDate: '2024-03-04',
      type: 'SEMESTER_START',
    });
    expect(result.isPublished).toBe(true);
  });
});

describe('updateAcademicEventSchema', () => {
  it('accepts partial data', () => {
    const result = updateAcademicEventSchema.safeParse({ title: '수정된 이벤트' });
    expect(result.success).toBe(true);
  });

  it('still validates enum when provided', () => {
    const result = updateAcademicEventSchema.safeParse({ type: 'INVALID' });
    expect(result.success).toBe(false);
  });
});
