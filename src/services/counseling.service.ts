import { buildPaginatedResult } from '../types/common';
import type { PaginatedResult } from '../types/common';
import { DEFAULT_PAGE, DEFAULT_LIMIT, parseSortParam, STUDENT_SUMMARY_SELECT } from './base-service';

interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  studentId?: string;
  type?: string;
  status?: string;
  counselorId?: string;
}

const SORT_ALLOWED = ['createdAt', 'date', 'title', 'updatedAt'];

export class CounselingService {
  constructor(private prisma: any) {}

  async list(params: ListParams): Promise<PaginatedResult<any>> {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? 'date_desc', SORT_ALLOWED, 'date');

    const where: Record<string, unknown> = {};
    if (params.studentId) where.studentId = params.studentId;
    if (params.type) where.type = params.type;
    if (params.status) where.status = params.status;
    if (params.counselorId) where.counselorId = params.counselorId;

    const [items, total] = await Promise.all([
      this.prisma.counseling.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: { student: { select: STUDENT_SUMMARY_SELECT } },
      }),
      this.prisma.counseling.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    return this.prisma.counseling.findUnique({ where: { id }, include: { student: { select: STUDENT_SUMMARY_SELECT } } });
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.counseling.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.counseling.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.counseling.delete({ where: { id } });
  }

  async getUpcoming() {
    const now = new Date();
    return this.prisma.counseling.findMany({
      where: {
        status: 'SCHEDULED',
        date: { gte: now },
      },
      include: { student: { select: STUDENT_SUMMARY_SELECT } },
      orderBy: { date: 'asc' },
    });
  }

  async getByStudent(studentId: string) {
    return this.prisma.counseling.findMany({
      where: { studentId },
      include: { student: { select: STUDENT_SUMMARY_SELECT } },
      orderBy: { date: 'desc' },
    });
  }

  async getStats(): Promise<{ total: number; byType: Record<string, number>; byStatus: Record<string, number> }> {
    const [total, typeGroups, statusGroups] = await Promise.all([
      this.prisma.counseling.count(),
      this.prisma.counseling.groupBy({
        by: ['type'],
        _count: { id: true },
      }),
      this.prisma.counseling.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    const byType: Record<string, number> = {};
    for (const g of typeGroups) {
      byType[g.type] = g._count.id;
    }

    const byStatus: Record<string, number> = {};
    for (const g of statusGroups) {
      byStatus[g.status] = g._count.id;
    }

    return { total, byType, byStatus };
  }
}
