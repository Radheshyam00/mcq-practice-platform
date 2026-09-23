export type QuestionOption = {
  id: string;
  text: string;
};

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export type Question = {
  id: string;

  examSlug: string;
  subjectSlug: string;

  question: string;

  options: QuestionOption[];

  correctOptionId: string;

  explanation: string;

  difficulty: QuestionDifficulty;

  tags: string[];
};