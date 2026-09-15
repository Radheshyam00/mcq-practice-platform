
import type { QuizResult } from "@/types/result";

export function TestResult({ result }: { result: QuizResult }) {
  const percentage = Math.max(0, Math.min(100, result.percentage));

  const getPerformance = () => {
    if (percentage >= 80) {
      return {
        label: "Excellent performance",
        description: "Great job! You have a strong understanding of the topics.",
        badge:
          "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
      };
    }

    if (percentage >= 60) {
      return {
        label: "Good performance",
        description: "You're doing well. Keep practicing to improve further.",
        badge:
          "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
      };
    }

    return {
      label: "Keep practicing",
      description: "Review the questions and practice regularly to improve.",
      badge:
        "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20",
    };
  };

  const performance = getPerformance();

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
          Test Result
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here is a summary of your test performance.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {/* Score */}
        <div className="flex flex-col items-center">
          <div className="relative flex h-40 w-40 items-center justify-center">
            {/* Background ring */}
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 120 120"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-100 dark:text-slate-800"
              />

              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                className="text-indigo-600 dark:text-indigo-500"
                strokeDasharray={`${percentage * 3.14} 314`}
              />
            </svg>

            <div className="relative text-center">
              <div className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                {percentage}%
              </div>
              <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                Score
              </p>
            </div>
          </div>

          {/* Performance badge */}
          <div
            className={`mt-5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${performance.badge}`}
          >
            {performance.label}
          </div>

          <p className="mt-3 max-w-md text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
            {performance.description}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-950">
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {result.correct}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Correct
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-950">
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {Math.max(0, result.total - result.correct)}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Incorrect
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-950">
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {result.total}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Total
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-950">
            <p className="text-2xl font-black text-slate-700 dark:text-slate-200">
              {result.total > 0
                ? Math.round((result.correct / result.total) * 100)
                : 0}
              %
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Accuracy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
