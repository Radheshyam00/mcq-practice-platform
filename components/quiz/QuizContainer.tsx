"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flag,
  ListChecks,
  Send,
} from "lucide-react";

import { useQuiz } from "@/hooks/useQuiz";
import { useTimer } from "@/hooks/useTimer";

import { QuestionCard } from "./QuestionCard";
import { QuestionNumber } from "./QuestionNumber";
import { QuizProgress } from "./QuizProgress";
import { QuizTimer } from "./QuizTimer";
import { Explanation } from "./Explanation";
import { QuizResult } from "./QuizResult";

import { Button } from "@/components/common/Button";
import type { Question } from "@/types/question";

type QuizContainerProps = {
  questions: Question[];
  durationMinutes?: number;

  examId?: string;
  examName?: string;

  resultType?: "practice" | "mock-test" | "daily-quiz";
};

export function QuizContainer({
  questions,
  durationMinutes = 30,
  examId,
  examName,
  resultType = "practice",
}: QuizContainerProps) {
  const quiz = useQuiz(questions);

  /*
   * Prevent duplicate result submissions.
   */
  const resultSaved = useRef(false);

  /*
   * Store the starting time.
   *
   * This allows us to calculate the actual time taken.
   */
  const startTimeRef = useRef<number>(Date.now());

  /*
   * Timer finish
   */
  const finish = useCallback(() => {
    quiz.submit();
  }, [quiz]);

  const timer = useTimer(
    durationMinutes * 60,
    !quiz.submitted,
    finish
  );

  /*
   * Save result after quiz is submitted.
   */
  useEffect(() => {
    if (!quiz.submitted) {
      return;
    }

    /*
     * Don't save more than once.
     */
    if (resultSaved.current) {
      return;
    }

    /*
     * examId is required by Result model.
     */
    if (!examId) {
      console.error(
        "RESULT NOT SAVED: examId is missing."
      );

      return;
    }

    resultSaved.current = true;

    const saveResult = async () => {
      try {
        /*
         * Count answered questions.
         */
        const answeredCount = questions.filter(
          (question) => {
            const answer =
              quiz.answers[question.id];

            return (
              answer !== undefined &&
              answer !== null &&
              answer !== ""
            );
          }
        ).length;

        /*
         * Calculate correct answers.
         *
         * New MongoDB question structure:
         *
         * options: string[]
         * correctAnswer: number
         *
         * Answers from QuestionCard are expected
         * to be "0", "1", "2", or "3".
         */
        const getCorrectAnswerIndex = (
          item: Question
        ): number => {
          const rawQuestion = item as {
            correctAnswer?: number;
            answerIndex?: number;
            correctOptionIndex?: number;
          };

          if (
            typeof rawQuestion.correctAnswer === "number"
          ) {
            return rawQuestion.correctAnswer;
          }

          if (
            typeof rawQuestion.answerIndex === "number"
          ) {
            return rawQuestion.answerIndex;
          }

          if (
            typeof rawQuestion.correctOptionIndex === "number"
          ) {
            return rawQuestion.correctOptionIndex;
          }

          return -1;
        };

        let correct = 0;

        questions.forEach((question) => {
          const answer =
            quiz.answers[question.id];

          if (
            answer === undefined ||
            answer === null ||
            answer === ""
          ) {
            return;
          }

          const selectedIndex = Number(answer);
          const correctAnswerIndex =
            getCorrectAnswerIndex(question);

          if (
            !Number.isNaN(selectedIndex) &&
            selectedIndex === correctAnswerIndex
          ) {
            correct++;
          }
        });

        const totalQuestions =
          questions.length;

        const wrong =
          answeredCount - correct;

        const skipped =
          totalQuestions - answeredCount;

        /*
         * Calculate actual time taken.
         */
        const elapsedSeconds = Math.floor(
          (Date.now() - startTimeRef.current) /
            1000
        );

        /*
         * Never allow time to exceed the quiz duration.
         */
        const timeTakenSeconds = Math.min(
          elapsedSeconds,
          durationMinutes * 60
        );

        /*
         * Send result to MongoDB API.
         */
        const response = await fetch(
          "/api/results",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              examId,
              examName,
              correct,
              wrong,
              skipped,
              totalQuestions,
              timeTakenSeconds,
              type: resultType,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          console.error(
            "FAILED TO SAVE RESULT:",
            data.message || data
          );

          /*
           * Allow another save attempt.
           */
          resultSaved.current = false;

          return;
        }

        console.log(
          "RESULT SAVED SUCCESSFULLY:",
          data.result
        );
      } catch (error) {
        console.error(
          "ERROR SAVING RESULT:",
          error
        );

        /*
         * Allow retry if request failed.
         */
        resultSaved.current = false;
      }
    };

    saveResult();
  }, [
    quiz.submitted,
    quiz.answers,
    questions,
    examId,
    examName,
    resultType,
    durationMinutes,
  ]);

  /*
   * No questions
   */
  if (!questions.length) {
    return (
      <div
        className="
          mx-auto max-w-2xl rounded-3xl
          border border-slate-200
          bg-white
          p-8 text-center
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div
          className="
            mx-auto flex h-14 w-14 items-center justify-center
            rounded-2xl
            bg-slate-100
            text-slate-500
            dark:bg-slate-800
            dark:text-slate-400
          "
        >
          <ListChecks
            className="h-7 w-7"
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          No questions available
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          There are currently no questions available
          for this quiz. Please try again later.
        </p>
      </div>
    );
  }

  /*
   * Quiz submitted
   */
  if (quiz.submitted) {
    return (
      <QuizResult result={quiz.result} />
    );
  }

  const currentQuestion = quiz.current;

  const currentAnswer =
    quiz.answers[currentQuestion.id];

  const isMarked = quiz.marked.includes(
    currentQuestion.id
  );

  const isFirstQuestion =
    quiz.currentIndex === 0;

  const isLastQuestion =
    quiz.currentIndex ===
    questions.length - 1;

  const answeredCount = questions.filter(
    (question) => {
      const answer =
        quiz.answers[question.id];

      return (
        answer !== undefined &&
        answer !== null &&
        answer !== ""
      );
    }
  ).length;

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Top quiz header */}
      <div
        className="
          mb-5 overflow-hidden rounded-3xl
          border border-slate-200
          bg-white
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                bg-indigo-50
                text-indigo-600
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <ListChecks
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Quiz in progress
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                Question{" "}
                {quiz.currentIndex + 1} of{" "}
                {questions.length}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div
            className="
              flex items-center justify-between gap-3
              rounded-2xl
              border border-slate-200
              bg-slate-50
              px-3 py-2
              dark:border-slate-700
              dark:bg-slate-950
            "
          >
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Time remaining
            </span>

            <QuizTimer
              seconds={timer.seconds}
            />
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Main quiz area */}
        <main className="min-w-0">
          {/* Question controls */}
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <QuestionNumber
              number={quiz.currentIndex + 1}
              total={questions.length}
            />

            <div
              className="
                flex items-center gap-2
                self-start
                rounded-xl
                border border-slate-200
                bg-white
                px-3 py-2
                text-xs font-semibold
                text-slate-600
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-300
              "
            >
              <CheckCircle2
                className="h-4 w-4 text-emerald-500"
                aria-hidden="true"
              />

              {answeredCount} answered
            </div>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <QuizProgress
              current={quiz.currentIndex}
              total={questions.length}
            />
          </div>

          {/* Question */}
          <QuestionCard
            question={currentQuestion}
            selected={currentAnswer}
            onSelect={quiz.choose}
          />

          {/* Explanation */}
          {currentAnswer !== undefined &&
            currentAnswer !== "" && (
              <Explanation
                text={currentQuestion.explanation}
              />
            )}

          {/* Bottom navigation */}
          <div
            className="
              mt-5 rounded-3xl
              border border-slate-200
              bg-white
              p-4
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
              sm:p-5
            "
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Previous */}
              <Button
                variant="outline"
                disabled={isFirstQuestion}
                onClick={quiz.previous}
              >
                <ChevronLeft
                  className="mr-1 h-4 w-4"
                  aria-hidden="true"
                />

                Previous
              </Button>

              {/* Actions */}
              <div className="flex w-full gap-2 sm:w-auto">
                <Button
                  variant="outline"
                  onClick={quiz.toggleMark}
                  className="flex-1 sm:flex-none"
                >
                  <Flag
                    className="mr-1.5 h-4 w-4"
                    fill={
                      isMarked
                        ? "currentColor"
                        : "none"
                    }
                    aria-hidden="true"
                  />

                  {isMarked
                    ? "Unmark"
                    : "Mark"}
                </Button>

                {isLastQuestion ? (
                  <Button
                    variant="danger"
                    onClick={quiz.submit}
                    className="flex-1 sm:flex-none"
                  >
                    <Send
                      className="mr-1.5 h-4 w-4"
                      aria-hidden="true"
                    />

                    Submit
                  </Button>
                ) : (
                  <Button
                    onClick={quiz.next}
                    className="flex-1 sm:flex-none"
                  >
                    Next

                    <ChevronRight
                      className="ml-1 h-4 w-4"
                      aria-hidden="true"
                    />
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile progress */}
            <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800 sm:hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {answeredCount} of{" "}
                  {questions.length} answered
                </span>

                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {Math.round(
                    (answeredCount /
                      questions.length) *
                      100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Desktop question palette */}
        <aside className="hidden lg:block">
          <div
            className="
              sticky top-5 overflow-hidden rounded-3xl
              border border-slate-200
              bg-white
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                border-b border-slate-200
                bg-slate-50/70
                px-5 py-4
                dark:border-slate-800
                dark:bg-slate-950/40
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Questions
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {answeredCount}/
                    {questions.length} answered
                  </p>
                </div>

                <div
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-xl
                    bg-indigo-50
                    text-xs font-black text-indigo-600
                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                  "
                >
                  {questions.length}
                </div>
              </div>
            </div>

            <div className="px-5 pt-5">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500"
                  style={{
                    width: `${
                      questions.length > 0
                        ? (answeredCount /
                            questions.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-5 gap-2">
                {questions.map(
                  (question, index) => {
                    const isCurrent =
                      index ===
                      quiz.currentIndex;

                    const answer =
                      quiz.answers[
                        question.id
                      ];

                    const isAnswered =
                      answer !== undefined &&
                      answer !== null &&
                      answer !== "";

                    const questionMarked =
                      quiz.marked.includes(
                        question.id
                      );

                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() =>
                          quiz.goTo(index)
                        }
                        aria-label={`Go to question ${
                          index + 1
                        }${
                          isAnswered
                            ? ", answered"
                            : ", unanswered"
                        }${
                          questionMarked
                            ? ", marked for review"
                            : ""
                        }`}
                        aria-current={
                          isCurrent
                            ? "step"
                            : undefined
                        }
                        className={`
                          relative flex aspect-square
                          items-center justify-center
                          rounded-xl border
                          text-sm font-bold
                          transition-all duration-200
                          focus:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-indigo-500
                          focus-visible:ring-offset-2
                          dark:focus-visible:ring-offset-slate-900

                          ${
                            isCurrent
                              ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-500"
                              : isAnswered
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
                                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:bg-indigo-950/30"
                          }
                        `}
                      >
                        {index + 1}

                        {isAnswered &&
                          !isCurrent && (
                            <CheckCircle2
                              className="
                                absolute -right-1 -top-1
                                h-4 w-4
                                rounded-full
                                bg-white
                                text-emerald-500
                                dark:bg-slate-900
                              "
                              aria-hidden="true"
                            />
                          )}

                        {questionMarked && (
                          <span
                            className="
                              absolute -bottom-1 -right-1
                              flex h-4 w-4
                              items-center justify-center
                              rounded-full
                              bg-amber-500
                              text-white
                              ring-2 ring-white
                              dark:ring-slate-900
                            "
                          >
                            <Flag
                              className="h-2.5 w-2.5"
                              fill="currentColor"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div
              className="
                border-t border-slate-200
                bg-slate-50/50
                px-5 py-4
                dark:border-slate-800
                dark:bg-slate-950/30
              "
            >
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <Legend
                  className="bg-indigo-600 dark:bg-indigo-500"
                  label="Current"
                />

                <Legend
                  className="border border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30"
                  label="Answered"
                />

                <Legend
                  className="border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                  label="Unanswered"
                />

                <Legend
                  className="bg-amber-500"
                  label="Marked"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Legend({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-3 w-3 shrink-0 rounded-full ${className}`}
      />

      <span className="font-medium text-slate-600 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
}