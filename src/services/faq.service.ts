import { buildPaginatedResult } from '../types/common';
import type { PaginatedResult } from '../types/common';
import { DEFAULT_PAGE, DEFAULT_LIMIT, parseSortParam } from './base-service';

interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  categoryId?: string;
  isPublished?: boolean;
}

const SORT_ALLOWED = ['createdAt', 'order', 'question', 'updatedAt'];

export class FaqService {
  constructor(private prisma: any) {}

  async list(params: ListParams): Promise<PaginatedResult<any>> {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? 'order_asc', SORT_ALLOWED, 'order');

    const where: Record<string, unknown> = {};
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.isPublished != null) where.isPublished = params.isPublished;

    const [items, total] = await Promise.all([
      this.prisma.faq.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: { category: true },
      }),
      this.prisma.faq.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getById(id: string) {
    return this.prisma.faq.findUnique({ where: { id }, include: { category: true } });
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.faq.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.faq.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.faq.delete({ where: { id } });
  }

  async reorder(ids: string[]): Promise<void> {
    await this.prisma.$transaction((tx: any) =>
      Promise.all(
        ids.map((id, index) =>
          tx.faq.update({ where: { id }, data: { order: index } })
        )
      )
    );
  }

  // ── Category methods ──

  async listCategories() {
    return this.prisma.faqCategory.findMany({
      orderBy: { order: 'asc' },
      include: { faqs: true },
    });
  }

  async createCategory(data: Record<string, unknown>) {
    return this.prisma.faqCategory.create({ data });
  }

  async updateCategory(id: string, data: Record<string, unknown>) {
    return this.prisma.faqCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    return this.prisma.faqCategory.delete({ where: { id } });
  }

  async reorderCategories(ids: string[]): Promise<void> {
    await this.prisma.$transaction((tx: any) =>
      Promise.all(
        ids.map((id, index) =>
          tx.faqCategory.update({ where: { id }, data: { order: index } })
        )
      )
    );
  }

  // ── Stats ──

  async getStats(): Promise<{ total: number; byCategory: Record<string, number> }> {
    const [total, groups] = await Promise.all([
      this.prisma.faq.count(),
      this.prisma.faq.groupBy({
        by: ['categoryId'],
        _count: { id: true },
      }),
    ]);

    const byCategory: Record<string, number> = {};
    for (const g of groups) {
      byCategory[g.categoryId ?? 'uncategorized'] = g._count.id;
    }

    return { total, byCategory };
  }
}
