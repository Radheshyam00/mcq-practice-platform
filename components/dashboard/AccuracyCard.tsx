
import { Card } from "@/components/common/Card";

export function AccuracyCard() {
  return (
    <Card className="group overflow-hidden border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Average accuracy
          </p>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              78
            </span>
            <span className="text-lg font-bold text-slate-400 dark:text-slate-500">
              %
            </span>
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
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
            <path d="M3 3v18h18" />
            <path d="m7 16 4-5 3 3 5-7" />
          </svg>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500 dark:text-slate-400">
            Progress
          </span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            78%
          </span>
        </div>

        <div
          className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          role="progressbar"
          aria-valuenow={78}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Average accuracy: 78%"
        >
          <div className="h-full w-[78%] rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-500" />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        Keep practicing to improve your score.
      </p>
    </Card>
  );
}

