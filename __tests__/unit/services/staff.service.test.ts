import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StaffService } from '@/services/staff.service';

function createMockPrisma() {
  return {
    staff: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn((fn: (tx: unknown) => unknown) => fn({
      staff: {
        update: vi.fn(),
      },
    })),
  };
}

describe('StaffService', () => {
  let service: StaffService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new StaffService(mockPrisma as never);
  });

  describe('list', () => {
    it('returns paginated results', async () => {
      const items = [
        { id: '1', name: '김교사', role: '교사', sortOrder: 0 },
        { id: '2', name: '이교사', role: '교사', sortOrder: 1 },
      ];
      mockPrisma.staff.findMany.mockResolvedValue(items);
      mockPrisma.staff.count.mockResolvedValue(2);

      const result = await service.list({ page: 1, limit: 10 });

      expect(result.items).toEqual(items);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(mockPrisma.staff.findMany).toHaveBeenCalledOnce();
    });

    it('filters by role when provided', async () => {
      mockPrisma.staff.findMany.mockResolvedValue([]);
      mockPrisma.staff.count.mockResolvedValue(0);

      await service.list({ page: 1, limit: 10, role: '교사' });

      const findManyCall = mockPrisma.staff.findMany.mock.calls[0][0];
      expect(findManyCall.where.role).toBe('교사');
    });
  });

  describe('getById', () => {
    it('returns staff by id', async () => {
      const staff = { id: '1', name: '김교사', role: '교사' };
      mockPrisma.staff.findUnique.mockResolvedValue(staff);

      const result = await service.getById('1');

      expect(result).toEqual(staff);
      expect(mockPrisma.staff.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('returns null for non-existent id', async () => {
      mockPrisma.staff.findUnique.mockResolvedValue(null);

      const result = await service.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('creates staff with provided data', async () => {
      const input = { name: '박교사', role: '상담사' };
      const created = { id: '3', ...input, sortOrder: 0, isPublished: true };
      mockPrisma.staff.create.mockResolvedValue(created);

      const result = await service.create(input);

      expect(result).toEqual(created);
      expect(mockPrisma.staff.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('update', () => {
    it('updates staff by id', async () => {
      const updated = { id: '1', name: '김수정', role: '교사' };
      mockPrisma.staff.update.mockResolvedValue(updated);

      const result = await service.update('1', { name: '김수정' });

      expect(result).toEqual(updated);
      expect(mockPrisma.staff.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: '김수정' },
      });
    });
  });

  describe('delete', () => {
    it('deletes staff by id', async () => {
      mockPrisma.staff.delete.mockResolvedValue({});

      await service.delete('1');

      expect(mockPrisma.staff.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('getStats', () => {
    it('returns total count and breakdown by role', async () => {
      mockPrisma.staff.count.mockResolvedValue(5);
      mockPrisma.staff.groupBy.mockResolvedValue([
        { role: '교사', _count: { id: 3 } },
        { role: '상담사', _count: { id: 2 } },
      ]);

      const stats = await service.getStats();

      expect(stats.total).toBe(5);
      expect(stats.byRole).toEqual({ '교사': 3, '상담사': 2 });
    });
  });

  describe('reorder', () => {
    it('updates sortOrder for each id in order', async () => {
      const txUpdate = vi.fn();
      mockPrisma.$transaction.mockImplementation((fn: (tx: { staff: { update: typeof txUpdate } }) => unknown) =>
        fn({ staff: { update: txUpdate } })
      );

      await service.reorder(['c', 'a', 'b']);

      expect(txUpdate).toHaveBeenCalledTimes(3);
      expect(txUpdate).toHaveBeenCalledWith({ where: { id: 'c' }, data: { sortOrder: 0 } });
      expect(txUpdate).toHaveBeenCalledWith({ where: { id: 'a' }, data: { sortOrder: 1 } });
      expect(txUpdate).toHaveBeenCalledWith({ where: { id: 'b' }, data: { sortOrder: 2 } });
    });
  });
});
