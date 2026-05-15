interface PaginatedResult<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
}
type SortOrder = 'asc' | 'desc';
declare function buildPaginatedResult<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T>;

export { type PaginatedResult as P, type SortOrder as S, buildPaginatedResult as b };
