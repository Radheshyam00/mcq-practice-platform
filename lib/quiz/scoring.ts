import type { Question } from "@/types/question";

export interface QuizResult {
  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  percentage: number;
}

export function scoreQuiz(
  questions: Question[],
  answers: Record<string, string>
): QuizResult {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  for (const question of questions) {
    const answer = answers[question.id];

    // No answer selected
    if (answer === undefined || answer === null || answer === "") {
      skipped++;
      continue;
    }

    const selectedIndex = Number(answer);
    const correctAnswer = Number(
      (question as { correctAnswer?: number | string }).correctAnswer
    );

    // Selected answer is correct
    if (
      !Number.isNaN(selectedIndex) &&
      !Number.isNaN(correctAnswer) &&
      selectedIndex === correctAnswer
    ) {
      correct++;
    } else {
      wrong++;
    }
  }

  const total = questions.length;

  const percentage =
    total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    score: correct,
    correct,
    wrong,
    skipped,
    total,
    percentage,
  };
}