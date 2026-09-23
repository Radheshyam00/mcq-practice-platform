export type QuestionOption = string;

export type Question = {
  id: string;

  /**
   * MongoDB relationships
   */
  examId?: string;
  subjectId?: string;

  /**
   * Optional URL identifiers
   */
  examSlug?: string;
  subjectSlug?: string;

  question: string;

  /**
   * Exactly four options.
   *
   * 0 = A
   * 1 = B
   * 2 = C
   * 3 = D
   */
  options: [string, string, string, string];

  /**
   * Zero-based correct answer.
   *
   * A = 0
   * B = 1
   * C = 2
   * D = 3
   */
  correctAnswer: number;

  explanation: string;

  difficulty: "Easy" | "Medium" | "Hard";

  tags: string[];

  /**
   * Legacy/display fields.
   */
  exam?: string;
  subject?: string;
  topic?: string;

  isDailyQuiz?: boolean;
  isActive?: boolean;
};