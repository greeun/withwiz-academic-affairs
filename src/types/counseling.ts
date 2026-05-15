export type CounselingType = 'INITIAL' | 'REGULAR' | 'EMERGENCY' | 'PARENT' | 'ADMISSION';
export type CounselingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Counseling {
  id: string;
  studentId: string | null;
  counselorId: string | null;
  type: CounselingType;
  date: Date;
  title: string;
  content: string;
  parentName: string | null;
  parentPhone: string | null;
  status: CounselingStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
