import type { Question } from "@/types/question";
import type { QuizState } from "@/types/quiz";
import { scoreQuiz } from "./scoring";

export function createQuizState(questions: Question[], timeLeft: number, mode: QuizState["mode"]): QuizState {
  return {
    questions,
    currentIndex: 0,
    answers: {},
    marked: [],
    timeLeft,
    mode,
    submitted: false
  };
}

export function calculateResult(state: QuizState) {
  return scoreQuiz(state.questions, state.answers);
}
