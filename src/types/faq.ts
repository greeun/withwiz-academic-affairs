export interface FaqCategory {
  id: string;
  name: string;
  order: number;
  faqs?: Faq[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  categoryId: string | null;
  category?: FaqCategory | null;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
