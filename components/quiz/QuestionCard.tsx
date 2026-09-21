"use client";

import { BookOpen, Tag } from "lucide-react";
import type { Question } from "@/types/question";

import { Badge } from "@/components/common/Badge";
import { OptionButton } from "./OptionButton";

type QuestionCardProps = {
  question: Question;
  selected?: string;
  showAnswer?: boolean;
  onSelect: (id: string) => void;
};

function getCorrectAnswerIndex(question: Question): number {
  const rawQuestion = question as {
    correctAnswer?: number;
    answerIndex?: number;
    correctOptionIndex?: number;
  };

  if (typeof rawQuestion.correctAnswer === "number") {
    return rawQuestion.correctAnswer;
  }

  if (typeof rawQuestion.answerIndex === "number") {
    return rawQuestion.answerIndex;
  }

  if (typeof rawQuestion.correctOptionIndex === "number") {
    return rawQuestion.correctOptionIndex;
  }

  return 0;
}

function getOptionText(option: unknown): string {
  if (typeof option === "string") {
    return option;
  }

  if (option && typeof option === "object") {
    const rawOption = option as {
      text?: string;
      option?: string;
      value?: string;
    };

    if (typeof rawOption.text === "string") return rawOption.text;
    if (typeof rawOption.option === "string") return rawOption.option;
    if (typeof rawOption.value === "string") return rawOption.value;
  }

  return "";
}

export function QuestionCard({
  question,
  selected,
  showAnswer = false,
  onSelect,
}: QuestionCardProps) {
  return (
    <article
      className="
        overflow-hidden rounded-3xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-shadow duration-200
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* Header */}
      <div
        className="
          border-b border-slate-200
          bg-slate-50/70
          px-5 py-4
          dark:border-slate-800
          dark:bg-slate-950/40
          sm:px-6
        "
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <Badge>{question.difficulty}</Badge>

            {showAnswer && (
              <span
                className="
                  inline-flex items-center gap-1.5 rounded-full
                  border border-slate-200
                  bg-white px-2.5 py-1
                  text-xs font-semibold text-slate-600
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-slate-300
                "
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Answer review
              </span>
            )}
          </div>

          {/* Tags */}
          {question.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag
                className="h-3.5 w-3.5 shrink-0 text-slate-400"
                aria-hidden="true"
              />

              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-full
                    bg-slate-100
                    px-2.5 py-1
                    text-xs font-medium
                    text-slate-600
                    dark:bg-slate-800
                    dark:text-slate-300
                  "
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex gap-4">
          {/* Question number indicator */}
          <div
            className="
              hidden h-9 w-9 shrink-0 items-center justify-center
              rounded-xl
              bg-indigo-50
              text-sm font-black text-indigo-600
              dark:bg-indigo-500/10
              dark:text-indigo-400
              sm:flex
            "
          >
            ?
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="
                mb-2 text-xs font-bold uppercase tracking-wider
                text-slate-400
                dark:text-slate-500
              "
            >
              Question
            </p>

            <h2
              className="
                text-lg font-bold leading-8
                text-slate-900
                dark:text-white
                sm:text-xl
              "
            >
              {question.question}
            </h2>
          </div>
        </div>

        {/* Options */}
        <div className="mt-7 space-y-3">
          {question.options.map((option, index) => {
            // MongoDB stores options as string[]. Some sources also normalize
            // them into objects with text/value fields.
            const optionId = String(index);

            // The Question model may expose the correct answer under different
            // property names depending on the source data.
            const correctAnswerIndex = getCorrectAnswerIndex(question);

            const isSelected = selected === optionId;
            const isCorrect = index === correctAnswerIndex;
            const optionText = getOptionText(option);

            return (
              <OptionButton
                key={`${question.id}-${optionId}`}
                id={optionId}
                text={optionText}
                selected={isSelected}
                correct={showAnswer && isCorrect}
                wrong={
                  showAnswer &&
                  isSelected &&
                  !isCorrect
                }
                disabled={showAnswer}
                onClick={() => onSelect(optionId)}
              />
            );
          })}
        </div>

        {/* Answer status */}
        {showAnswer && (
          <div
            className="
              mt-6 rounded-2xl
              border border-slate-200
              bg-slate-50
              px-4 py-3
              dark:border-slate-800
              dark:bg-slate-950/60
            "
          >
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Correct answer
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              Option {getCorrectAnswerIndex(question) + 1}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}