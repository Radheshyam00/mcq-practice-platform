"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flag,
  RotateCcw,
  Trophy,
} from "lucide-react";

import type { Question } from "@/types/question";
import { useQuiz } from "@/hooks/useQuiz";

type QuizContainerProps = {
  questions: Question[];
  mode?: "practice" | "mock-test" | "daily";
  examSlug?: string;
  subjectSlug?: string;
  title?: string;
  timeLimit?: number;
};

function getQuestionId(question: Question): string {
  return String(question.id);
}

/**
 * Canonical answer mapping:
 *
 * A = 0
 * B = 1
 * C = 2
 * D = 3
 */
function getCorrectAnswerIndex(question: Question): number {
  const value = Number(question.correctAnswer);

  if (
    !Number.isInteger(value) ||
    value < 0 ||
    value > 3
  ) {
    return -1;
  }

  return value;
}

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(
    0,
    Math.floor(seconds)
  );

  const minutes = Math.floor(
    safeSeconds / 60
  );

  const remainingSeconds =
    safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

export default function QuizContainer({
  questions,
  mode = "practice",
  examSlug,
  subjectSlug,
  title = "Quiz",
  timeLimit,
}: QuizContainerProps) {
  const router = useRouter();

  const validQuestions = useMemo(
    () =>
      Array.isArray(questions)
        ? questions.filter(Boolean)
        : [],
    [questions]
  );

  const quiz = useQuiz(validQuestions);

  const {
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
  } = quiz;

  const [timeLeft, setTimeLeft] = useState(
    typeof timeLimit === "number"
      ? Math.max(0, timeLimit)
      : 0
  );

  const [hasSubmittedResult, setHasSubmittedResult] =
    useState(false);

  const [savingResult, setSavingResult] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  /**
   * Reset timer when the question set or time
   * limit changes.
   */
  useEffect(() => {
    if (
      typeof timeLimit === "number" &&
      Number.isFinite(timeLimit)
    ) {
      setTimeLeft(
        Math.max(0, Math.floor(timeLimit))
      );
    } else {
      setTimeLeft(0);
    }
  }, [timeLimit, validQuestions.length]);

  /**
   * Countdown timer.
   *
   * Timer is only active when:
   * - a time limit exists
   * - quiz has not been submitted
   * - there are questions
   */
  useEffect(() => {
    if (
      typeof timeLimit !== "number" ||
      !Number.isFinite(timeLimit) ||
      timeLimit <= 0 ||
      submitted ||
      validQuestions.length === 0
    ) {
      return;
    }

    if (timeLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    timeLimit,
    timeLeft,
    submitted,
    validQuestions.length,
  ]);

  /**
   * Automatically submit when timer reaches zero.
   */
  useEffect(() => {
    if (
      typeof timeLimit !== "number" ||
      timeLimit <= 0 ||
      timeLeft !== 0 ||
      submitted ||
      validQuestions.length === 0
    ) {
      return;
    }

    submit();
  }, [
    timeLimit,
    timeLeft,
    submitted,
    validQuestions.length,
    submit,
  ]);

  /**
   * Save result after quiz submission.
   *
   * The API receives numeric zero-based answer
   * indexes.
   */
  useEffect(() => {
    if (
      !submitted ||
      hasSubmittedResult ||
      validQuestions.length === 0
    ) {
      return;
    }

    let cancelled = false;

    async function saveResult() {
      try {
        setSavingResult(true);
        setSaveError("");

        const normalizedAnswers: Record<
          string,
          number
        > = {};

        for (const question of validQuestions) {
          const questionId =
            getQuestionId(question);

          const answer = answers[questionId];

          if (
            answer === undefined ||
            answer === null ||
            answer === ""
          ) {
            continue;
          }

          const answerIndex = Number(answer);

          if (
            Number.isInteger(answerIndex) &&
            answerIndex >= 0 &&
            answerIndex <= 3
          ) {
            normalizedAnswers[questionId] =
              answerIndex;
          }
        }

        const correctCount =
          validQuestions.reduce(
            (count, question) => {
              const questionId =
                getQuestionId(question);

              const selected =
                normalizedAnswers[questionId];

              const correct =
                getCorrectAnswerIndex(
                  question
                );

              if (
                selected !== undefined &&
                correct >= 0 &&
                selected === correct
              ) {
                return count + 1;
              }

              return count;
            },
            0
          );

        const total =
          validQuestions.length;

        const percentage =
          total > 0
            ? Math.round(
                (correctCount / total) * 100
              )
            : 0;

        const unanswered =
          total -
          Object.keys(normalizedAnswers)
            .length;

        const payload = {
          examSlug: examSlug || "",
          subjectSlug: subjectSlug || "",
          mode,
          title,
          totalQuestions: total,
          attemptedQuestions:
            Object.keys(normalizedAnswers)
              .length,
          unansweredQuestions: unanswered,
          correctAnswers: correctCount,
          incorrectAnswers:
            Object.keys(normalizedAnswers)
              .filter((questionId) => {
                const question =
                  validQuestions.find(
                    (item) =>
                      getQuestionId(item) ===
                      questionId
                  );

                if (!question) {
                  return false;
                }

                return (
                  normalizedAnswers[
                    questionId
                  ] !==
                  getCorrectAnswerIndex(
                    question
                  )
                );
              }).length,
          percentage,
          answers: normalizedAnswers,
        };

        const response = await fetch(
          "/api/results",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const data =
            await response.json().catch(
              () => null
            );

          throw new Error(
            data?.error ||
              data?.message ||
              "Failed to save quiz result."
          );
        }

        if (!cancelled) {
          setHasSubmittedResult(true);
        }
      } catch (error) {
        console.error(
          "Failed to save quiz result:",
          error
        );

        if (!cancelled) {
          setSaveError(
            error instanceof Error
              ? error.message
              : "Failed to save quiz result."
          );
        }
      } finally {
        if (!cancelled) {
          setSavingResult(false);
        }
      }
    }

    saveResult();

    return () => {
      cancelled = true;
    };
  }, [
    submitted,
    hasSubmittedResult,
    validQuestions,
    answers,
    examSlug,
    subjectSlug,
    mode,
    title,
  ]);

  /**
   * No questions.
   */
  if (validQuestions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <CheckCircle2 className="h-7 w-7 text-slate-500" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            No questions available
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            There are no questions available for
            this quiz.
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /**
   * Submitted result screen.
   */
  if (submitted) {
    const total =
      validQuestions.length;

    const answeredCount =
      Object.keys(answers).filter(
        (questionId) => {
          const value =
            Number(answers[questionId]);

          return (
            Number.isInteger(value) &&
            value >= 0 &&
            value <= 3
          );
        }
      ).length;

    const correctCount =
      validQuestions.reduce(
        (count, question) => {
          const questionId =
            getQuestionId(question);

          const selected =
            Number(answers[questionId]);

          const correct =
            getCorrectAnswerIndex(
              question
            );

          if (
            Number.isInteger(selected) &&
            selected >= 0 &&
            selected <= 3 &&
            correct >= 0 &&
            selected === correct
          ) {
            return count + 1;
          }

          return count;
        },
        0
      );

    const incorrectCount =
      Math.max(
        0,
        answeredCount - correctCount
      );

    const unansweredCount =
      Math.max(
        0,
        total - answeredCount
      );

    const percentage =
      total > 0
        ? Math.round(
            (correctCount / total) * 100
          )
        : 0;

    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="bg-slate-900 px-6 py-10 text-center text-white sm:px-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <Trophy className="h-8 w-8" />
            </div>

            <p className="text-sm font-medium text-slate-300">
              Quiz completed
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              {title}
            </h1>

            <div className="mt-6 text-5xl font-black">
              {percentage}%
            </div>

            <p className="mt-2 text-sm text-slate-300">
              {correctCount} of {total}{" "}
              questions correct
            </p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y border-b border-slate-200 dark:divide-slate-800 dark:border-slate-800 sm:grid-cols-4 sm:divide-y-0">
            <div className="p-5 text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {total}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Total
              </p>
            </div>

            <div className="p-5 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {correctCount}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Correct
              </p>
            </div>

            <div className="p-5 text-center">
              <p className="text-2xl font-bold text-red-600">
                {incorrectCount}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Incorrect
              </p>
            </div>

            <div className="p-5 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {unansweredCount}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Unanswered
              </p>
            </div>
          </div>

          {savingResult && (
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-3 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              Saving your result...
            </div>
          )}

          {saveError && (
            <div className="border-b border-red-200 bg-red-50 px-6 py-3 text-center text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {saveError}
            </div>
          )}

          <div className="flex flex-col gap-3 p-6 sm:flex-row sm:justify-center sm:p-8">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/exams/${
                    examSlug || ""
                  }/result`
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              View Result
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>

        {/* Question review */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Question Review
          </h2>

          {validQuestions.map(
            (question, index) => {
              const questionId =
                getQuestionId(question);

              const selected =
                answers[questionId];

              const selectedIndex =
                selected === undefined
                  ? -1
                  : Number(selected);

              const correctIndex =
                getCorrectAnswerIndex(
                  question
                );

              const answered =
                Number.isInteger(
                  selectedIndex
                ) &&
                selectedIndex >= 0 &&
                selectedIndex <= 3;

              const isCorrect =
                answered &&
                selectedIndex ===
                  correctIndex;

              return (
                <div
                  key={questionId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-6 text-slate-900 dark:text-white">
                        {question.question}
                      </p>

                      <div className="mt-4 space-y-2">
                        {question.options.map(
                          (option, optionIndex) => {
                            const isSelected =
                              selectedIndex ===
                              optionIndex;

                            const isAnswer =
                              correctIndex ===
                              optionIndex;

                            let classes =
                              "border-slate-200 dark:border-slate-700";

                            if (
                              isAnswer
                            ) {
                              classes =
                                "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/30";
                            } else if (
                              isSelected
                            ) {
                              classes =
                                "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/30";
                            }

                            return (
                              <div
                                key={`${questionId}-${optionIndex}`}
                                className={`rounded-xl border p-3 ${classes}`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="font-bold text-slate-500">
                                    {String.fromCharCode(
                                      65 +
                                        optionIndex
                                    )}
                                    .
                                  </span>

                                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                                    {option}
                                  </span>

                                  {isAnswer && (
                                    <span className="text-xs font-semibold text-emerald-600">
                                      Correct
                                    </span>
                                  )}

                                  {isSelected &&
                                    !isAnswer && (
                                      <span className="text-xs font-semibold text-red-600">
                                        Your answer
                                      </span>
                                    )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>

                      {question.explanation && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Explanation
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
                            {question.explanation}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 text-sm font-medium">
                        {isCorrect ? (
                          <span className="text-emerald-600">
                            ✓ Correct answer
                          </span>
                        ) : answered ? (
                          <span className="text-red-600">
                            ✕ Incorrect answer
                          </span>
                        ) : (
                          <span className="text-amber-600">
                            Not answered
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }

  if (!current) {
    return null;
  }

  const currentQuestionId =
    getQuestionId(current);

  const selectedAnswer =
    answers[currentQuestionId];

  const answeredCount =
    Object.keys(answers).filter(
      (questionId) => {
        const value =
          Number(answers[questionId]);

        return (
          Number.isInteger(value) &&
          value >= 0 &&
          value <= 3
        );
      }
    ).length;

  const progress =
    validQuestions.length > 0
      ? Math.round(
          ((currentIndex + 1) /
            validQuestions.length) *
            100
        )
      : 0;

  const isMarked =
    marked.includes(currentQuestionId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {mode === "mock-test"
                ? "Mock Test"
                : mode === "daily"
                  ? "Daily Quiz"
                  : "Practice"}
            </p>

            <h1 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h1>
          </div>

          {typeof timeLimit ===
            "number" &&
            timeLimit > 0 && (
              <div
                className={`rounded-xl px-4 py-2 text-center font-mono text-lg font-bold ${
                  timeLeft <= 60
                    ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                    : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
            )}
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>
              Question {currentIndex + 1} of{" "}
              {validQuestions.length}
            </span>

            <span>
              {answeredCount}/
              {validQuestions.length} answered
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-slate-900 transition-all duration-300 dark:bg-white"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Question */}
        <main>
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                    {currentIndex + 1}
                  </span>

                  <h2 className="text-lg font-bold leading-7 text-slate-900 dark:text-white sm:text-xl">
                    {current.question}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={toggleMark}
                  aria-label={
                    isMarked
                      ? "Remove bookmark"
                      : "Mark question"
                  }
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                    isMarked
                      ? "border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <Flag
                    className="h-4 w-4"
                    fill={
                      isMarked
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              {/* Options */}
              <div className="mt-7 space-y-3">
                {current.options.map(
                  (option, index) => {
                    const optionId =
                      String(index);

                    const isSelected =
                      selectedAnswer ===
                      optionId;

                    return (
                      <button
                        key={`${currentQuestionId}-${index}`}
                        type="button"
                        onClick={() =>
                          choose(optionId)
                        }
                        className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 dark:border-white dark:bg-slate-800 dark:ring-white/10"
                            : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition ${
                            isSelected
                              ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                              : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                        </span>

                        <span
                          className={`pt-1 text-sm font-medium leading-6 ${
                            isSelected
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {option}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              {/* Navigation */}
              <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={previous}
                  disabled={
                    currentIndex === 0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                {currentIndex <
                validQuestions.length -
                  1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Question navigator */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Questions
              </h3>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                {answeredCount}/
                {validQuestions.length}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-5">
              {validQuestions.map(
                (question, index) => {
                  const questionId =
                    getQuestionId(
                      question
                    );

                  const answer =
                    answers[questionId];

                  const isAnswered =
                    answer !== undefined &&
                    answer !== "" &&
                    Number.isInteger(
                      Number(answer)
                    ) &&
                    Number(answer) >= 0 &&
                    Number(answer) <= 3;

                  const isCurrent =
                    currentIndex === index;

                  const isQuestionMarked =
                    marked.includes(
                      questionId
                    );

                  return (
                    <button
                      key={questionId}
                      type="button"
                      onClick={() =>
                        goTo(index)
                      }
                      title={`Question ${
                        index + 1
                      }`}
                      className={`relative flex h-10 items-center justify-center rounded-lg text-xs font-bold transition ${
                        isCurrent
                          ? "bg-slate-900 text-white ring-2 ring-slate-900/20 dark:bg-white dark:text-slate-900 dark:ring-white/20"
                          : isAnswered
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {index + 1}

                      {isQuestionMarked && (
                        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </button>
                  );
                }
              )}
            </div>

            <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-xs dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="h-3 w-3 rounded bg-emerald-100 dark:bg-emerald-950/40" />
                Answered
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="h-3 w-3 rounded bg-slate-100 dark:bg-slate-800" />
                Not answered
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="h-3 w-3 rounded bg-slate-900 dark:bg-white" />
                Current
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                Marked
              </div>
            </div>

            <button
              type="button"
              onClick={submit}
              className="mt-5 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
            >
              Submit Quiz
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}