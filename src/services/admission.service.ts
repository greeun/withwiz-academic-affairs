import { buildPaginatedResult } from '../types/common';
import type { PaginatedResult } from '../types/common';
import { DEFAULT_PAGE, DEFAULT_LIMIT, parseSortParam } from './base-service';

interface SessionListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  isOpen?: boolean;
}

interface RegistrationListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sessionId?: string;
  status?: string;
}

const SESSION_SORT_ALLOWED = ['createdAt', 'date', 'title', 'updatedAt'];
const REGISTRATION_SORT_ALLOWED = ['createdAt', 'applicantName', 'updatedAt'];

/** Session lists expose only a registration count; applicant contact data stays in `listRegistrations`. */
const REGISTRATION_COUNT_INCLUDE = { _count: { select: { registrations: true } } } as const;

export class AdmissionService {
  constructor(private prisma: any) {}

  // ── Session CRUD ──

  async listSessions(params: SessionListParams = {}): Promise<PaginatedResult<any>> {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? 'date_desc', SESSION_SORT_ALLOWED, 'date');

    const where: Record<string, unknown> = {};
    if (params.isOpen != null) where.isOpen = params.isOpen;

    const [items, total] = await Promise.all([
      this.prisma.admissionSession.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: REGISTRATION_COUNT_INCLUDE,
      }),
      this.prisma.admissionSession.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getSessionById(id: string) {
    return this.prisma.admissionSession.findUnique({
      where: { id },
      include: { registrations: true },
    });
  }

  async createSession(data: Record<string, unknown>) {
    return this.prisma.admissionSession.create({ data });
  }

  async updateSession(id: string, data: Record<string, unknown>) {
    return this.prisma.admissionSession.update({ where: { id }, data });
  }

  async deleteSession(id: string) {
    return this.prisma.admissionSession.delete({ where: { id } });
  }

  async getOpenSessions() {
    return this.prisma.admissionSession.findMany({
      where: { isOpen: true },
      include: REGISTRATION_COUNT_INCLUDE,
      orderBy: { date: 'asc' },
    });
  }

  // ── Registration ──

  async listRegistrations(sessionId: string, params: RegistrationListParams = {}): Promise<PaginatedResult<any>> {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const { field, order } = parseSortParam(params.sortBy ?? 'createdAt_desc', REGISTRATION_SORT_ALLOWED, 'createdAt');

    const where: Record<string, unknown> = { sessionId };
    if (params.status) where.status = params.status;

    const [items, total] = await Promise.all([
      this.prisma.admissionRegistration.findMany({
        where,
        orderBy: { [field]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.admissionRegistration.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async register(sessionId: string, data: Record<string, unknown>) {
    return this.prisma.admissionRegistration.create({
      data: { ...data, sessionId },
    });
  }

  async updateRegistrationStatus(id: string, status: string) {
    return this.prisma.admissionRegistration.update({
      where: { id },
      data: { status },
    });
  }

  // ── Stats ──

  async getStats(): Promise<{ totalSessions: number; totalRegistrations: number; byStatus: Record<string, number> }> {
    const [totalSessions, totalRegistrations, groups] = await Promise.all([
      this.prisma.admissionSession.count(),
      this.prisma.admissionRegistration.count(),
      this.prisma.admissionRegistration.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    const byStatus: Record<string, number> = {};
    for (const g of groups) {
      byStatus[g.status] = g._count.id;
    }

    return { totalSessions, totalRegistrations, byStatus };
  }
}
