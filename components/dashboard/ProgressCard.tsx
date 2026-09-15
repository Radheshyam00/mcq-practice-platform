
import { Card } from "@/components/common/Card";

export function ProgressCard() {
  return (
    <Card className="group overflow-hidden border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        {/* Content */}
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Questions practiced
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              128
            </span>

            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              questions
            </span>
          </div>

          {/* Weekly growth */}
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12 5-5 4 4 5-6" />
              <path d="M19 5v6h-6" />
            </svg>

            <span>+18 this week</span>
          </div>
        </div>

        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform duration-200 group-hover:scale-105 dark:bg-indigo-500/10 dark:text-indigo-400">
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
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
          </svg>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-400 dark:text-slate-500">
            Weekly activity
          </span>

          <span className="font-bold text-slate-600 dark:text-slate-300">
            18 new
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full w-[72%] rounded-full bg-indigo-500 transition-all duration-500 group-hover:bg-indigo-600 dark:bg-indigo-500 dark:group-hover:bg-indigo-400"
            aria-label="Weekly activity progress"
          />
        </div>
      </div>
    </Card>
  );
}

