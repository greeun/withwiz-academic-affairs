import { describe, it, expect } from 'vitest';
import {
  createFaqSchema,
  updateFaqSchema,
  createFaqCategorySchema,
  updateFaqCategorySchema,
} from '@/validators/faq.validator';

describe('createFaqSchema', () => {
  it('accepts valid FAQ data', () => {
    const data = {
      question: '입학 절차는 어떻게 되나요?',
      answer: '홈페이지에서 원서를 제출하시면 됩니다.',
    };
    const result = createFaqSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('requires question', () => {
    const result = createFaqSchema.safeParse({ answer: '답변입니다.' });
    expect(result.success).toBe(false);
  });

  it('requires answer', () => {
    const result = createFaqSchema.safeParse({ question: '질문입니다' });
    expect(result.success).toBe(false);
  });

  it('defaults order to 0', () => {
    const result = createFaqSchema.parse({ question: '질문', answer: '답변' });
    expect(result.order).toBe(0);
  });

  it('defaults isPublished to true', () => {
    const result = createFaqSchema.parse({ question: '질문', answer: '답변' });
    expect(result.isPublished).toBe(true);
  });
});

describe('updateFaqSchema', () => {
  it('accepts partial data', () => {
    const result = updateFaqSchema.safeParse({ question: '수정된 질문' });
    expect(result.success).toBe(true);
  });

  it('accepts empty object', () => {
    const result = updateFaqSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('createFaqCategorySchema', () => {
  it('accepts valid category data', () => {
    const result = createFaqCategorySchema.safeParse({ name: '입학' });
    expect(result.success).toBe(true);
  });

  it('requires name', () => {
    const result = createFaqCategorySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('defaults order to 0', () => {
    const result = createFaqCategorySchema.parse({ name: '입학' });
    expect(result.order).toBe(0);
  });
});

describe('updateFaqCategorySchema', () => {
  it('accepts partial data', () => {
    const result = updateFaqCategorySchema.safeParse({ name: '수정된 카테고리' });
    expect(result.success).toBe(true);
  });
});
