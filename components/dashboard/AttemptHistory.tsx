
import { Card } from "@/components/common/Card";

const attempts = [
  {
    title: "Computer Instructor",
    score: 82,
    date: "Today",
  },
  {
    title: "Cybersecurity",
    score: 75,
    date: "Yesterday",
  },
  {
    title: "SSC CGL",
    score: 68,
    date: "2 days ago",
  },
];

function getScoreStyle(score: number) {
  if (score >= 80) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20";
  }

  if (score >= 60) {
    return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20";
  }

  return "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20";
}

export function AttemptHistory() {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Recent attempts
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your latest practice performance
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9" />
            <path d="M3 4v8h8" />
            <path d="M12 7v5l3 2" />
          </svg>
        </div>
      </div>

      {/* Attempts */}
      <div className="mt-6 space-y-3">
        {attempts.map((attempt, index) => (
          <div
            key={attempt.title}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-500/30 dark:hover:bg-slate-900"
          >
            {/* Number */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                {attempt.title}
              </p>

              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {attempt.date}
              </p>
            </div>

            {/* Score */}
            <div
              className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-bold ring-1 ${getScoreStyle(
                attempt.score,
              )}`}
            >
              {attempt.score}%
            </div>

            {/* Arrow */}
            <svg
              className="hidden h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500 sm:block dark:text-slate-600 dark:group-hover:text-indigo-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        ))}
      </div>

      {/* Footer */}
      <button
        type="button"
        className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
      >
        View all attempts
      </button>
    </Card>
  );
}

