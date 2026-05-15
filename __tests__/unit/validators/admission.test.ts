import { describe, it, expect } from 'vitest';
import {
  createAdmissionSessionSchema,
  updateAdmissionSessionSchema,
  createAdmissionRegistrationSchema,
  updateAdmissionRegistrationSchema,
  registrationStatusEnum,
} from '@/validators/admission.validator';

describe('createAdmissionSessionSchema', () => {
  it('accepts valid session data', () => {
    const data = {
      title: '2024학년도 입학 설명회',
      date: '2024-01-15',
    };
    const result = createAdmissionSessionSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('requires title', () => {
    const result = createAdmissionSessionSchema.safeParse({ date: '2024-01-15' });
    expect(result.success).toBe(false);
  });

  it('requires date', () => {
    const result = createAdmissionSessionSchema.safeParse({ title: '설명회' });
    expect(result.success).toBe(false);
  });

  it('defaults capacity to 30', () => {
    const result = createAdmissionSessionSchema.parse({
      title: '설명회',
      date: '2024-01-15',
    });
    expect(result.capacity).toBe(30);
  });

  it('defaults isOpen to true', () => {
    const result = createAdmissionSessionSchema.parse({
      title: '설명회',
      date: '2024-01-15',
    });
    expect(result.isOpen).toBe(true);
  });
});

describe('updateAdmissionSessionSchema', () => {
  it('accepts partial data', () => {
    const result = updateAdmissionSessionSchema.safeParse({ title: '수정된 설명회' });
    expect(result.success).toBe(true);
  });

  it('accepts empty object', () => {
    const result = updateAdmissionSessionSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('createAdmissionRegistrationSchema', () => {
  it('accepts valid registration data', () => {
    const data = {
      sessionId: 'session-1',
      applicantName: '김부모',
      phone: '010-1234-5678',
      studentName: '김학생',
    };
    const result = createAdmissionRegistrationSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('requires applicantName', () => {
    const result = createAdmissionRegistrationSchema.safeParse({
      sessionId: 'session-1',
      phone: '010-1234-5678',
      studentName: '김학생',
    });
    expect(result.success).toBe(false);
  });

  it('validates email format when provided', () => {
    const result = createAdmissionRegistrationSchema.safeParse({
      sessionId: 'session-1',
      applicantName: '김부모',
      phone: '010-1234-5678',
      studentName: '김학생',
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('validates RegistrationStatus enum', () => {
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'ATTENDED'];
    for (const status of validStatuses) {
      const result = registrationStatusEnum.safeParse(status);
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid status', () => {
    const result = createAdmissionRegistrationSchema.safeParse({
      sessionId: 'session-1',
      applicantName: '김부모',
      phone: '010-1234-5678',
      studentName: '김학생',
      status: 'INVALID',
    });
    expect(result.success).toBe(false);
  });

  it('defaults status to PENDING', () => {
    const result = createAdmissionRegistrationSchema.parse({
      sessionId: 'session-1',
      applicantName: '김부모',
      phone: '010-1234-5678',
      studentName: '김학생',
    });
    expect(result.status).toBe('PENDING');
  });
});

describe('updateAdmissionRegistrationSchema', () => {
  it('accepts partial data', () => {
    const result = updateAdmissionRegistrationSchema.safeParse({ status: 'CONFIRMED' });
    expect(result.success).toBe(true);
  });
});
