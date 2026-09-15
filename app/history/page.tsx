
"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { HISTORY_STORAGE_KEY } from "@/lib/constants";
import { EmptyState } from "@/components/common/EmptyState";

type HistoryItem = {
  title: string;
  score: number;
  date: string;
};

export default function HistoryPage() {
  const [history] = useLocalStorage<HistoryItem[]>(
    HISTORY_STORAGE_KEY,
    []
  );

  const averageScore =
    history.length > 0
      ? Math.round(
          history.reduce((total, item) => total + item.score, 0) /
            history.length
        )
      : 0;

  const bestScore =
    history.length > 0
      ? Math.max(...history.map((item) => item.score))
      : 0;

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getScoreStyle = (score: number) => {
    if (score >= 80) {
      return {
        badge:
          "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-950/40 dark:text-emerald-400",
        label: "Excellent",
      };
    }

    if (score >= 60) {
      return {
        badge:
          "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-950/40 dark:text-amber-400",
        label: "Good",
      };
    }

    return {
      badge:
        "bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-950/40 dark:text-rose-400",
      label: "Needs Practice",
    };
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Practice History
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            Review your previous attempts and track your practice
            performance.
          </p>
        </div>

        {history.length > 0 ? (
          <>
            {/* Statistics */}
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
              {/* Attempts */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Total Attempts
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {history.length}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Average */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Average Score
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {averageScore}%
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 13h4l3-8 4 14 3-8h4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Best */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Best Score
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {bestScore}%
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m12 3 2.472 5.007 5.528.803-4 3.899.944 5.506L12 15.615l-4.944 2.6L8 12.709l-4-3.899 5.528-.803L12 3Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* History Header */}
            <div className="mx-auto mt-10 max-w-5xl">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black sm:text-2xl">
                    Recent Attempts
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Your latest practice activity.
                  </p>
                </div>

                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {history.length}{" "}
                  {history.length === 1 ? "attempt" : "attempts"}
                </span>
              </div>

              {/* History Cards */}
              <div className="space-y-3">
                {history.map((item, index) => {
                  const scoreStyle = getScoreStyle(item.score);

                  return (
                    <div
                      key={`${item.title}-${item.date}-${index}`}
                      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
                    >
                      <div className="flex items-center gap-4">
                        {/* Number */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <span>
                              {formatDate(item.date)}
                            </span>

                            <span className="text-slate-300 dark:text-slate-700">
                              •
                            </span>

                            <span>Practice Attempt</span>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span
                            className={`rounded-lg px-3 py-1.5 text-sm font-black ring-1 ring-inset ${scoreStyle.badge}`}
                          >
                            {item.score}%
                          </span>

                          <span className="hidden text-[11px] font-semibold text-slate-400 sm:block">
                            {scoreStyle.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <EmptyState
                title="No attempts yet"
                description="Complete a practice quiz to build your history."
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
