import { describe, it, expect } from 'vitest';
import { createStudentSchema, updateStudentSchema, studentStatusEnum } from '@/validators/student.validator';

describe('createStudentSchema', () => {
  it('accepts valid student data', () => {
    const data = {
      name: '김학생',
      grade: 1,
      classGroup: 'A반',
      phone: '010-1234-5678',
      parentName: '김부모',
      parentPhone: '010-9876-5432',
    };
    const result = createStudentSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('requires name', () => {
    const result = createStudentSchema.safeParse({ grade: 1 });
    expect(result.success).toBe(false);
  });

  it('requires grade', () => {
    const result = createStudentSchema.safeParse({ name: '김학생' });
    expect(result.success).toBe(false);
  });

  it('defaults status to ACTIVE', () => {
    const result = createStudentSchema.parse({ name: '김학생', grade: 1 });
    expect(result.status).toBe('ACTIVE');
  });

  it('validates StudentStatus enum', () => {
    const validStatuses = ['ACTIVE', 'ON_LEAVE', 'GRADUATED', 'WITHDRAWN'];
    for (const status of validStatuses) {
      const result = studentStatusEnum.safeParse(status);
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid status', () => {
    const result = createStudentSchema.safeParse({
      name: '김학생',
      grade: 1,
      status: 'INVALID',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateStudentSchema', () => {
  it('accepts partial data', () => {
    const result = updateStudentSchema.safeParse({ name: '이학생' });
    expect(result.success).toBe(true);
  });

  it('accepts empty object', () => {
    const result = updateStudentSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('still validates status enum', () => {
    const result = updateStudentSchema.safeParse({ status: 'INVALID' });
    expect(result.success).toBe(false);
  });
});
