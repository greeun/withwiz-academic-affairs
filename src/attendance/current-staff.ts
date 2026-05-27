/**
 * Resolve the logged-in user's Staff record.
 * - GET handlers: allowed to call this and treat `null` as "read-only" path.
 * - POST handlers: require a non-null result; return 403 otherwise.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCurrentStaffId(prisma: any, userId: string): Promise<string | null> {
  const staff = await prisma.staff.findFirst({
    where: { userId },
    select: { id: true },
  });
  return staff?.id ?? null;
}
