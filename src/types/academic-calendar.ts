export type AcademicEventType =
  | 'SEMESTER_START'
  | 'SEMESTER_END'
  | 'EXAM'
  | 'VACATION'
  | 'HOLIDAY'
  | 'EVENT'
  | 'FIELD_TRIP'
  | 'PARENT_MEETING'
  | 'OTHER';

export interface Timetable {
  id: string;
  title: string;
  year: number;
  semester: number;
  schoolLevel: string;
  fileUrl: string | null;
  content: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AcademicEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date | null;
  type: AcademicEventType;
  schoolLevel: string | null;
  description: string | null;
  isAllDay: boolean;
  color: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
