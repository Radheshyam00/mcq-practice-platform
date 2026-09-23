"use client";

import {
  useMemo,
  useState,
} from "react";

import type { Question } from "@/types/question";
import { scoreQuiz } from "@/lib/quiz/scoring";

export function useQuiz(
  questions: Question[]
) {
  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  /*
   * Answers are stored as strings because
   * QuestionCard sends option IDs as strings.
   *
   * "0" = A
   * "1" = B
   * "2" = C
   * "3" = D
   */
  const [
    answers,
    setAnswers,
  ] = useState<Record<string, string>>(
    {}
  );

  const [
    marked,
    setMarked,
  ] = useState<string[]>([]);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const current =
    questions[currentIndex];

  const choose = (
    optionId: string
  ) => {
    if (
      submitted ||
      !current
    ) {
      return;
    }

    const index =
      Number(optionId);

    /*
     * Only A/B/C/D are valid.
     */
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index > 3
    ) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [current.id]:
        String(index),
    }));
  };

  const toggleMark = () => {
    if (
      !current ||
      submitted
    ) {
      return;
    }

    setMarked((prev) =>
      prev.includes(current.id)
        ? prev.filter(
            (id) =>
              id !== current.id
          )
        : [
            ...prev,
            current.id,
          ]
    );
  };

  const result = useMemo(
    () =>
      scoreQuiz(
        questions,
        answers
      ),
    [questions, answers]
  );

  const next = () => {
    setCurrentIndex(
      (index) =>
        Math.min(
          index + 1,
          Math.max(
            questions.length - 1,
            0
          )
        )
    );
  };

  const previous = () => {
    setCurrentIndex(
      (index) =>
        Math.max(
          index - 1,
          0
        )
    );
  };

  const goTo = (
    index: number
  ) => {
    setCurrentIndex(
      Math.max(
        0,
        Math.min(
          index,
          Math.max(
            questions.length - 1,
            0
          )
        )
      )
    );
  };

  const submit = () => {
    if (submitted) {
      return;
    }

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