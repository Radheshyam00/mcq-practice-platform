
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { questions } from "@/data/questions";
import { exams } from "@/data/exams";
import { SearchBar } from "@/components/common/SearchBar";

export default function SearchPage() {
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();

  const filteredExams = useMemo(() => {
    if (!term) return exams;

    return exams.filter((exam) =>
      exam.name.toLowerCase().includes(term)
    );
  }, [term]);

  const filteredQuestions = useMemo(() => {
    if (!term) return questions;

    return questions.filter((question) =>
      question.question.toLowerCase().includes(term)
    );
  }, [term]);

  const totalResults =
    filteredExams.length + filteredQuestions.length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900">
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
                d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Search
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            Find exams and practice questions quickly.
          </p>
        </div>

        {/* Search box */}
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-shadow focus-within:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <SearchBar value={q} onChange={setQ} />
          </div>

          <div className="mt-3 flex items-center justify-between px-1 text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              {term ? (
                <>
                  Results for{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    “{q.trim()}”
                  </span>
                </>
              ) : (
                "Browse all available content"
              )}
            </p>

            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {totalResults}{" "}
              {totalResults === 1 ? "result" : "results"}
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="mx-auto mt-10 max-w-5xl space-y-10">
          {/* Exams */}
          {filteredExams.length > 0 && (
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black sm:text-2xl">
                      Exams
                    </h2>

                    <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                      {filteredExams.length}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Find an exam and start practicing.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {filteredExams.map((exam) => (
                  <Link
                    href={`/exams/${exam.slug}`}
                    key={exam.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
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

                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-slate-900 dark:text-white">
                            {exam.name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Practice exam
                          </p>
                        </div>
                      </div>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-900 dark:group-hover:text-white"
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
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Questions */}
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black sm:text-2xl">
                    Questions
                  </h2>

                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                    {filteredQuestions.length}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Search through practice questions.
                </p>
              </div>
            </div>

            {filteredQuestions.length > 0 ? (
              <div className="space-y-3">
                {filteredQuestions.map((question, index) => (
                  <Link
                    href={`/questions/${question.id}`}
                    key={question.id}
                    className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-6 text-slate-800 dark:text-slate-100">
                          {question.question}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-400">
                          <span>Practice Question</span>

                          <span>•</span>

                          <span className="transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200">
                            View question
                          </span>

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
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
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
                      d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                    />
                  </svg>
                </div>

                <h3 className="mt-5 text-lg font-black">
                  No questions found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  We couldn't find any questions matching your search.
                  Try using a different keyword.
                </p>

                {term && (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Completely empty */}
          {filteredExams.length === 0 &&
            filteredQuestions.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-lg font-black">
                  No results found
                </h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Try a different search term.
                </p>

                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Clear search
                </button>
              </div>
            )}
        </div>
      </div>
    </main>
  );
}
