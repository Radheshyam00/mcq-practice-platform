
import { QuizTimer } from "@/components/quiz/QuizTimer";

type TestTimerProps = {
  seconds: number;
};

export function TestTimer({ seconds }: TestTimerProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
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
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Time remaining
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Manage your time carefully
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">
          <QuizTimer seconds={seconds} />
        </div>
      </div>
    </div>
  );
}
