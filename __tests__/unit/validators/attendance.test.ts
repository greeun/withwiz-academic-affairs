import { describe, it, expect } from 'vitest';
import { createAttendanceSchema, updateAttendanceSchema, attendanceStatusEnum } from '@/validators/attendance.validator';

describe('createAttendanceSchema', () => {
  it('accepts valid attendance data', () => {
    const data = {
      studentId: 'student-1',
      date: '2024-03-04',
      status: 'PRESENT',
    };
    const result = createAttendanceSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('requires studentId', () => {
    const result = createAttendanceSchema.safeParse({
      date: '2024-03-04',
      status: 'PRESENT',
    });
    expect(result.success).toBe(false);
  });

  it('requires date', () => {
    const result = createAttendanceSchema.safeParse({
      studentId: 'student-1',
      status: 'PRESENT',
    });
    expect(result.success).toBe(false);
  });

  it('requires status', () => {
    const result = createAttendanceSchema.safeParse({
      studentId: 'student-1',
      date: '2024-03-04',
    });
    expect(result.success).toBe(false);
  });

  it('validates AttendanceStatus enum', () => {
    const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'EARLY_LEAVE', 'EXCUSED'];
    for (const status of validStatuses) {
      const result = attendanceStatusEnum.safeParse(status);
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid status', () => {
    const result = createAttendanceSchema.safeParse({
      studentId: 'student-1',
      date: '2024-03-04',
      status: 'INVALID',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateAttendanceSchema', () => {
  it('accepts partial data', () => {
    const result = updateAttendanceSchema.safeParse({ status: 'ABSENT' });
    expect(result.success).toBe(true);
  });

  it('accepts empty object', () => {
    const result = updateAttendanceSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('still validates status enum', () => {
    const result = updateAttendanceSchema.safeParse({ status: 'INVALID' });
    expect(result.success).toBe(false);
  });
});
