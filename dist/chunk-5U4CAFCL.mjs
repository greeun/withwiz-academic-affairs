// src/types/common.ts
function buildPaginatedResult(items, total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return {
    items,
    pagination: { page, pageSize: limit, total, totalPages, hasMore: page < totalPages }
  };
}

export {
  buildPaginatedResult
};
//# sourceMappingURL=chunk-5U4CAFCL.mjs.map