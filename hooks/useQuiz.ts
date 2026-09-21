"use client";

import { useMemo, useState } from "react";

import type { Question } from "@/types/question";
import { scoreQuiz } from "@/lib/quiz/scoring";

export function useQuiz(questions: Question[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Stores option index as a string:
  // "0" = first option
  // "1" = second option
  // "2" = third option
  // "3" = fourth option
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [marked, setMarked] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const current = questions[currentIndex];

  const choose = (optionId: string) => {
    if (!submitted && current) {
      setAnswers((prev) => ({
        ...prev,
        [current.id]: optionId,
      }));
    }
  };

  const toggleMark = () => {
    if (!current || submitted) return;

    setMarked((prev) =>
      prev.includes(current.id)
        ? prev.filter((id) => id !== current.id)
        : [...prev, current.id]
    );
  };

  const result = useMemo(() => {
    return scoreQuiz(questions, answers);
  }, [questions, answers]);

  const next = () => {
    setCurrentIndex((index) =>
      Math.min(index + 1, Math.max(questions.length - 1, 0))
    );
  };

  const previous = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  const goTo = (index: number) => {
    setCurrentIndex(
      Math.max(0, Math.min(index, Math.max(questions.length - 1, 0)))
    );
  };

  const submit = () => {
    if (submitted) return;

    setSubmitted(true);
  };

  return {
    current,
    currentIndex,
    answers,
    marked,
    submitted,
    result,

    choose,
    toggleMark,

    next,
    previous,
    goTo,
    submit,
  };
}