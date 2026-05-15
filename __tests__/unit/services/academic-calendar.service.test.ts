import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AcademicCalendarService } from '@/services/academic-calendar.service';

function createMockPrisma() {
  return {
    timetable: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    academicEvent: {
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

describe('AcademicCalendarService', () => {
  let service: AcademicCalendarService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new AcademicCalendarService(mockPrisma as never);
  });

  // ── Timetable CRUD ──

  describe('listTimetables', () => {
    it('returns paginated results', async () => {
      const items = [{ id: '1', title: '1학기 시간표' }];
      mockPrisma.timetable.findMany.mockResolvedValue(items);
      mockPrisma.timetable.count.mockResolvedValue(1);

      const result = await service.listTimetables({ page: 1, limit: 10 });

      expect(result.items).toEqual(items);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
      expect(mockPrisma.timetable.findMany).toHaveBeenCalledOnce();
    });

    it('filters by year when provided', async () => {
      mockPrisma.timetable.findMany.mockResolvedValue([]);
      mockPrisma.timetable.count.mockResolvedValue(0);

      await service.listTimetables({ page: 1, limit: 10, year: 2024 });

      const call = mockPrisma.timetable.findMany.mock.calls[0][0];
      expect(call.where.year).toBe(2024);
    });
  });

  describe('getTimetableById', () => {
    it('calls findUnique with id', async () => {
      const item = { id: '1', title: '시간표' };
      mockPrisma.timetable.findUnique.mockResolvedValue(item);

      const result = await service.getTimetableById('1');

      expect(result).toEqual(item);
      expect(mockPrisma.timetable.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('returns null for non-existent id', async () => {
      mockPrisma.timetable.findUnique.mockResolvedValue(null);
      const result = await service.getTimetableById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('createTimetable', () => {
    it('creates timetable with provided data', async () => {
      const input = { title: '시간표', year: 2024, semester: 1, schoolLevel: '중등' };
      const created = { id: '1', ...input };
      mockPrisma.timetable.create.mockResolvedValue(created);

      const result = await service.createTimetable(input);

      expect(result).toEqual(created);
      expect(mockPrisma.timetable.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('updateTimetable', () => {
    it('updates timetable by id', async () => {
      const updated = { id: '1', title: '수정된 시간표' };
      mockPrisma.timetable.update.mockResolvedValue(updated);

      const result = await service.updateTimetable('1', { title: '수정된 시간표' });

      expect(result).toEqual(updated);
      expect(mockPrisma.timetable.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: '수정된 시간표' },
      });
    });
  });

  describe('deleteTimetable', () => {
    it('deletes timetable by id', async () => {
      mockPrisma.timetable.delete.mockResolvedValue({});
      await service.deleteTimetable('1');
      expect(mockPrisma.timetable.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('getActiveTimetables', () => {
    it('filters by isActive: true', async () => {
      const items = [{ id: '1', title: '활성 시간표', isActive: true }];
      mockPrisma.timetable.findMany.mockResolvedValue(items);

      const result = await service.getActiveTimetables();

      expect(result).toEqual(items);
      expect(mockPrisma.timetable.findMany).toHaveBeenCalledWith({ where: { isActive: true } });
    });
  });

  // ── AcademicEvent CRUD ──

  describe('listEvents', () => {
    it('returns paginated results', async () => {
      const items = [{ id: '1', title: '개학' }];
      mockPrisma.academicEvent.findMany.mockResolvedValue(items);
      mockPrisma.academicEvent.count.mockResolvedValue(1);

      const result = await service.listEvents({ page: 1, limit: 10 });

      expect(result.items).toEqual(items);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('getEventById', () => {
    it('calls findUnique with id', async () => {
      const item = { id: '1', title: '개학' };
      mockPrisma.academicEvent.findUnique.mockResolvedValue(item);

      const result = await service.getEventById('1');

      expect(result).toEqual(item);
      expect(mockPrisma.academicEvent.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('createEvent', () => {
    it('creates event with provided data', async () => {
      const input = { title: '개학', type: 'SEMESTER_START', startDate: new Date() };
      const created = { id: '1', ...input };
      mockPrisma.academicEvent.create.mockResolvedValue(created);

      const result = await service.createEvent(input);

      expect(result).toEqual(created);
      expect(mockPrisma.academicEvent.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('updateEvent', () => {
    it('updates event by id', async () => {
      const updated = { id: '1', title: '수정된 이벤트' };
      mockPrisma.academicEvent.update.mockResolvedValue(updated);

      const result = await service.updateEvent('1', { title: '수정된 이벤트' });

      expect(result).toEqual(updated);
      expect(mockPrisma.academicEvent.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: '수정된 이벤트' },
      });
    });
  });

  describe('deleteEvent', () => {
    it('deletes event by id', async () => {
      mockPrisma.academicEvent.delete.mockResolvedValue({});
      await service.deleteEvent('1');
      expect(mockPrisma.academicEvent.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('getMonthlyEvents', () => {
    it('filters events within the calendar month', async () => {
      mockPrisma.academicEvent.findMany.mockResolvedValue([]);

      await service.getMonthlyEvents(2024, 3);

      const call = mockPrisma.academicEvent.findMany.mock.calls[0][0];
      expect(call.where.startDate.gte).toEqual(new Date(2024, 2, 1));
      expect(call.where.startDate.lte).toEqual(new Date(2024, 3, 0, 23, 59, 59, 999));
      expect(call.orderBy).toEqual({ startDate: 'asc' });
    });
  });

  describe('getYearlyEvents', () => {
    it('filters events within the calendar year', async () => {
      mockPrisma.academicEvent.findMany.mockResolvedValue([]);

      await service.getYearlyEvents(2024);

      const call = mockPrisma.academicEvent.findMany.mock.calls[0][0];
      expect(call.where.startDate.gte).toEqual(new Date(2024, 0, 1));
      expect(call.where.startDate.lte).toEqual(new Date(2024, 11, 31, 23, 59, 59, 999));
    });
  });

  describe('getStats', () => {
    it('returns timetable and event counts with breakdown', async () => {
      mockPrisma.timetable.count.mockResolvedValue(3);
      mockPrisma.academicEvent.count.mockResolvedValue(10);
      mockPrisma.academicEvent.groupBy.mockResolvedValue([
        { type: 'EXAM', _count: { id: 4 } },
        { type: 'HOLIDAY', _count: { id: 6 } },
      ]);

      const stats = await service.getStats();

      expect(stats.totalTimetables).toBe(3);
      expect(stats.totalEvents).toBe(10);
      expect(stats.byEventType).toEqual({ EXAM: 4, HOLIDAY: 6 });
    });
  });
});
