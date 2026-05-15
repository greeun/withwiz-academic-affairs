import { NextApiResponse } from '../utils/api-response';

interface DashboardServices {
  staff?: { getStats(): Promise<any> };
  academicCalendar?: { getStats(): Promise<any> };
  faq?: { getStats(): Promise<any> };
  student?: { getStats(): Promise<any> };
  attendance?: { getStats(): Promise<any> };
  counseling?: { getStats(): Promise<any> };
  admission?: { getStats(): Promise<any> };
}

export function createDashboardHandlers(services: DashboardServices, withAdminApi: (handler: Function) => Function) {
  const stats = {
    GET: withAdminApi(async () => {
      const results: Record<string, any> = {};

      const entries = Object.entries(services) as [string, { getStats(): Promise<any> }][];
      const statResults = await Promise.all(
        entries.map(async ([key, service]) => {
          try {
            const stat = await service.getStats();
            return [key, stat] as const;
          } catch {
            return [key, null] as const;
          }
        })
      );

      for (const [key, stat] of statResults) {
        if (stat !== null) results[key] = stat;
      }

      return NextApiResponse.success(results);
    }),
  };

  return { stats };
}
