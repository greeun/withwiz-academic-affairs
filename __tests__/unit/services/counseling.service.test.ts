import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CounselingService } from '@/services/counseling.service';

function createMockPrisma() {
  return {
    counseling: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  };
}

describe('CounselingService', () => {
  let service: CounselingService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new CounselingService(mockPrisma as never);
  });

  describe('list', () => {
    it('returns paginated results', async () => {
      const items = [{ id: '1', title: '초기 상담', type: 'INITIAL' }];
      mockPrisma.counseling.findMany.mockResolvedValue(items);
      mockPrisma.counseling.count.mockResolvedValue(1);

      const result = await service.list({ page: 1, limit: 10 });

      expect(result.items).toEqual(items);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
    });

    it('filters by studentId when provided', async () => {
      mockPrisma.counseling.findMany.mockResolvedValue([]);
      mockPrisma.counseling.count.mockResolvedValue(0);

      await service.list({ page: 1, limit: 10, studentId: 's1' });

      const call = mockPrisma.counseling.findMany.mock.calls[0][0];
      expect(call.where.studentId).toBe('s1');
    });

    it('filters by type when provided', async () => {
      mockPrisma.counseling.findMany.mockResolvedValue([]);
      mockPrisma.counseling.count.mockResolvedValue(0);

      await service.list({ page: 1, limit: 10, type: 'INITIAL' });

      const call = mockPrisma.counseling.findMany.mock.calls[0][0];
      expect(call.where.type).toBe('INITIAL');
    });
  });

  describe('getById', () => {
    it('calls findUnique with id and includes student', async () => {
      const item = { id: '1', title: '상담' };
      mockPrisma.counseling.findUnique.mockResolvedValue(item);

      const result = await service.getById('1');

      expect(result).toEqual(item);
      expect(mockPrisma.counseling.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { student: { select: { id: true, name: true, grade: true, classGroup: true, status: true } } },
      });
    });
  });

  describe('create', () => {
    it('creates counseling with provided data', async () => {
      const input = { title: '상담', type: 'INITIAL', content: '내용', date: new Date() };
      const created = { id: '1', ...input };
      mockPrisma.counseling.create.mockResolvedValue(created);

      const result = await service.create(input);

      expect(result).toEqual(created);
      expect(mockPrisma.counseling.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('update', () => {
    it('updates counseling by id', async () => {
      const updated = { id: '1', title: '수정된 상담' };
      mockPrisma.counseling.update.mockResolvedValue(updated);

      const result = await service.update('1', { title: '수정된 상담' });

      expect(result).toEqual(updated);
      expect(mockPrisma.counseling.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: '수정된 상담' },
      });
    });
  });

  describe('delete', () => {
    it('deletes counseling by id', async () => {
      mockPrisma.counseling.delete.mockResolvedValue({});
      await service.delete('1');
      expect(mockPrisma.counseling.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('getUpcoming', () => {
    it('filters by status=SCHEDULED and date >= now', async () => {
      const upcoming = [{ id: '1', title: '다음 상담', status: 'SCHEDULED' }];
      mockPrisma.counseling.findMany.mockResolvedValue(upcoming);

      const result = await service.getUpcoming();

      expect(result).toEqual(upcoming);
      const call = mockPrisma.counseling.findMany.mock.calls[0][0];
      expect(call.where.status).toBe('SCHEDULED');
      expect(call.where.date.gte).toBeDefined();
      expect(call.where.date.gte instanceof Date).toBe(true);
      expect(call.include.student.select).toEqual({ id: true, name: true, grade: true, classGroup: true, status: true });
      expect(call.orderBy).toEqual({ date: 'asc' });
    });
  });

  describe('getByStudent', () => {
    it('filters by studentId', async () => {
      const items = [{ id: '1', studentId: 's1', title: '상담' }];
      mockPrisma.counseling.findMany.mockResolvedValue(items);

      const result = await service.getByStudent('s1');

      expect(result).toEqual(items);
      const call = mockPrisma.counseling.findMany.mock.calls[0][0];
      expect(call.where.studentId).toBe('s1');
      expect(call.include.student.select).toEqual({ id: true, name: true, grade: true, classGroup: true, status: true });
      expect(call.orderBy).toEqual({ date: 'desc' });
    });
  });

  describe('getStats', () => {
    it('returns total, byType, and byStatus', async () => {
      mockPrisma.counseling.count.mockResolvedValue(15);
      mockPrisma.counseling.groupBy
        .mockResolvedValueOnce([
          { type: 'INITIAL', _count: { id: 5 } },
          { type: 'REGULAR', _count: { id: 10 } },
        ])
        .mockResolvedValueOnce([
          { status: 'COMPLETED', _count: { id: 12 } },
          { status: 'SCHEDULED', _count: { id: 3 } },
        ]);

      const stats = await service.getStats();

      expect(stats.total).toBe(15);
      expect(stats.byType).toEqual({ INITIAL: 5, REGULAR: 10 });
      expect(stats.byStatus).toEqual({ COMPLETED: 12, SCHEDULED: 3 });
    });
  });
});
