"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/infrastructure/prisma.ts
var _prisma;
function setPrisma(client) {
  _prisma = client;
}
function getPrisma() {
  if (!_prisma) {
    throw new Error("Prisma client not initialized. Call setPrisma() first.");
  }
  return _prisma;
}




exports.setPrisma = setPrisma; exports.getPrisma = getPrisma;
//# sourceMappingURL=chunk-MLXTBEWP.js.map