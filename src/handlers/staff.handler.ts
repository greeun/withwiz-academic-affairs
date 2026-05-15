import { StaffService } from '../services/staff.service';
import { createStaffSchema, updateStaffSchema } from '../validators/staff.validator';
import { NextApiResponse } from '../utils/api-response';

export function createStaffHandlers(service: StaffService, withAdminApi: (handler: Function) => Function) {
  const list = {
    GET: withAdminApi(async (req: Request) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get('page')) || 1;
      const limit = Number(url.searchParams.get('limit')) || 20;
      const sortBy = url.searchParams.get('sortBy') || undefined;
      const role = url.searchParams.get('role') || undefined;

      const result = await service.list({ page, limit, sortBy, role });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req: Request) => {
      const body = await req.json();
      const data = createStaffSchema.parse(body);
      const created = await service.create(data);
      return NextApiResponse.created(created);
    }),
  };

  const detail = {
    GET: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      const item = await service.getById(ctx.params.id);
      if (!item) return NextApiResponse.notFound();
      return NextApiResponse.success(item);
    }),
    PUT: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      const body = await req.json();
      const data = updateStaffSchema.parse(body);
      const updated = await service.update(ctx.params.id, data);
      return NextApiResponse.success(updated);
    }),
    DELETE: withAdminApi(async (req: Request, ctx: { params: { id: string } }) => {
      await service.delete(ctx.params.id);
      return NextApiResponse.noContent();
    }),
  };

  return { list, detail };
}
