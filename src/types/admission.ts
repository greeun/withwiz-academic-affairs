export type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'ATTENDED';

export interface AdmissionSession {
  id: string;
  title: string;
  date: Date;
  location: string | null;
  capacity: number;
  description: string | null;
  isOpen: boolean;
  registrations?: AdmissionRegistration[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdmissionRegistration {
  id: string;
  sessionId: string;
  applicantName: string;
  phone: string;
  email: string | null;
  studentName: string;
  studentGrade: string | null;
  message: string | null;
  status: RegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
}
