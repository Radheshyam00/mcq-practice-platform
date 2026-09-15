
"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { BOOKMARK_STORAGE_KEY } from "@/lib/constants";
import { EmptyState } from "@/components/common/EmptyState";
import { questions } from "@/data/questions";
import Link from "next/link";

export default function BookmarksPage() {
  const [ids] = useLocalStorage<string[]>(
    BOOKMARK_STORAGE_KEY,
    []
  );

  const saved = questions.filter((q) => ids.includes(q.id));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        <section className="mx-auto max-w-3xl text-center">
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
                d="M17.593 3.322c1.1-.128 2.1.732 2.1 1.84V21l-7.5-3.75L4.693 21V5.162c0-1.108 1-1.968 2.1-1.84l5.4.63 5.4-.63Z"
              />
            </svg>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Saved Questions
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Bookmarks
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            Keep important questions saved so you can review them
            whenever you want.
          </p>

          {/* Count */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white dark:bg-white dark:text-slate-900">
              {saved.length}
            </span>

            <span className="text-slate-600 dark:text-slate-300">
              {saved.length === 1
                ? "Saved Question"
                : "Saved Questions"}
            </span>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto mt-10 max-w-5xl">
          {saved.length > 0 ? (
            <>
              {/* Section Header */}
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black sm:text-2xl">
                    Your Saved Questions
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Review questions you marked for later.
                  </p>
                </div>

                <span className="hidden rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600 sm:block dark:bg-slate-800 dark:text-slate-300">
                  {saved.length}{" "}
                  {saved.length === 1 ? "question" : "questions"}
                </span>
              </div>

              {/* Question Cards */}
              <div className="space-y-3">
                {saved.map((q, index) => (
                  <Link
                    href={`/questions/${q.id}`}
                    key={q.id}
                    className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
                  >
                    <div className="flex gap-4">
                      {/* Number */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      {/* Main */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold leading-6 text-slate-900 dark:text-white">
                              {q.question}
                            </h3>

                            {/* Metadata */}
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {q.examSlug}
                              </span>

                              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {q.subjectSlug}
                              </span>

                              {q.difficulty && (
                                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                  {q.difficulty}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Bookmark + Arrow */}
                          <div className="flex shrink-0 items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4.5 w-4.5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M17.593 3.322c1.1-.128 2.1.732 2.1 1.84V21l-7.5-3.75L4.693 21V5.162c0-1.108 1-1.968 2.1-1.84l5.4.63 5.4-.63Z" />
                              </svg>
                            </div>

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="hidden h-5 w-5 text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-slate-900 sm:block dark:group-hover:text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9 5 7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200">
                          Review question

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m9 5 7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <EmptyState
                title="No bookmarks yet"
                description="Bookmark questions while practicing to review them later."
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
