
type QuizProgressProps = {
  current: number;
  total: number;
};

export function QuizProgress({
  current,
  total,
}: QuizProgressProps) {
  const safeTotal = Math.max(total, 0);
  const safeCurrent = Math.min(
    Math.max(current + 1, 0),
    safeTotal,
  );

  const percentage =
    safeTotal > 0
      ? Math.round((safeCurrent / safeTotal) * 100)
      : 0;

  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white
        px-4 py-3
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* Progress header */}
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Progress
          </span>

          <span className="hidden text-xs text-slate-400 dark:text-slate-500 sm:inline">
            •
          </span>

          <span className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:inline">
            Question {safeCurrent} of {safeTotal}
          </span>
        </div>

        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="
          h-2.5 overflow-hidden rounded-full
          bg-slate-100
          dark:bg-slate-800
        "
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeCurrent}
        aria-label={`Quiz progress: question ${safeCurrent} of ${safeTotal}`}
      >
        <div
          className="
            h-full rounded-full
            bg-indigo-600
            shadow-sm
            shadow-indigo-500/20
            transition-[width]
            duration-500
            ease-out
            dark:bg-indigo-500
          "
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {/* Bottom status */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          {safeCurrent === safeTotal && safeTotal > 0
            ? "Final question"
            : "Keep going"}
        </span>

        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {Math.max(safeTotal - safeCurrent, 0)} remaining
        </span>
      </div>
    </div>
  );
}

