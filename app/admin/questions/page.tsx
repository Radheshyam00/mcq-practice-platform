
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Edit,
  FileQuestion,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";

type Question = {
  _id: string;
  question: string;
  options: [string, string, string, string] | string[];
  correctAnswer: number;

  subject?: string;
  topic?: string;
  exam?: string;

  // MongoDB relationship fields
  examId?: string;
  subjectId?: string;

  difficulty: "Easy" | "Medium" | "Hard";

  isDailyQuiz: boolean;
  isActive: boolean;
};

type QuestionsResponse = {
  success?: boolean;
  questions?: Question[];
  total?: number;
  message?: string;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);

  // Text currently inside search input
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  /**
   * Load questions.
   *
   * IMPORTANT:
   * searchValue is passed explicitly so clicking Search always
   * uses the current input value and does not depend on stale state.
   */
  const loadQuestions = useCallback(async (searchValue: string = "") => {
    try {
      setLoading(true);
      setError("");

      const query = searchValue.trim();

      const response = await fetch(
        `/api/admin/questions?search=${encodeURIComponent(query)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data: QuestionsResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load questions."
        );
      }

      const loadedQuestions = Array.isArray(data.questions)
        ? data.questions
        : [];

      setQuestions(loadedQuestions);

      setTotal(
        typeof data.total === "number"
          ? data.total
          : loadedQuestions.length
      );
    } catch (err) {
      console.error("Failed to load questions:", err);

      setQuestions([]);
      setTotal(0);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load questions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initial load only.
   *
   * Search does NOT automatically run while typing.
   */
  useEffect(() => {
    loadQuestions("");
  }, [loadQuestions]);

  /**
   * Convert numeric answer index to A/B/C/D.
   *
   * A = 0
   * B = 1
   * C = 2
   * D = 3
   */
  function getCorrectAnswerLabel(correctAnswer: number): string {
    if (
      Number.isInteger(correctAnswer) &&
      correctAnswer >= 0 &&
      correctAnswer <= 3
    ) {
      return String.fromCharCode(65 + correctAnswer);
    }

    return "?";
  }

  /**
   * Delete question.
   */
  async function deleteQuestion(id: string) {
    if (deletingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this question?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(
        `/api/admin/questions/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to delete question."
        );
      }

      setQuestions((current) =>
        current.filter((question) => question._id !== id)
      );

      setTotal((current) => Math.max(0, current - 1));
    } catch (err) {
      console.error("Delete question error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete question."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /**
   * Search using current input.
   */
  function handleSearch() {
    loadQuestions(search);
  }

  /**
   * Clear search and reload everything.
   */
  function handleClearSearch() {
    setSearch("");
    loadQuestions("");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/admin/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <FileQuestion className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  Question Bank
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add, edit, delete and organize your MCQ questions.
                </p>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/questions/import"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <Upload className="h-4 w-4" />
              Import
            </Link>

            <Link
              href="/admin/questions/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SEARCH */}
        {/* ========================================================= */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search questions, subjects, exams or topics..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ERROR */}
        {/* ========================================================= */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">
                Something went wrong
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TABLE CARD */}
        {/* ========================================================= */}

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          {/* Table Header */}
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                All Questions
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {search.trim()
                  ? `Search results for "${search.trim()}"`
                  : "Manage your complete question bank."}
              </p>
            </div>

            <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {total}{" "}
              {total === 1 ? "question" : "questions"}
            </div>
          </div>

          {/* ======================================================= */}
          {/* TABLE */}
          {/* ======================================================= */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left">

              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                <tr>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Question
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Subject
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Exam
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Answer
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Difficulty
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Daily
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">

                {/* ================================================= */}
                {/* LOADING */}
                {/* ================================================= */}

                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center"
                    >
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500" />

                      <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Loading questions...
                      </p>
                    </td>
                  </tr>

                /* ================================================= */
                /* EMPTY */
                /* ================================================= */

                ) : questions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center"
                    >
                      <FileQuestion className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />

                      <p className="mt-4 font-bold text-slate-900 dark:text-white">
                        No questions found
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {search.trim()
                          ? "Try a different search term."
                          : "Add your first question to the question bank."}
                      </p>

                      {!search.trim() && (
                        <Link
                          href="/admin/questions/new"
                          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                        >
                          <Plus className="h-4 w-4" />
                          Add Question
                        </Link>
                      )}
                    </td>
                  </tr>

                /* ================================================= */
                /* QUESTIONS */
                /* ================================================= */

                ) : (
                  questions.map((item) => {
                    const answerLabel =
                      getCorrectAnswerLabel(item.correctAnswer);

                    const isDeleting =
                      deletingId === item._id;

                    return (
                      <tr
                        key={item._id}
                        className="transition hover:bg-slate-50 dark:hover:bg-slate-950"
                      >

                        {/* Question */}
                        <td className="max-w-md px-5 py-4 align-top">
                          <p className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">
                            {item.question}
                          </p>

                          {item.topic && (
                            <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                              {item.topic}
                            </p>
                          )}
                        </td>

                        {/* Subject */}
                        <td className="px-5 py-4 align-top text-sm font-medium text-slate-700 dark:text-slate-300">
                          {item.subject || "—"}
                        </td>

                        {/* Exam */}
                        <td className="px-5 py-4 align-top text-sm font-medium text-slate-700 dark:text-slate-300">
                          {item.exam || "—"}
                        </td>

                        {/* Correct Answer */}
                        <td className="px-5 py-4 align-top">
                          <span
                            title={
                              answerLabel === "?"
                                ? "Invalid answer index"
                                : `Correct answer: ${answerLabel}`
                            }
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${
                              answerLabel === "?"
                                ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            }`}
                          >
                            {answerLabel}
                          </span>
                        </td>

                        {/* Difficulty */}
                        <td className="px-5 py-4 align-top">
                          <span
                            className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${
                              item.difficulty === "Easy"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : item.difficulty === "Hard"
                                ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            }`}
                          >
                            {item.difficulty}
                          </span>
                        </td>

                        {/* Daily Quiz */}
                        <td className="px-5 py-4 align-top">
                          {item.isDailyQuiz ? (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Yes
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-slate-400">
                              No
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 align-top">
                          {item.isActive ? (
                            <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 align-top">
                          <div className="flex justify-end gap-2">

                            {/* Edit */}
                            <Link
                              href={`/admin/questions/${item._id}/edit`}
                              title="Edit question"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() =>
                                deleteQuestion(item._id)
                              }
                              disabled={deletingId !== null}
                              title="Delete question"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FOOTER INFO */}
        {/* ========================================================= */}

        {!loading && questions.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {questions.length}
              </span>{" "}
              question{questions.length === 1 ? "" : "s"}
              {search.trim()
                ? ` matching "${search.trim()}"`
                : ""}.
            </p>

            <p>
              Correct answer mapping:
              <span className="ml-1 font-semibold">
                A = 0 · B = 1 · C = 2 · D = 3
              </span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

