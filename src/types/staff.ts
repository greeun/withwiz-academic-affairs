export interface Staff {
  id: string;
  name: string;
  nameEn: string | null;
  role: string;
  department: string | null;
  phone: string | null;
  email: string | null;
  photoUrl: string | null;
  bio: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
