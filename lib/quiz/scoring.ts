import type { Question } from "@/types/question";

export function scoreQuiz(questions: Question[], answers: Record<string, string>) {
  let correct = 0;
  let wrong = 0;
  for (const q of questions) {
    const answer = answers[q.id];
    if (!answer) continue;
    if (answer === q.correctOptionId) correct++;
    else wrong++;
  }
  const skipped = Math.max(0, questions.length - correct - wrong);
  const percentage = questions.length ? Math.round((correct / questions.length) * 100) : 0;
  return { total: questions.length, correct, wrong, skipped, score: correct, percentage };
}
