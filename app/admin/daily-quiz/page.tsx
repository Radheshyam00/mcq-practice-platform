"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";

type DailyQuestion = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  examId: string;
  exam?: string;
  subjectId: string;
  subject?: string;
  topic: string;
  difficulty: Difficulty;
  isDailyQuiz: boolean;
  isActive: boolean;
  createdAt?: string;
};

type Exam = {
  _id: string;
  name: string;
  slug: string;
};

export default function AdminDailyQuizPage() {
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(true);
  const [examLoading, setExamLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadQuestions() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("isDailyQuiz", "true");

      if (examFilter !== "all") {
        params.set("examId", examFilter);
      }

      if (difficultyFilter !== "all") {
        params.set("difficulty", difficultyFilter);
      }

      if (statusFilter !== "all") {
        params.set("isActive", statusFilter);
      }

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(
        `/api/admin/questions?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load Daily Quiz questions.",
        );
      }

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.questions)
          ? data.questions
          : [];

      setQuestions(list);
    } catch (error) {
      console.error("Daily Quiz load error:", error);

      setQuestions([]);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load Daily Quiz questions.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadExams() {
    try {
      setExamLoading(true);

      const response = await fetch("/api/admin/exams", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load exams.");
      }

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.exams)
          ? data.exams
          : [];

      setExams(list);
    } catch (error) {
      console.error("Exam load error:", error);
      setExams([]);
    } finally {
      setExamLoading(false);
    }
  }

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadQuestions();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, examFilter, difficultyFilter, statusFilter]);

  async function toggleDailyQuiz(question: DailyQuestion) {
    try {
      setUpdatingId(question._id);

      const response = await fetch(
        `/api/admin/questions/${question._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isDailyQuiz: !question.isDailyQuiz,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update Daily Quiz status.",
        );
      }

      setQuestions((current) =>
        current.map((item) =>
          item._id === question._id
            ? {
                ...item,
                isDailyQuiz: !item.isDailyQuiz,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Daily Quiz update error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update Daily Quiz status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleActive(question: DailyQuestion) {
    try {
      setUpdatingId(question._id);

      const response = await fetch(
        `/api/admin/questions/${question._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !question.isActive,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update question status.",
        );
      }

      setQuestions((current) =>
        current.map((item) =>
          item._id === question._id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Question status update error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update question status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteQuestion(question: DailyQuestion) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(question._id);

      const response = await fetch(
        `/api/admin/questions/${question._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to delete question.",
        );
      }

      setQuestions((current) =>
        current.filter((item) => item._id !== question._id),
      );
    } catch (error) {
      console.error("Delete question error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete question.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const stats = useMemo(() => {
    const active = questions.filter(
      (question) => question.isActive,
    ).length;

    const inactive = questions.length - active;

    const easy = questions.filter(
      (question) => question.difficulty === "Easy",
    ).length;

    const medium = questions.filter(
      (question) => question.difficulty === "Medium",
    ).length;

    const hard = questions.filter(
      (question) => question.difficulty === "Hard",
    ).length;

    return {
      total: questions.length,
      active,
      inactive,
      easy,
      medium,
      hard,
    };
  }, [questions]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />

                  <h1 className="text-xl font-black">
                    Daily Quiz
                  </h1>
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage questions available in the Daily Quiz.
                </p>
              </div>
            </div>

            <Link
              href="/admin/questions/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          <StatCard
            label="Daily Questions"
            value={stats.total}
          />

          <StatCard
            label="Active"
            value={stats.active}
            icon={<CheckCircle2 className="h-4 w-4" />}
          />

          <StatCard
            label="Inactive"
            value={stats.inactive}
            icon={<XCircle className="h-4 w-4" />}
          />

          <StatCard
            label="Easy"
            value={stats.easy}
          />

          <StatCard
            label="Medium"
            value={stats.medium}
          />

          <StatCard
            label="Hard"
            value={stats.hard}
          />
        </div>

        {/* Filters */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px_180px_auto]">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search questions..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            {/* Exam */}
            <FilterSelect
              value={examFilter}
              onChange={setExamFilter}
              disabled={examLoading}
            >
              <option value="all">All Exams</option>

              {exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.name}
                </option>
              ))}
            </FilterSelect>

            {/* Difficulty */}
            <FilterSelect
              value={difficultyFilter}
              onChange={setDifficultyFilter}
            >
              <option value="all">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </FilterSelect>

            {/* Status */}
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </FilterSelect>

            <button
              type="button"
              onClick={loadQuestions}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Questions */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black">
                  Daily Quiz Questions
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {questions.length} question
                  {questions.length === 1 ? "" : "s"} found
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : questions.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Search className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-black">
                No Daily Quiz questions
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Add questions and enable them for Daily Quiz to
                make them available here.
              </p>

              <Link
                href="/admin/questions/new"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {questions.map((question, index) => (
                <article
                  key={question._id}
                  className="p-5 transition hover:bg-slate-50/70 dark:hover:bg-slate-950/40"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          #{index + 1}
                        </span>

                        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                          {question.exam || "Unknown Exam"}
                        </span>

                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {question.subject || "Unknown Subject"}
                        </span>

                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                            question.difficulty === "Easy"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : question.difficulty === "Medium"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                          }`}
                        >
                          {question.difficulty}
                        </span>

                        {question.isDailyQuiz && (
                          <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-400">
                            Daily Quiz
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-base font-bold leading-7 text-slate-900 dark:text-white">
                        {question.question}
                      </h3>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {question.options.map((option, optionIndex) => {
                          const isCorrect =
                            optionIndex ===
                            question.correctAnswer;

                          return (
                            <div
                              key={`${question._id}-${optionIndex}`}
                              className={`rounded-xl border p-3 text-sm ${
                                isCorrect
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
                                  : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                              }`}
                            >
                              <div className="flex gap-2">
                                <span className="font-black">
                                  {String.fromCharCode(
                                    65 + optionIndex,
                                  )}
                                  .
                                </span>

                                <span>{option}</span>

                                {isCorrect && (
                                  <CheckCircle2 className="ml-auto h-4 w-4 shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {question.topic && (
                        <p className="mt-3 text-xs font-semibold text-slate-400">
                          Topic: {question.topic}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-wrap items-center gap-2 lg:w-44 lg:flex-col">
                      <button
                        type="button"
                        disabled={
                          updatingId === question._id
                        }
                        onClick={() =>
                          toggleDailyQuiz(question)
                        }
                        className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition lg:w-full ${
                          question.isDailyQuiz
                            ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400"
                            : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
                        }`}
                      >
                        {question.isDailyQuiz ? (
                          <>
                            <XCircle className="h-4 w-4" />
                            Remove Daily
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Add Daily
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={
                          updatingId === question._id
                        }
                        onClick={() =>
                          toggleActive(question)
                        }
                        className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition lg:w-full ${
                          question.isActive
                            ? "border border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                            : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
                        }`}
                      >
                        {question.isActive
                          ? "Disable"
                          : "Enable"}
                      </button>

                      <Link
                        href={`/admin/questions/edit/${question._id}`}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 lg:w-full"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Link>

                      <button
                        type="button"
                        disabled={
                          deletingId === question._id
                        }
                        onClick={() =>
                          deleteQuestion(question)
                        }
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 lg:w-full"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingId === question._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </div>

      <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
      >
        {children}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}