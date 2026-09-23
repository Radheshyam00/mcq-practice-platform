import type { Question } from "@/types/question";

export type QuizScore = {
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  percentage: number;
};

export function scoreQuiz(
  questions: Question[],
  answers: Record<string, string>
): QuizScore {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  for (const question of questions) {
    const answer =
      answers[question.id];

    /*
     * No answer.
     */
    if (
      answer === undefined ||
      answer === null ||
      answer === ""
    ) {
      skipped++;
      continue;
    }

    const selectedIndex =
      Number(answer);

    const correctAnswer =
      Number(
        question.correctAnswer
      );

    /*
     * Invalid stored answer.
     */
    if (
      !Number.isInteger(
        selectedIndex
      ) ||
      selectedIndex < 0 ||
      selectedIndex > 3
    ) {
      wrong++;
      continue;
    }

    /*
     * Canonical comparison:
     *
     * selectedIndex === correctAnswer
     */
    if (
      selectedIndex ===
      correctAnswer
    ) {
      correct++;
    } else {
      wrong++;
    }
  }

  const total =
    questions.length;

  const percentage =
    total > 0
      ? Math.round(
          (correct / total) *
            100
        )
      : 0;

  return {
    correct,
    wrong,
    skipped,
    total,
    percentage,
  };
}