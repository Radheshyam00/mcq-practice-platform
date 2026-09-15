export type QuizResult = {
  id: string;
  examSlug?: string;
  testId?: string;
  mode: string;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  percentage: number;
  durationSeconds: number;
  completedAt: string;
};
