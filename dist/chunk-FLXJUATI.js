"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/types/common.ts
function buildPaginatedResult(items, total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return {
    items,
    pagination: { page, pageSize: limit, total, totalPages, hasMore: page < totalPages }
  };
}



exports.buildPaginatedResult = buildPaginatedResult;
//# sourceMappingURL=chunk-FLXJUATI.js.map