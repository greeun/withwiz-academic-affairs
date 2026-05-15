import { buildPaginatedResult } from '../types/common';
import type { PaginatedResult } from '../types/common';
import { DEFAULT_PAGE, DEFAULT_LIMIT, parseSortParam } from './base-service';

interface TimetableListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  year?: number;
  semester?: number;
  schoolLevel?: string;
}

interface EventListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  type?: string;
  schoolLevel?: string;
  isPublished?: boolean;
}

const TIMETABLE_SORT_ALLOWED = ['createdAt', 'year', 'semester', 'updatedAt'];
const EVENT_SORT_ALLOWED = ['createdAt', 'startDate', 'title', 'updatedAt'];

export class AcademicCalendarService {
  constructor(private prisma: any) {}

  // ── Timetable CRUD ──

  async listTimetables(params: TimetableListParams): Promise<PaginatedResult<any>> {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? 'createdAt_desc', TIMETABLE_SORT_ALLOWED, 'createdAt');

    const where: Record<string, unknown> = {};
    if (params.year != null) where.year = params.year;
    if (params.semester != null) where.semester = params.semester;
    if (params.schoolLevel) where.schoolLevel = params.schoolLevel;

    const [items, total] = await Promise.all([
      this.prisma.timetable.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.timetable.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getTimetableById(id: string) {
    return this.prisma.timetable.findUnique({ where: { id } });
  }

  async createTimetable(data: Record<string, unknown>) {
    return this.prisma.timetable.create({ data });
  }

  async updateTimetable(id: string, data: Record<string, unknown>) {
    return this.prisma.timetable.update({ where: { id }, data });
  }

  async deleteTimetable(id: string) {
    return this.prisma.timetable.delete({ where: { id } });
  }

  async getActiveTimetables() {
    return this.prisma.timetable.findMany({ where: { isActive: true } });
  }

  // ── AcademicEvent CRUD ──

  async listEvents(params: EventListParams): Promise<PaginatedResult<any>> {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? 'startDate_asc', EVENT_SORT_ALLOWED, 'startDate');

    const where: Record<string, unknown> = {};
    if (params.type) where.type = params.type;
    if (params.schoolLevel) where.schoolLevel = params.schoolLevel;
    if (params.isPublished != null) where.isPublished = params.isPublished;

    const [items, total] = await Promise.all([
      this.prisma.academicEvent.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.academicEvent.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getEventById(id: string) {
    return this.prisma.academicEvent.findUnique({ where: { id } });
  }

  async createEvent(data: Record<string, unknown>) {
    return this.prisma.academicEvent.create({ data });
  }

  async updateEvent(id: string, data: Record<string, unknown>) {
    return this.prisma.academicEvent.update({ where: { id }, data });
  }

  async deleteEvent(id: string) {
    return this.prisma.academicEvent.delete({ where: { id } });
  }

  async getMonthlyEvents(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return this.prisma.academicEvent.findMany({
      where: {
        startDate: { gte: startDate, lte: endDate },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  async getYearlyEvents(year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    return this.prisma.academicEvent.findMany({
      where: {
        startDate: { gte: startDate, lte: endDate },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  // ── Stats ──

  async getStats(): Promise<{ totalTimetables: number; totalEvents: number; byEventType: Record<string, number> }> {
    const [totalTimetables, totalEvents, groups] = await Promise.all([
      this.prisma.timetable.count(),
      this.prisma.academicEvent.count(),
      this.prisma.academicEvent.groupBy({
        by: ['type'],
        _count: { id: true },
      }),
    ]);

    const byEventType: Record<string, number> = {};
    for (const g of groups) {
      byEventType[g.type] = g._count.id;
    }

    return { totalTimetables, totalEvents, byEventType };
  }
}
