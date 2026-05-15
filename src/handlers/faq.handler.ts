import { FaqService } from '../services/faq.service';
import { createFaqSchema, updateFaqSchema } from '../validators/faq.validator';
import { NextApiResponse } from '../utils/api-response';

export function createFaqHandlers(service: FaqService, withAdminApi: (handler: Function) => Function) {
  const list = {
    GET: withAdminApi(async (req: Request) => {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get('page')) || 1;
      const limit = Number(url.searchParams.get('limit')) || 20;
      const sortBy = url.searchParams.get('sortBy') || undefined;
      const categoryId = url.searchParams.get('categoryId') || undefined;

      const result = await service.list({ page, limit, sortBy, categoryId });
      return NextApiResponse.success(result);
    }),
    POST: withAdminApi(async (req: Request) => {
      const body = await req.json();
      const data = createFaqSchema.parse(body);
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
      const data = updateFaqSchema.parse(body);
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
