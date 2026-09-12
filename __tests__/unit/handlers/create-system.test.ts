import { describe, it, expect, vi } from 'vitest';
import { createAcademicSystem } from '@/handlers/create-system';
import type { AdminApiWrapper } from '@/handlers/route';

const passthrough: AdminApiWrapper = (handler) => (req, props) =>
  handler(req, { userId: 'u1', permissions: ['*'], groups: [] }, props);

function createMockPrisma() {
  const makeCrudMock = () => ({
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn().mockResolvedValue(0),
    groupBy: vi.fn().mockResolvedValue([]),
    updateMany: vi.fn(),
  });

  return {
    staff: makeCrudMock(),
    timetable: makeCrudMock(),
    academicEvent: makeCrudMock(),
    faq: makeCrudMock(),
    faqCategory: makeCrudMock(),
    student: makeCrudMock(),
    attendance: makeCrudMock(),
    counseling: makeCrudMock(),
    admissionSession: makeCrudMock(),
    admissionRegistration: makeCrudMock(),
    $transaction: vi.fn(),
  };
}

describe('createAcademicSystem', () => {
  it('throws when withAdminApi is missing (no unauthenticated default)', () => {
    const prisma = createMockPrisma();
    expect(() =>
      createAcademicSystem({ prisma: prisma as never, domains: { staff: true } } as never),
    ).toThrow(/withAdminApi/);
  });

  it('creates system with services when domains are enabled', () => {
    const prisma = createMockPrisma();
    const system = createAcademicSystem({
      prisma: prisma as never,
      withAdminApi: passthrough,
      domains: { staff: true },
    });

    expect(system.services.staff).toBeDefined();
  });

  it('does not create service for disabled domains', () => {
    const prisma = createMockPrisma();
    const system = createAcademicSystem({
      prisma: prisma as never,
      withAdminApi: passthrough,
      domains: { staff: false },
    });

    expect(system.services.staff).toBeUndefined();
  });

  it('services.staff can call list', async () => {
    const prisma = createMockPrisma();
    prisma.staff.findMany.mockResolvedValue([{ id: '1', name: 'Test' }]);
    prisma.staff.count.mockResolvedValue(1);

    const system = createAcademicSystem({
      prisma: prisma as never,
      withAdminApi: passthrough,
      domains: { staff: true },
    });

    const result = await system.services.staff!.list({ page: 1, limit: 10 });
    expect(result.items).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
  });

  it('creates system with empty config', () => {
    const prisma = createMockPrisma();
    const system = createAcademicSystem({
      prisma: prisma as never,
      withAdminApi: passthrough,
      domains: {},
    });

    expect(system.services).toBeDefined();
    expect(system.handlers).toBeDefined();
  });

  it('returns both services and handlers properties', () => {
    const prisma = createMockPrisma();
    const system = createAcademicSystem({
      prisma: prisma as never,
      withAdminApi: passthrough,
      domains: { staff: true, faq: true, student: true },
    });

    expect(system.services).toBeDefined();
    expect(system.handlers).toBeDefined();
    expect(system.services.staff).toBeDefined();
    expect(system.services.faq).toBeDefined();
    expect(system.services.student).toBeDefined();
  });

  it('creates handlers with list and detail for each enabled domain', () => {
    const prisma = createMockPrisma();
    const system = createAcademicSystem({
      prisma: prisma as never,
      withAdminApi: passthrough,
      domains: {
        staff: true,
        faq: true,
        student: true,
        attendance: true,
        counseling: true,
        admission: true,
      },
    });

    // Staff handlers
    expect(system.handlers.staff).toBeDefined();
    expect(system.handlers.staff!.list.GET).toBeTypeOf('function');
    expect(system.handlers.staff!.list.POST).toBeTypeOf('function');
    expect(system.handlers.staff!.detail.GET).toBeTypeOf('function');
    expect(system.handlers.staff!.detail.PUT).toBeTypeOf('function');
    expect(system.handlers.staff!.detail.DELETE).toBeTypeOf('function');

    // FAQ handlers
    expect(system.handlers.faq).toBeDefined();
    expect(system.handlers.faq!.list.GET).toBeTypeOf('function');
    expect(system.handlers.faq!.list.POST).toBeTypeOf('function');
    expect(system.handlers.faq!.detail.GET).toBeTypeOf('function');
    expect(system.handlers.faq!.detail.PUT).toBeTypeOf('function');
    expect(system.handlers.faq!.detail.DELETE).toBeTypeOf('function');

    // Student handlers
    expect(system.handlers.student).toBeDefined();
    expect(system.handlers.student!.list.GET).toBeTypeOf('function');
    expect(system.handlers.student!.detail.GET).toBeTypeOf('function');

    // Attendance handlers
    expect(system.handlers.attendance).toBeDefined();
    expect(system.handlers.attendance!.list.GET).toBeTypeOf('function');

    // Counseling handlers
    expect(system.handlers.counseling).toBeDefined();
    expect(system.handlers.counseling!.list.GET).toBeTypeOf('function');

    // Admission handlers
    expect(system.handlers.admission).toBeDefined();
    expect(system.handlers.admission!.list.GET).toBeTypeOf('function');
  });

  it('creates academicCalendar handlers with timetable and event sub-handlers', () => {
    const prisma = createMockPrisma();
    const system = createAcademicSystem({
      prisma: prisma as never,
      withAdminApi: passthrough,
      domains: { academicCalendar: true },
    });

    expect(system.handlers.academicCalendar).toBeDefined();
    expect(system.handlers.academicCalendar!.list.GET).toBeTypeOf('function');
    expect(system.handlers.academicCalendar!.list.POST).toBeTypeOf('function');
    expect(system.handlers.academicCalendar!.detail.GET).toBeTypeOf('function');
    expect(system.handlers.academicCalendar!.detail.PUT).toBeTypeOf('function');
    expect(system.handlers.academicCalendar!.detail.DELETE).toBeTypeOf('function');
    expect(system.handlers.academicCalendar!.eventList.GET).toBeTypeOf('function');
    expect(system.handlers.academicCalendar!.eventList.POST).toBeTypeOf('function');
    expect(system.handlers.academicCalendar!.eventDetail.GET).toBeTypeOf('function');
    expect(system.handlers.academicCalendar!.eventDetail.PUT).toBeTypeOf('function');
    expect(system.handlers.academicCalendar!.eventDetail.DELETE).toBeTypeOf('function');
  });

  it('creates dashboard handler when domains are enabled', () => {
    const prisma = createMockPrisma();
    const system = createAcademicSystem({
      prisma: prisma as never,
      withAdminApi: passthrough,
      domains: { staff: true, student: true },
    });

    expect(system.handlers.dashboard).toBeDefined();
    expect(system.handlers.dashboard!.stats.GET).toBeTypeOf('function');
  });

  it('does not create dashboard handler when no domains are enabled', () => {
    const prisma = createMockPrisma();
    const system = createAcademicSystem({
      prisma: prisma as never,
      withAdminApi: passthrough,
      domains: {},
    });

    expect(system.handlers.dashboard).toBeUndefined();
  });

  it('does not create handlers for disabled domains', () => {
    const prisma = createMockPrisma();
    const system = createAcademicSystem({
      prisma: prisma as never,
      withAdminApi: passthrough,
      domains: { staff: true, faq: false },
    });

    expect(system.handlers.staff).toBeDefined();
    expect(system.handlers.faq).toBeUndefined();
  });

  it('creates all 7 services when all domains are enabled', () => {
    const prisma = createMockPrisma();
    const system = createAcademicSystem({
      prisma: prisma as never,
      withAdminApi: passthrough,
      domains: {
        staff: true,
        academicCalendar: true,
        faq: true,
        student: true,
        attendance: true,
        counseling: true,
        admission: true,
      },
    });

    expect(system.services.staff).toBeDefined();
    expect(system.services.academicCalendar).toBeDefined();
    expect(system.services.faq).toBeDefined();
    expect(system.services.student).toBeDefined();
    expect(system.services.attendance).toBeDefined();
    expect(system.services.counseling).toBeDefined();
    expect(system.services.admission).toBeDefined();
  });
});
