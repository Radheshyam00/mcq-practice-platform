export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  examSlug: string;
  subjectSlug: string;
  question: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
};
