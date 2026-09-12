import { buildPaginatedResult } from '../types/common';
import type { PaginatedResult } from '../types/common';
import { DEFAULT_PAGE, DEFAULT_LIMIT, parseSortParam, STUDENT_SUMMARY_SELECT } from './base-service';

interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  studentId?: string;
  status?: string;
  date?: Date;
}

interface AttendanceRecord {
  studentId: string;
  date: Date;
  status: string;
  reason?: string;
}

const SORT_ALLOWED = ['createdAt', 'date', 'status'];

export class AttendanceService {
  constructor(private prisma: any) {}

  async list(params: ListParams): Promise<PaginatedResult<any>> {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? 'date_desc', SORT_ALLOWED, 'date');

    const where: Record<string, unknown> = {};
    if (params.studentId) where.studentId = params.studentId;
    if (params.status) where.status = params.status;
    if (params.date) where.date = params.date;

    const [items, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: { student: { select: STUDENT_SUMMARY_SELECT } },
      }),
      this.prisma.attendance.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    return this.prisma.attendance.findUnique({ where: { id }, include: { student: { select: STUDENT_SUMMARY_SELECT } } });
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.attendance.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.attendance.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.attendance.delete({ where: { id } });
  }

  async bulkCreate(records: AttendanceRecord[]): Promise<any[]> {
    return this.prisma.$transaction(
      records.map((record) =>
        this.prisma.attendance.create({ data: record })
      )
    );
  }

  async getDailyReport(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.attendance.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
      },
      include: { student: { select: STUDENT_SUMMARY_SELECT } },
      orderBy: { student: { name: 'asc' } },
    });
  }

  async getStudentReport(studentId: string, startDate: Date, endDate: Date) {
    return this.prisma.attendance.findMany({
      where: {
        studentId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getStats(): Promise<{ total: number; byStatus: Record<string, number> }> {
    const [total, groups] = await Promise.all([
      this.prisma.attendance.count(),
      this.prisma.attendance.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    const byStatus: Record<string, number> = {};
    for (const g of groups) {
      byStatus[g.status] = g._count.id;
    }

    return { total, byStatus };
  }
}
