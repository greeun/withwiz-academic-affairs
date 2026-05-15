export type StudentStatus = 'ACTIVE' | 'ON_LEAVE' | 'GRADUATED' | 'WITHDRAWN';

export interface Student {
  id: string;
  name: string;
  grade: number;
  classGroup: string | null;
  birthDate: Date | null;
  phone: string | null;
  parentPhone: string | null;
  parentName: string | null;
  enrolledAt: Date;
  status: StudentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
