import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdmissionService } from '@/services/admission.service';

function createMockPrisma() {
  return {
    admissionSession: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    admissionRegistration: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  };
}

describe('AdmissionService', () => {
  let service: AdmissionService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new AdmissionService(mockPrisma as never);
  });

  // ── Session CRUD ──

  describe('listSessions', () => {
    it('returns paginated results', async () => {
      const items = [{ id: '1', title: '설명회' }];
      mockPrisma.admissionSession.findMany.mockResolvedValue(items);
      mockPrisma.admissionSession.count.mockResolvedValue(1);

      const result = await service.listSessions({ page: 1, limit: 10 });

      expect(result.items).toEqual(items);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
    });

    it('filters by isOpen when provided', async () => {
      mockPrisma.admissionSession.findMany.mockResolvedValue([]);
      mockPrisma.admissionSession.count.mockResolvedValue(0);

      await service.listSessions({ isOpen: true });

      const call = mockPrisma.admissionSession.findMany.mock.calls[0][0];
      expect(call.where.isOpen).toBe(true);
    });
  });

  describe('getSessionById', () => {
    it('calls findUnique with id and includes registrations', async () => {
      const item = { id: '1', title: '설명회', registrations: [] };
      mockPrisma.admissionSession.findUnique.mockResolvedValue(item);

      const result = await service.getSessionById('1');

      expect(result).toEqual(item);
      expect(mockPrisma.admissionSession.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { registrations: true },
      });
    });

    it('returns null for non-existent id', async () => {
      mockPrisma.admissionSession.findUnique.mockResolvedValue(null);
      const result = await service.getSessionById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('createSession', () => {
    it('creates session with provided data', async () => {
      const input = { title: '설명회', date: new Date() };
      const created = { id: '1', ...input };
      mockPrisma.admissionSession.create.mockResolvedValue(created);

      const result = await service.createSession(input);

      expect(result).toEqual(created);
      expect(mockPrisma.admissionSession.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('updateSession', () => {
    it('updates session by id', async () => {
      const updated = { id: '1', title: '수정된 설명회' };
      mockPrisma.admissionSession.update.mockResolvedValue(updated);

      const result = await service.updateSession('1', { title: '수정된 설명회' });

      expect(result).toEqual(updated);
      expect(mockPrisma.admissionSession.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: '수정된 설명회' },
      });
    });
  });

  describe('deleteSession', () => {
    it('deletes session by id', async () => {
      mockPrisma.admissionSession.delete.mockResolvedValue({});
      await service.deleteSession('1');
      expect(mockPrisma.admissionSession.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('getOpenSessions', () => {
    it('filters by isOpen: true', async () => {
      const items = [{ id: '1', title: '열린 설명회', isOpen: true }];
      mockPrisma.admissionSession.findMany.mockResolvedValue(items);

      const result = await service.getOpenSessions();

      expect(result).toEqual(items);
      expect(mockPrisma.admissionSession.findMany).toHaveBeenCalledWith({
        where: { isOpen: true },
        include: { _count: { select: { registrations: true } } },
        orderBy: { date: 'asc' },
      });
    });
  });

  // ── Registration ──

  describe('listRegistrations', () => {
    it('filters by sessionId', async () => {
      const items = [{ id: '1', sessionId: 'session-1', applicantName: '김부모' }];
      mockPrisma.admissionRegistration.findMany.mockResolvedValue(items);
      mockPrisma.admissionRegistration.count.mockResolvedValue(1);

      const result = await service.listRegistrations('session-1');

      expect(result.items).toEqual(items);
      const call = mockPrisma.admissionRegistration.findMany.mock.calls[0][0];
      expect(call.where.sessionId).toBe('session-1');
    });
  });

  describe('register', () => {
    it('creates registration with sessionId', async () => {
      const data = { applicantName: '김부모', phone: '010-1234-5678', studentName: '김학생' };
      const created = { id: '1', sessionId: 'session-1', ...data };
      mockPrisma.admissionRegistration.create.mockResolvedValue(created);

      const result = await service.register('session-1', data);

      expect(result).toEqual(created);
      expect(mockPrisma.admissionRegistration.create).toHaveBeenCalledWith({
        data: { ...data, sessionId: 'session-1' },
      });
    });
  });

  describe('updateRegistrationStatus', () => {
    it('updates registration status', async () => {
      const updated = { id: '1', status: 'CONFIRMED' };
      mockPrisma.admissionRegistration.update.mockResolvedValue(updated);

      const result = await service.updateRegistrationStatus('1', 'CONFIRMED');

      expect(result).toEqual(updated);
      expect(mockPrisma.admissionRegistration.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'CONFIRMED' },
      });
    });
  });

  // ── Stats ──

  describe('getStats', () => {
    it('returns totalSessions, totalRegistrations, and byStatus', async () => {
      mockPrisma.admissionSession.count.mockResolvedValue(3);
      mockPrisma.admissionRegistration.count.mockResolvedValue(20);
      mockPrisma.admissionRegistration.groupBy.mockResolvedValue([
        { status: 'PENDING', _count: { id: 10 } },
        { status: 'CONFIRMED', _count: { id: 8 } },
        { status: 'ATTENDED', _count: { id: 2 } },
      ]);

      const stats = await service.getStats();

      expect(stats.totalSessions).toBe(3);
      expect(stats.totalRegistrations).toBe(20);
      expect(stats.byStatus).toEqual({ PENDING: 10, CONFIRMED: 8, ATTENDED: 2 });
    });
  });
});
