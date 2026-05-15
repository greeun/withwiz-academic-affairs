import { buildPaginatedResult } from '../types/common';
import type { PaginatedResult } from '../types/common';
import { DEFAULT_PAGE, DEFAULT_LIMIT, parseSortParam } from './base-service';

interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  grade?: number;
  status?: string;
  classGroup?: string;
}

const SORT_ALLOWED = ['createdAt', 'name', 'grade', 'enrolledAt', 'updatedAt'];

export class StudentService {
  constructor(private prisma: any) {}

  async list(params: ListParams): Promise<PaginatedResult<any>> {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? 'name_asc', SORT_ALLOWED, 'name');

    const where: Record<string, unknown> = {};
    if (params.grade != null) where.grade = params.grade;
    if (params.status) where.status = params.status;
    if (params.classGroup) where.classGroup = params.classGroup;

    const [items, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.student.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    return this.prisma.student.findUnique({ where: { id } });
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.student.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.student.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.student.delete({ where: { id } });
  }

  async getByGrade(grade: number) {
    return this.prisma.student.findMany({
      where: { grade },
      orderBy: { name: 'asc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.student.update({
      where: { id },
      data: { status },
    });
  }

  async getStats(): Promise<{ total: number; byStatus: Record<string, number>; byGrade: Record<string, number> }> {
    const [total, statusGroups, gradeGroups] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.student.groupBy({
        by: ['grade'],
        _count: { id: true },
      }),
    ]);

    const byStatus: Record<string, number> = {};
    for (const g of statusGroups) {
      byStatus[g.status] = g._count.id;
    }

    const byGrade: Record<string, number> = {};
    for (const g of gradeGroups) {
      byGrade[String(g.grade)] = g._count.id;
    }

    return { total, byStatus, byGrade };
  }
}
