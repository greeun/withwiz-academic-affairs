import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AttendanceService } from '@/services/attendance.service';

function createMockPrisma() {
  return {
    attendance: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    $transaction: vi.fn(),
  };
}

describe('AttendanceService', () => {
  let service: AttendanceService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new AttendanceService(mockPrisma as never);
  });

  describe('list', () => {
    it('returns paginated results', async () => {
      const items = [{ id: '1', studentId: 's1', status: 'PRESENT' }];
      mockPrisma.attendance.findMany.mockResolvedValue(items);
      mockPrisma.attendance.count.mockResolvedValue(1);

      const result = await service.list({ page: 1, limit: 10 });

      expect(result.items).toEqual(items);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
    });

    it('filters by studentId when provided', async () => {
      mockPrisma.attendance.findMany.mockResolvedValue([]);
      mockPrisma.attendance.count.mockResolvedValue(0);

      await service.list({ page: 1, limit: 10, studentId: 's1' });

      const call = mockPrisma.attendance.findMany.mock.calls[0][0];
      expect(call.where.studentId).toBe('s1');
    });
  });

  describe('getById', () => {
    it('calls findUnique with id', async () => {
      const item = { id: '1', studentId: 's1', status: 'PRESENT' };
      mockPrisma.attendance.findUnique.mockResolvedValue(item);

      const result = await service.getById('1');

      expect(result).toEqual(item);
      expect(mockPrisma.attendance.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { student: true },
      });
    });
  });

  describe('create', () => {
    it('creates attendance with provided data', async () => {
      const input = { studentId: 's1', date: new Date(), status: 'PRESENT' };
      const created = { id: '1', ...input };
      mockPrisma.attendance.create.mockResolvedValue(created);

      const result = await service.create(input);

      expect(result).toEqual(created);
      expect(mockPrisma.attendance.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('update', () => {
    it('updates attendance by id', async () => {
      const updated = { id: '1', status: 'ABSENT' };
      mockPrisma.attendance.update.mockResolvedValue(updated);

      const result = await service.update('1', { status: 'ABSENT' });

      expect(result).toEqual(updated);
      expect(mockPrisma.attendance.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'ABSENT' },
      });
    });
  });

  describe('delete', () => {
    it('deletes attendance by id', async () => {
      mockPrisma.attendance.delete.mockResolvedValue({});
      await service.delete('1');
      expect(mockPrisma.attendance.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('bulkCreate', () => {
    it('uses $transaction to create multiple records', async () => {
      const records = [
        { studentId: 's1', date: new Date('2024-03-04'), status: 'PRESENT' },
        { studentId: 's2', date: new Date('2024-03-04'), status: 'ABSENT' },
      ];
      const created = records.map((r, i) => ({ id: `${i}`, ...r }));
      mockPrisma.$transaction.mockResolvedValue(created);

      const result = await service.bulkCreate(records);

      expect(result).toEqual(created);
      expect(mockPrisma.$transaction).toHaveBeenCalledOnce();
      // Verify it passes an array of prisma operations
      const txArg = mockPrisma.$transaction.mock.calls[0][0];
      expect(Array.isArray(txArg)).toBe(true);
    });
  });

  describe('getDailyReport', () => {
    it('filters attendance by date range', async () => {
      const date = new Date('2024-03-04');
      mockPrisma.attendance.findMany.mockResolvedValue([]);

      await service.getDailyReport(date);

      const call = mockPrisma.attendance.findMany.mock.calls[0][0];
      expect(call.where.date.gte).toBeDefined();
      expect(call.where.date.lte).toBeDefined();
      expect(call.include.student).toBe(true);
    });
  });

  describe('getStudentReport', () => {
    it('filters by studentId and date range', async () => {
      const startDate = new Date('2024-03-01');
      const endDate = new Date('2024-03-31');
      mockPrisma.attendance.findMany.mockResolvedValue([]);

      await service.getStudentReport('s1', startDate, endDate);

      const call = mockPrisma.attendance.findMany.mock.calls[0][0];
      expect(call.where.studentId).toBe('s1');
      expect(call.where.date.gte).toEqual(startDate);
      expect(call.where.date.lte).toEqual(endDate);
      expect(call.orderBy).toEqual({ date: 'asc' });
    });
  });

  describe('getStats', () => {
    it('returns total and breakdown by status', async () => {
      mockPrisma.attendance.count.mockResolvedValue(100);
      mockPrisma.attendance.groupBy.mockResolvedValue([
        { status: 'PRESENT', _count: { id: 80 } },
        { status: 'ABSENT', _count: { id: 10 } },
        { status: 'LATE', _count: { id: 10 } },
      ]);

      const stats = await service.getStats();

      expect(stats.total).toBe(100);
      expect(stats.byStatus).toEqual({ PRESENT: 80, ABSENT: 10, LATE: 10 });
    });
  });
});
