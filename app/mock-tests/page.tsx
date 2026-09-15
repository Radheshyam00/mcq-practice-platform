import { mockTests } from "@/data/mockTests";
import { TestCard } from "@/components/mock-test/TestCard";

export default function MockTestsPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        {/* Decorative background */}
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
              Exam Simulation
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Mock Tests
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
              Test your knowledge with timed mock exams designed to simulate
              real exam conditions and improve your confidence.
            </p>

            {/* Stats */}
            <div className="mt-7 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="font-black text-indigo-600 dark:text-indigo-400">
                  {mockTests.length}
                </span>

                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {mockTests.length === 1
                    ? "Mock Test Available"
                    : "Mock Tests Available"}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Timed Practice
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mock Tests */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Available Mock Tests
            </h2>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Choose a test and challenge yourself under timed conditions.
            </p>
          </div>

          <div className="hidden rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200 sm:block dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
            {mockTests.length}{" "}
            {mockTests.length === 1 ? "test" : "tests"}
          </div>
        </div>

        {/* Test Grid */}
        {mockTests.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {mockTests.map((test) => (
              <div key={test.id} className="h-full min-w-0">
                <TestCard {...test} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-75 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="max-w-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-2xl dark:border-indigo-900/50 dark:bg-indigo-950/50">
                ⏱️
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                No mock tests available
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                New timed mock tests will be added soon. Check back later.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}