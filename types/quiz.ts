import type { Question } from "./question";

export type QuizMode = "practice" | "mock-test" | "daily";

export type QuizState = {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  marked: string[];
  timeLeft: number;
  mode: QuizMode;
  submitted: boolean;
};
