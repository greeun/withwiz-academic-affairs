import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StudentService } from '@/services/student.service';

function createMockPrisma() {
  return {
    student: {
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

describe('StudentService', () => {
  let service: StudentService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new StudentService(mockPrisma as never);
  });

  describe('list', () => {
    it('returns paginated results', async () => {
      const items = [{ id: '1', name: '김학생', grade: 1 }];
      mockPrisma.student.findMany.mockResolvedValue(items);
      mockPrisma.student.count.mockResolvedValue(1);

      const result = await service.list({ page: 1, limit: 10 });

      expect(result.items).toEqual(items);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
    });

    it('filters by grade when provided', async () => {
      mockPrisma.student.findMany.mockResolvedValue([]);
      mockPrisma.student.count.mockResolvedValue(0);

      await service.list({ page: 1, limit: 10, grade: 2 });

      const call = mockPrisma.student.findMany.mock.calls[0][0];
      expect(call.where.grade).toBe(2);
    });

    it('filters by status when provided', async () => {
      mockPrisma.student.findMany.mockResolvedValue([]);
      mockPrisma.student.count.mockResolvedValue(0);

      await service.list({ page: 1, limit: 10, status: 'ACTIVE' });

      const call = mockPrisma.student.findMany.mock.calls[0][0];
      expect(call.where.status).toBe('ACTIVE');
    });
  });

  describe('getById', () => {
    it('calls findUnique with id', async () => {
      const item = { id: '1', name: '김학생' };
      mockPrisma.student.findUnique.mockResolvedValue(item);

      const result = await service.getById('1');

      expect(result).toEqual(item);
      expect(mockPrisma.student.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('returns null for non-existent id', async () => {
      mockPrisma.student.findUnique.mockResolvedValue(null);
      const result = await service.getById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('creates student with provided data', async () => {
      const input = { name: '박학생', grade: 1 };
      const created = { id: '1', ...input, status: 'ACTIVE' };
      mockPrisma.student.create.mockResolvedValue(created);

      const result = await service.create(input);

      expect(result).toEqual(created);
      expect(mockPrisma.student.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('update', () => {
    it('updates student by id', async () => {
      const updated = { id: '1', name: '수정학생' };
      mockPrisma.student.update.mockResolvedValue(updated);

      const result = await service.update('1', { name: '수정학생' });

      expect(result).toEqual(updated);
      expect(mockPrisma.student.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: '수정학생' },
      });
    });
  });

  describe('delete', () => {
    it('deletes student by id', async () => {
      mockPrisma.student.delete.mockResolvedValue({});
      await service.delete('1');
      expect(mockPrisma.student.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('getByGrade', () => {
    it('filters students by grade', async () => {
      const items = [{ id: '1', name: '김학생', grade: 2 }];
      mockPrisma.student.findMany.mockResolvedValue(items);

      const result = await service.getByGrade(2);

      expect(result).toEqual(items);
      expect(mockPrisma.student.findMany).toHaveBeenCalledWith({
        where: { grade: 2 },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('updateStatus', () => {
    it('updates student status', async () => {
      const updated = { id: '1', name: '김학생', status: 'GRADUATED' };
      mockPrisma.student.update.mockResolvedValue(updated);

      const result = await service.updateStatus('1', 'GRADUATED');

      expect(result).toEqual(updated);
      expect(mockPrisma.student.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'GRADUATED' },
      });
    });
  });

  describe('getStats', () => {
    it('returns total, byStatus, and byGrade', async () => {
      mockPrisma.student.count.mockResolvedValue(10);
      mockPrisma.student.groupBy
        .mockResolvedValueOnce([
          { status: 'ACTIVE', _count: { id: 8 } },
          { status: 'ON_LEAVE', _count: { id: 2 } },
        ])
        .mockResolvedValueOnce([
          { grade: 1, _count: { id: 5 } },
          { grade: 2, _count: { id: 5 } },
        ]);

      const stats = await service.getStats();

      expect(stats.total).toBe(10);
      expect(stats.byStatus).toEqual({ ACTIVE: 8, ON_LEAVE: 2 });
      expect(stats.byGrade).toEqual({ '1': 5, '2': 5 });
    });
  });
});
