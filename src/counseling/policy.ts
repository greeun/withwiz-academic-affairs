// `scopeWhere` returns a Prisma.StudentCounselingWhereInput-shaped object.
// Typed loosely here because the package has no @prisma/client dependency.
// Consumers in the host pass it directly to prisma.studentCounseling.findMany({ where: ... }).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaWhereInput = any;

export interface CounselingViewer {
  staffId: string;
  menuKeys: string[];
  isSystem: boolean;
}

export interface CounselingRecord {
  authorId: string;
  student: { homeroomStaffId: string | null };
}

export interface CounselingDraft {
  student: { homeroomStaffId: string | null };
}

function hasViewAll(v: CounselingViewer): boolean {
  return v.isSystem || v.menuKeys.includes("school.viewAll");
}

export function canRead(v: CounselingViewer, r: CounselingRecord): boolean {
  if (hasViewAll(v)) return true;
  if (r.authorId === v.staffId) return true;
  if (r.student.homeroomStaffId === v.staffId) return true;
  return false;
}

export function canUpdate(v: CounselingViewer, r: CounselingRecord): boolean {
  return r.authorId === v.staffId;
}

export function canCreate(v: CounselingViewer, d: CounselingDraft): boolean {
  if (hasViewAll(v)) return true;
  return d.student.homeroomStaffId === v.staffId;
}

export function scopeWhere(
  v: CounselingViewer,
): PrismaWhereInput | undefined {
  if (hasViewAll(v)) return undefined;
  return {
    OR: [
      { authorId: v.staffId },
      { student: { classGroup: { homeroomStaffId: v.staffId } } },
    ],
  };
}

// 학생의 담임은 ClassGroup을 경유한다 — Prisma fetch 결과를 정책 함수 입력 형태로 평탄화.
export function flattenForPolicy(record: {
  authorId: string;
  student: { classGroup: { homeroomStaffId: string | null } | null } | null;
}): CounselingRecord {
  return {
    authorId: record.authorId,
    student: { homeroomStaffId: record.student?.classGroup?.homeroomStaffId ?? null },
  };
}

export function flattenStudentForPolicy(student: {
  classGroup: { homeroomStaffId: string | null } | null;
}): CounselingDraft["student"] {
  return { homeroomStaffId: student.classGroup?.homeroomStaffId ?? null };
}
