import { describe, it, expect } from 'vitest';
import { createStaffSchema, updateStaffSchema } from '@/validators/staff.validator';

describe('createStaffSchema', () => {
  it('accepts valid staff data', () => {
    const data = {
      name: '김예룸',
      role: '교사',
      department: '미술',
      phone: '010-1234-5678',
      email: 'kim@yeroom.kr',
      bio: '미술 전공 교사입니다.',
      sortOrder: 1,
      isPublished: true,
    };

    const result = createStaffSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('requires name', () => {
    const result = createStaffSchema.safeParse({ role: '교사' });
    expect(result.success).toBe(false);
  });

  it('requires role', () => {
    const result = createStaffSchema.safeParse({ name: '김예룸' });
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const result = createStaffSchema.safeParse({ name: '', role: '교사' });
    expect(result.success).toBe(false);
  });

  it('allows minimal data (name + role only)', () => {
    const result = createStaffSchema.safeParse({ name: '김예룸', role: '교사' });
    expect(result.success).toBe(true);
  });

  it('validates email format when provided', () => {
    const result = createStaffSchema.safeParse({
      name: '김예룸',
      role: '교사',
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('defaults sortOrder to 0', () => {
    const result = createStaffSchema.parse({ name: '김예룸', role: '교사' });
    expect(result.sortOrder).toBe(0);
  });

  it('defaults isPublished to true', () => {
    const result = createStaffSchema.parse({ name: '김예룸', role: '교사' });
    expect(result.isPublished).toBe(true);
  });
});

describe('updateStaffSchema', () => {
  it('accepts partial data', () => {
    const result = updateStaffSchema.safeParse({ name: '이예룸' });
    expect(result.success).toBe(true);
  });

  it('accepts empty object', () => {
    const result = updateStaffSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('still validates email format', () => {
    const result = updateStaffSchema.safeParse({ email: 'bad' });
    expect(result.success).toBe(false);
  });
});
