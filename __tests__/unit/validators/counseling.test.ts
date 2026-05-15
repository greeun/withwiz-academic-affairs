import { describe, it, expect } from 'vitest';
import {
  createCounselingSchema,
  updateCounselingSchema,
  counselingTypeEnum,
  counselingStatusEnum,
} from '@/validators/counseling.validator';

describe('createCounselingSchema', () => {
  it('accepts valid counseling data', () => {
    const data = {
      type: 'INITIAL',
      date: '2024-03-04',
      title: '초기 상담',
      content: '상담 내용입니다.',
    };
    const result = createCounselingSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('requires title', () => {
    const result = createCounselingSchema.safeParse({
      type: 'INITIAL',
      date: '2024-03-04',
      content: '내용',
    });
    expect(result.success).toBe(false);
  });

  it('requires content', () => {
    const result = createCounselingSchema.safeParse({
      type: 'INITIAL',
      date: '2024-03-04',
      title: '제목',
    });
    expect(result.success).toBe(false);
  });

  it('requires type', () => {
    const result = createCounselingSchema.safeParse({
      date: '2024-03-04',
      title: '제목',
      content: '내용',
    });
    expect(result.success).toBe(false);
  });

  it('validates CounselingType enum', () => {
    const validTypes = ['INITIAL', 'REGULAR', 'EMERGENCY', 'PARENT', 'ADMISSION'];
    for (const type of validTypes) {
      const result = counselingTypeEnum.safeParse(type);
      expect(result.success).toBe(true);
    }
  });

  it('validates CounselingStatus enum', () => {
    const validStatuses = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    for (const status of validStatuses) {
      const result = counselingStatusEnum.safeParse(status);
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid type', () => {
    const result = createCounselingSchema.safeParse({
      type: 'INVALID',
      date: '2024-03-04',
      title: '제목',
      content: '내용',
    });
    expect(result.success).toBe(false);
  });

  it('defaults status to SCHEDULED', () => {
    const result = createCounselingSchema.parse({
      type: 'INITIAL',
      date: '2024-03-04',
      title: '제목',
      content: '내용',
    });
    expect(result.status).toBe('SCHEDULED');
  });
});

describe('updateCounselingSchema', () => {
  it('accepts partial data', () => {
    const result = updateCounselingSchema.safeParse({ title: '수정된 제목' });
    expect(result.success).toBe(true);
  });

  it('accepts empty object', () => {
    const result = updateCounselingSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('still validates type enum', () => {
    const result = updateCounselingSchema.safeParse({ type: 'INVALID' });
    expect(result.success).toBe(false);
  });

  it('still validates status enum', () => {
    const result = updateCounselingSchema.safeParse({ status: 'INVALID' });
    expect(result.success).toBe(false);
  });
});
