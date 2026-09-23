"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  Edit3,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type Subject = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

type Exam = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  subjects: Subject[];
  durationMinutes?: number;
  isActive?: boolean;
};

type Question = {
  _id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subjectId: string;
  examId?: string;
  topic?: string;
  isDailyQuiz?: boolean;
  isActive?: boolean;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  exam?: Exam;
  questions?: Question[];
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function normalizeCorrectAnswer(
  value: unknown
): number {
  const parsed = Number(value);

  if (
    Number.isInteger(parsed) &&
    parsed >= 0 &&
    parsed <= 3
  ) {
    return parsed;
  }

  return 0;
}

function normalizeQuestion(
  question: any
): Question {
  const rawOptions = Array.isArray(
    question?.options
  )
    ? question.options
    : [];

  const options = [
    String(rawOptions[0] ?? ""),
    String(rawOptions[1] ?? ""),
    String(rawOptions[2] ?? ""),
    String(rawOptions[3] ?? ""),
  ] as [
    string,
    string,
    string,
    string
  ];

  return {
    _id: String(question?._id ?? ""),

    question: String(
      question?.question ?? ""
    ),

    options,

    correctAnswer:
      normalizeCorrectAnswer(
        question?.correctAnswer
      ),

    explanation:
      question?.explanation
        ? String(question.explanation)
        : "",

    difficulty:
      question?.difficulty === "Easy" ||
      question?.difficulty === "Hard"
        ? question.difficulty
        : "Medium",

    subjectId: String(
      question?.subjectId ?? ""
    ),

    examId: question?.examId
      ? String(question.examId)
      : undefined,

    topic: question?.topic
      ? String(question.topic)
      : "",

    isDailyQuiz:
      question?.isDailyQuiz === true,

    isActive:
      question?.isActive !== false,
  };
}

function normalizeExam(
  exam: any
): Exam {
  return {
    _id: String(exam?._id ?? ""),

    name: String(
      exam?.name ?? ""
    ),

    slug: String(
      exam?.slug ?? ""
    ),

    description: String(
      exam?.description ?? ""
    ),

    durationMinutes:
      Number(exam?.durationMinutes) > 0
        ? Number(exam.durationMinutes)
        : 60,

    isActive:
      exam?.isActive !== false,

    subjects:
      Array.isArray(exam?.subjects)
        ? exam.subjects.map(
            (subject: any) => ({
              _id: String(
                subject?._id ?? ""
              ),

              name: String(
                subject?.name ?? ""
              ),

              slug: String(
                subject?.slug ?? ""
              ),

              description:
                String(
                  subject?.description ?? ""
                ),
            })
          )
        : [],
  };
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function ManageExamQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [examId, setExamId] =
    useState("");

  const [exam, setExam] =
    useState<Exam | null>(null);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Resolve route params
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    async function resolveParams() {
      try {
        const resolved =
          await params;

        if (!mounted) return;

        setExamId(
          String(resolved?.id ?? "")
        );
      } catch (error) {
        console.error(
          "Failed to resolve params:",
          error
        );

        if (mounted) {
          setError(
            "Invalid exam URL."
          );
          setLoading(false);
        }
      }
    }

    resolveParams();

    return () => {
      mounted = false;
    };
  }, [params]);

  /*
  |--------------------------------------------------------------------------
  | Load exam questions
  |--------------------------------------------------------------------------
  */

  async function loadQuestions() {
    if (!examId) return;

    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `/api/admin/exams/${encodeURIComponent(
            examId
          )}/questions`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

      let data: ApiResponse;

      try {
        data =
          await response.json();
      } catch {
        throw new Error(
          "Invalid response from server."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load exam questions."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to load exam questions."
        );
      }

      if (!data.exam) {
        throw new Error(
          "Exam data was not returned by the server."
        );
      }

      const normalizedExam =
        normalizeExam(
          data.exam
        );

      const normalizedQuestions =
        Array.isArray(
          data.questions
        )
          ? data.questions
              .map(
                normalizeQuestion
              )
              .filter(
                (question) =>
                  Boolean(
                    question._id
                  )
              )
          : [];

      setExam(
        normalizedExam
      );

      setQuestions(
        normalizedQuestions
      );
    } catch (error) {
      console.error(
        "Load exam questions error:",
        error
      );

      setExam(null);
      setQuestions([]);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load exam questions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!examId) return;

    loadQuestions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  /*
  |--------------------------------------------------------------------------
  | Subject name
  |--------------------------------------------------------------------------
  */

  function getSubjectName(
    subjectId: string
  ) {
    if (!exam) {
      return "Unknown Subject";
    }

    const subject =
      exam.subjects.find(
        (item) =>
          String(item._id) ===
          String(subjectId)
      );

    return (
      subject?.name ||
      "Unknown Subject"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete question
  |--------------------------------------------------------------------------
  */

  async function deleteQuestion(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this question?\n\nThis action cannot be undone."
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response =
        await fetch(
          `/api/admin/questions/${encodeURIComponent(
            id
          )}`,
          {
            method: "DELETE",
          }
        );

      let data: {
        success?: boolean;
        message?: string;
      };

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete question."
        );
      }

      if (data.success === false) {
        throw new Error(
          data.message ||
            "Failed to delete question."
        );
      }

      setQuestions(
        (current) =>
          current.filter(
            (question) =>
              question._id !== id
          )
      );
    } catch (error) {
      console.error(
        "Delete question error:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete question."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Loading questions...
          </p>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <Link
            href="/admin/exams"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Exams
          </Link>

          <div className="mt-6 rounded-3xl border border-red-200 bg-white p-8 shadow-sm dark:border-red-900/50 dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-black text-slate-900 dark:text-white">
                  Failed to load questions
                </h1>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={loadQuestions}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Exam not found
  |--------------------------------------------------------------------------
  */

  if (!exam) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <Link
            href="/admin/exams"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Exams
          </Link>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <BookOpen className="mx-auto h-10 w-10 text-slate-400" />

            <h1 className="mt-4 text-xl font-black">
              Exam not found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              The requested exam could not be found.
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/admin/exams"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exams
        </Link>

        {/* Exam Header */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-black text-slate-900 dark:text-white">
                    {exam.name}
                  </h1>

                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    /{exam.slug}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/admin/questions/new?examId=${encodeURIComponent(
                exam._id
              )}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Total Questions
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              {questions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Subjects
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              {exam.subjects.length}
            </p>
          </div>
        </div>

        {/* Questions */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Questions
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Questions stored in MongoDB for this exam.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {questions.length}{" "}
                {questions.length === 1
                  ? "Question"
                  : "Questions"}
              </span>
            </div>
          </div>

          {/* Empty */}
          {questions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <BookOpen className="h-6 w-6 text-slate-400" />
              </div>

              <p className="mt-4 font-bold text-slate-900 dark:text-white">
                No questions found.
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add a question to start building this exam.
              </p>

              <Link
                href={`/admin/questions/new?examId=${encodeURIComponent(
                  exam._id
                )}`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add First Question
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {questions.map(
                (question, index) => {
                  const correctAnswer =
                    normalizeCorrectAnswer(
                      question.correctAnswer
                    );

                  return (
                    <div
                      key={question._id}
                      className="p-5 transition hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                    >
                      <div className="flex gap-4">
                        {/* Number */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {index + 1}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                              {getSubjectName(
                                question.subjectId
                              )}
                            </span>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {question.difficulty}
                            </span>

                            {question.isDailyQuiz && (
                              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                Daily Quiz
                              </span>
                            )}

                            {question.isActive ===
                              false && (
                              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                Inactive
                              </span>
                            )}
                          </div>

                          {/* Question */}
                          <h3 className="mt-3 font-bold leading-6 text-slate-900 dark:text-white">
                            {question.question}
                          </h3>

                          {/* Topic */}
                          {question.topic && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Topic:{" "}
                              {question.topic}
                            </p>
                          )}

                          {/* Options */}
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {question.options.map(
                              (
                                option,
                                optionIndex
                              ) => {
                                const isCorrect =
                                  optionIndex ===
                                  correctAnswer;

                                return (
                                  <div
                                    key={`${question._id}-${optionIndex}`}
                                    className={`rounded-lg border px-3 py-2 text-sm ${
                                      isCorrect
                                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                                        : "border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300"
                                    }`}
                                  >
                                    <span className="mr-2 font-bold">
                                      {String.fromCharCode(
                                        65 +
                                          optionIndex
                                      )}
                                      .
                                    </span>

                                    {option ||
                                      "Empty option"}

                                    {isCorrect && (
                                      <span className="ml-2 text-xs font-black">
                                        ✓ Correct
                                      </span>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 gap-1">
                          <Link
                            href={`/admin/questions/${question._id}/edit`}
                            aria-label="Edit question"
                            title="Edit question"
                            className="h-fit rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              question._id
                            }
                            onClick={() =>
                              deleteQuestion(
                                question._id
                              )
                            }
                            aria-label="Delete question"
                            title="Delete question"
                            className="h-fit rounded-lg p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30"
                          >
                            {deletingId ===
                            question._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}