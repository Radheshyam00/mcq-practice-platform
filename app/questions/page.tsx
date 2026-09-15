
import { questions } from "@/data/questions";
import Link from "next/link";

export default function QuestionsPage() {
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Practice Questions
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            Test your knowledge with questions from different exams,
            subjects, and difficulty levels.
          </p>

          {/* Question count */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white dark:bg-white dark:text-slate-900">
              {questions.length}
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              {questions.length === 1
                ? "Question Available"
                : "Questions Available"}
            </span>
          </div>
        </div>

        {/* Questions */}
        {questions.length > 0 ? (
          <div className="mx-auto mt-10 max-w-5xl space-y-4">
            {questions.map((q, index) => {
              const difficulty = q.difficulty?.toLowerCase();

              const difficultyClass =
                difficulty === "easy"
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : difficulty === "medium"
                    ? "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-950/40 dark:text-amber-400"
                    : difficulty === "hard"
                      ? "bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-950/40 dark:text-rose-400"
                      : "bg-slate-100 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-300";

              return (
                <Link
                  href={`/questions/${q.id}`}
                  key={q.id}
                  className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
                >
                  <div className="flex gap-4">
                    {/* Number */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-base font-bold leading-6 text-slate-900 transition-colors group-hover:text-slate-700 sm:text-lg dark:text-white dark:group-hover:text-slate-200">
                          {q.question}
                        </h2>

                        {/* Arrow */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-slate-900 dark:group-hover:text-white"
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

                      {/* Metadata */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {/* Exam */}
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                            />
                          </svg>
                          {q.examSlug}
                        </span>

                        {/* Subject */}
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                            />
                          </svg>
                          {q.subjectSlug}
                        </span>

                        {/* Separator */}
                        <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
                          •
                        </span>

                        {/* Difficulty */}
                        <span
                          className={`inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-bold ring-1 ring-inset ${difficultyClass}`}
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      {/* Bottom action */}
                      <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200">
                        View question
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
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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

            <h2 className="mt-5 text-xl font-black">
              No questions available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              There are currently no practice questions available.
              Please check back later.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
