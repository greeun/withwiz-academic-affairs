export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_LEAVE' | 'EXCUSED';

export interface Attendance {
  id: string;
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  reason: string | null;
  createdAt: Date;
}
