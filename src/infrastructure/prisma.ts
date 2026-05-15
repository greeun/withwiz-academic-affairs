let _prisma: any;

export function setPrisma(client: any) {
  _prisma = client;
}

export function getPrisma() {
  if (!_prisma) {
    throw new Error('Prisma client not initialized. Call setPrisma() first.');
  }
  return _prisma;
}
