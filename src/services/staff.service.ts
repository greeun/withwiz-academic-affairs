import { buildPaginatedResult } from '../types/common';
import type { PaginatedResult } from '../types/common';
import { DEFAULT_PAGE, DEFAULT_LIMIT, parseSortParam } from './base-service';

interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  role?: string;
}

const SORT_ALLOWED = ['createdAt', 'name', 'sortOrder', 'updatedAt'];

export class StaffService {
  constructor(private prisma: any) {}

  async list(params: ListParams): Promise<PaginatedResult<any>> {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? 'sortOrder_asc', SORT_ALLOWED, 'sortOrder');

    const where: Record<string, unknown> = {};
    if (params.role) where.role = params.role;

    const [items, total] = await Promise.all([
      this.prisma.staff.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.staff.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    return this.prisma.staff.findUnique({ where: { id } });
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.staff.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.staff.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.staff.delete({ where: { id } });
  }

  async getStats(): Promise<{ total: number; byRole: Record<string, number> }> {
    const [total, groups] = await Promise.all([
      this.prisma.staff.count(),
      this.prisma.staff.groupBy({
        by: ['role'],
        _count: { id: true },
      }),
    ]);

    const byRole: Record<string, number> = {};
    for (const g of groups) {
      byRole[g.role] = g._count.id;
    }

    return { total, byRole };
  }

  async reorder(ids: string[]): Promise<void> {
    await this.prisma.$transaction((tx: any) =>
      Promise.all(
        ids.map((id, index) =>
          tx.staff.update({ where: { id }, data: { sortOrder: index } })
        )
      )
    );
  }
}
