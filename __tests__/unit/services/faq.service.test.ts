import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FaqService } from '@/services/faq.service';

function createMockPrisma() {
  return {
    faq: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    faqCategory: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn((fn: (tx: unknown) => unknown) => fn({
      faq: { update: vi.fn() },
      faqCategory: { update: vi.fn() },
    })),
  };
}

describe('FaqService', () => {
  let service: FaqService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new FaqService(mockPrisma as never);
  });

  describe('list', () => {
    it('returns paginated results', async () => {
      const items = [{ id: '1', question: 'Q1', answer: 'A1' }];
      mockPrisma.faq.findMany.mockResolvedValue(items);
      mockPrisma.faq.count.mockResolvedValue(1);

      const result = await service.list({ page: 1, limit: 10 });

      expect(result.items).toEqual(items);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
    });

    it('filters by categoryId when provided', async () => {
      mockPrisma.faq.findMany.mockResolvedValue([]);
      mockPrisma.faq.count.mockResolvedValue(0);

      await service.list({ page: 1, limit: 10, categoryId: 'cat-1' });

      const call = mockPrisma.faq.findMany.mock.calls[0][0];
      expect(call.where.categoryId).toBe('cat-1');
    });
  });

  describe('getById', () => {
    it('calls findUnique with id and includes category', async () => {
      const item = { id: '1', question: 'Q1' };
      mockPrisma.faq.findUnique.mockResolvedValue(item);

      const result = await service.getById('1');

      expect(result).toEqual(item);
      expect(mockPrisma.faq.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { category: true },
      });
    });
  });

  describe('create', () => {
    it('creates FAQ with provided data', async () => {
      const input = { question: 'Q', answer: 'A' };
      const created = { id: '1', ...input };
      mockPrisma.faq.create.mockResolvedValue(created);

      const result = await service.create(input);

      expect(result).toEqual(created);
      expect(mockPrisma.faq.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('update', () => {
    it('updates FAQ by id', async () => {
      const updated = { id: '1', question: 'Updated Q' };
      mockPrisma.faq.update.mockResolvedValue(updated);

      const result = await service.update('1', { question: 'Updated Q' });

      expect(result).toEqual(updated);
      expect(mockPrisma.faq.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { question: 'Updated Q' },
      });
    });
  });

  describe('delete', () => {
    it('deletes FAQ by id', async () => {
      mockPrisma.faq.delete.mockResolvedValue({});
      await service.delete('1');
      expect(mockPrisma.faq.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('reorder', () => {
    it('uses $transaction to reorder FAQs', async () => {
      const txUpdate = vi.fn();
      mockPrisma.$transaction.mockImplementation((fn: (tx: { faq: { update: typeof txUpdate } }) => unknown) =>
        fn({ faq: { update: txUpdate } })
      );

      await service.reorder(['c', 'a', 'b']);

      expect(mockPrisma.$transaction).toHaveBeenCalledOnce();
      expect(txUpdate).toHaveBeenCalledTimes(3);
      expect(txUpdate).toHaveBeenCalledWith({ where: { id: 'c' }, data: { order: 0 } });
      expect(txUpdate).toHaveBeenCalledWith({ where: { id: 'a' }, data: { order: 1 } });
      expect(txUpdate).toHaveBeenCalledWith({ where: { id: 'b' }, data: { order: 2 } });
    });
  });

  describe('listCategories', () => {
    it('returns categories ordered by order', async () => {
      const categories = [{ id: '1', name: '입학', order: 0 }];
      mockPrisma.faqCategory.findMany.mockResolvedValue(categories);

      const result = await service.listCategories();

      expect(result).toEqual(categories);
      expect(mockPrisma.faqCategory.findMany).toHaveBeenCalledWith({
        orderBy: { order: 'asc' },
        include: { faqs: true },
      });
    });
  });

  describe('createCategory', () => {
    it('creates category', async () => {
      const input = { name: '입학' };
      const created = { id: '1', ...input, order: 0 };
      mockPrisma.faqCategory.create.mockResolvedValue(created);

      const result = await service.createCategory(input);

      expect(result).toEqual(created);
      expect(mockPrisma.faqCategory.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('updateCategory', () => {
    it('updates category by id', async () => {
      const updated = { id: '1', name: '교육과정' };
      mockPrisma.faqCategory.update.mockResolvedValue(updated);

      const result = await service.updateCategory('1', { name: '교육과정' });

      expect(result).toEqual(updated);
    });
  });

  describe('deleteCategory', () => {
    it('deletes category by id', async () => {
      mockPrisma.faqCategory.delete.mockResolvedValue({});
      await service.deleteCategory('1');
      expect(mockPrisma.faqCategory.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('reorderCategories', () => {
    it('uses $transaction to reorder categories', async () => {
      const txUpdate = vi.fn();
      mockPrisma.$transaction.mockImplementation((fn: (tx: { faqCategory: { update: typeof txUpdate } }) => unknown) =>
        fn({ faqCategory: { update: txUpdate } })
      );

      await service.reorderCategories(['b', 'a']);

      expect(mockPrisma.$transaction).toHaveBeenCalledOnce();
      expect(txUpdate).toHaveBeenCalledTimes(2);
      expect(txUpdate).toHaveBeenCalledWith({ where: { id: 'b' }, data: { order: 0 } });
      expect(txUpdate).toHaveBeenCalledWith({ where: { id: 'a' }, data: { order: 1 } });
    });
  });

  describe('getStats', () => {
    it('returns total count and breakdown by category', async () => {
      mockPrisma.faq.count.mockResolvedValue(5);
      mockPrisma.faq.groupBy.mockResolvedValue([
        { categoryId: 'cat-1', _count: { id: 3 } },
        { categoryId: null, _count: { id: 2 } },
      ]);

      const stats = await service.getStats();

      expect(stats.total).toBe(5);
      expect(stats.byCategory).toEqual({ 'cat-1': 3, 'uncategorized': 2 });
    });
  });
});
