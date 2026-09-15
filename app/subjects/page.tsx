import Link from "next/link";
import { subjects } from "@/data/subjects";

export default function SubjectsPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        {/* Decorative gradients */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-indigo-500"
              />
              Subject Practice
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Subjects
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
              Choose a subject and practice multiple-choice questions to
              strengthen your knowledge and exam preparation.
            </p>

            {/* Subject count */}
            <div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
              <span className="font-black text-indigo-600 dark:text-indigo-400">
                {subjects.length}
              </span>

              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {subjects.length === 1
                  ? "Subject Available"
                  : "Subjects Available"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* Section heading */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Browse Subjects
            </h2>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Select a subject to start practicing.
            </p>
          </div>

          <div className="hidden rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200 sm:block dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
            {subjects.length}{" "}
            {subjects.length === 1 ? "subject" : "subjects"}
          </div>
        </div>

        {/* Subject Grid */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {subjects.map((subject) => (
              <Link
                key={subject.slug}
                href={`/subjects/${subject.slug}`}
                className="
                  group relative flex h-full min-h-57.5 flex-col
                  overflow-hidden rounded-2xl
                  border border-slate-200
                  bg-white p-6
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-indigo-300
                  hover:shadow-xl hover:shadow-indigo-100/60
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-indigo-500
                  focus-visible:ring-offset-2
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:hover:border-indigo-500/60
                  dark:hover:shadow-indigo-950/30
                  dark:focus-visible:ring-offset-slate-950
                "
              >
                {/* Top gradient */}
                <div
                  aria-hidden="true"
                  className="
                    absolute inset-x-0 top-0 h-1
                    bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500
                    opacity-0 transition-opacity duration-300
                    group-hover:opacity-100
                  "
                />

                {/* Icon */}
                <div
                  className="
                    flex h-16 w-16 shrink-0 items-center justify-center
                    rounded-2xl
                    border border-indigo-100
                    bg-indigo-50
                    text-3xl
                    shadow-sm
                    transition-transform duration-300
                    group-hover:scale-105
                    dark:border-indigo-900/50
                    dark:bg-indigo-950/50
                  "
                >
                  <span aria-hidden="true">{subject.icon}</span>
                </div>

                {/* Content */}
                <div className="mt-5">
                  <h3
                    className="
                      text-xl font-extrabold tracking-tight
                      text-slate-900
                      transition-colors
                      group-hover:text-indigo-600
                      dark:text-white
                      dark:group-hover:text-indigo-400
                    "
                  >
                    {subject.name}
                  </h3>

                  <p
                    className="
                      mt-2 line-clamp-2
                      text-sm leading-6
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {subject.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Practice
                  </span>

                  <span
                    aria-hidden="true"
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-full
                      bg-slate-100
                      text-lg text-slate-500
                      transition-all duration-300
                      group-hover:bg-indigo-600
                      group-hover:text-white
                      dark:bg-slate-800
                      dark:text-slate-400
                      dark:group-hover:bg-indigo-500
                      dark:group-hover:text-white
                    "
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-70 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
                📚
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                No subjects available
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                New subjects will be added soon.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}