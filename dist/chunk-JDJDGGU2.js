"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/utils/api-response.ts
var NextApiResponse = class {
  static success(data, status = 200) {
    return Response.json({ success: true, data }, { status });
  }
  static paginated(items, page, pageSize, total, dataKey = "items") {
    const totalPages = Math.ceil(total / pageSize);
    return this.success({
      [dataKey]: items,
      pagination: { page, pageSize, total, totalPages, hasMore: page < totalPages }
    });
  }
  static created(data) {
    return this.success(data, 201);
  }
  static noContent() {
    return new Response(null, { status: 204 });
  }
  static error(message, status = 400, code) {
    return Response.json(
      { success: false, error: { message, ...code && { code } } },
      { status }
    );
  }
  static notFound(message = "Not Found") {
    return this.error(message, 404, "NOT_FOUND");
  }
  static unauthorized(message = "Unauthorized") {
    return this.error(message, 401, "UNAUTHORIZED");
  }
  static forbidden(message = "Forbidden") {
    return this.error(message, 403, "FORBIDDEN");
  }
  static serverError(message = "Internal Server Error") {
    return this.error(message, 500, "INTERNAL_SERVER_ERROR");
  }
};



exports.NextApiResponse = NextApiResponse;
//# sourceMappingURL=chunk-JDJDGGU2.js.map