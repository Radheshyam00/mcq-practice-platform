"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  Search,
  Trophy,
} from "lucide-react";

type Result = {
  id: string;
  userId: string;
  examId: string;

  name: string;
  exam: string;

  score: number;
  correct: number;
  wrong: number;
  skipped: number;

  total: number;

  timeSeconds: number;
  time: string;

  type: "practice" | "mock-test" | "daily-quiz";

  createdAt: string;
};

type Stats = {
  averageScore: number;
  completed: number;
  attemptsToday: number;
};

export default function AdminResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [stats, setStats] = useState<Stats>({
    averageScore: 0,
    completed: 0,
    attemptsToday: 0,
  });

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadResults() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (type) {
        params.set("type", type);
      }

      const response = await fetch(
        `/api/admin/results?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load results"
        );
      }

      setResults(data.results || []);

      setStats(
        data.stats || {
          averageScore: 0,
          completed: 0,
          attemptsToday: 0,
        }
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load results"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResults();
  }, [type]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    loadResults();
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin Dashboard
        </Link>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-2xl font-black">
                    Results
                  </h1>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Monitor quiz and mock test performance.
                  </p>
                </div>
              </div>

              {/* Search + filter */}
              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search student or exam..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-indigo-500 sm:w-64 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value)
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="practice">
                    Practice
                  </option>
                  <option value="mock-test">
                    Mock Test
                  </option>
                  <option value="daily-quiz">
                    Daily Quiz
                  </option>
                </select>

                <button
                  type="submit"
                  className="h-10 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <Stat
              icon={
                <Trophy className="h-5 w-5" />
              }
              title="Average Score"
              value={`${stats.averageScore}%`}
            />

            <Stat
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
              title="Completed"
              value={stats.completed.toLocaleString()}
            />

            <Stat
              icon={
                <Clock3 className="h-5 w-5" />
              }
              title="Attempts Today"
              value={stats.attemptsToday.toLocaleString()}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mx-5 mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50 dark:bg-slate-950">
                <tr>
                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Student
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Exam
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Type
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Score
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Correct
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm font-semibold text-slate-500"
                    >
                      Loading results...
                    </td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                          <BarChart3 className="h-5 w-5" />
                        </div>

                        <p className="mt-3 font-bold">
                          No results found
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Results will appear here after students
                          complete quizzes or mock tests.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <tr
                      key={result.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-950/50"
                    >
                      {/* Student */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold">
                          {result.name}
                        </p>
                      </td>

                      {/* Exam */}
                      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {result.exam}
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <TypeBadge type={result.type} />
                      </td>

                      {/* Score */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-black ${
                            result.score >= 80
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                              : result.score >= 60
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                          }`}
                        >
                          {result.score}%
                        </span>
                      </td>

                      {/* Correct */}
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold">
                          {result.correct}/{result.total}
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                          {result.wrong} wrong
                          {result.skipped > 0 &&
                            ` • ${result.skipped} skipped`}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {result.time}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-xl font-black">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function TypeBadge({
  type,
}: {
  type: Result["type"];
}) {
  const labels = {
    practice: "Practice",
    "mock-test": "Mock Test",
    "daily-quiz": "Daily Quiz",
  };

  return (
    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
      {labels[type]}
    </span>
  );
}