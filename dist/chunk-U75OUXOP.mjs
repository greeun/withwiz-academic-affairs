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

// src/infrastructure/clock.ts
var SystemClock = class {
  now() {
    return /* @__PURE__ */ new Date();
  }
};

export {
  setPrisma,
  getPrisma,
  SystemClock
};
//# sourceMappingURL=chunk-U75OUXOP.mjs.map