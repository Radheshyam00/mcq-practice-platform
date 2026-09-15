"use client";
import { useMemo, useState } from "react";
import type { Question } from "@/types/question";
import { scoreQuiz } from "@/lib/quiz/scoring";

export function useQuiz(questions: Question[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const current = questions[currentIndex];

  const choose = (optionId: string) => {
    if (!submitted && current) setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
  };

  const toggleMark = () => {
    if (!current) return;
    setMarked((prev) => prev.includes(current.id) ? prev.filter((id) => id !== current.id) : [...prev, current.id]);
  };

  const result = useMemo(() => scoreQuiz(questions, answers), [questions, answers]);

  return {
    current,
    currentIndex,
    answers,
    marked,
    submitted,
    result,
    choose,
    toggleMark,
    next: () => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1)),
    previous: () => setCurrentIndex((i) => Math.max(i - 1, 0)),
    goTo: (i: number) => setCurrentIndex(Math.max(0, Math.min(i, questions.length - 1))),
    submit: () => setSubmitted(true)
  };
}
