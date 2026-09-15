export type Exam = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: string;
  icon: string;
  subjects: string[];
  totalQuestions: number;
  durationMinutes: number;
  color: string;
};
