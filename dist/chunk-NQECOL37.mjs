// src/infrastructure/prisma.ts
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

export {
  setPrisma,
  getPrisma
};
//# sourceMappingURL=chunk-NQECOL37.mjs.map