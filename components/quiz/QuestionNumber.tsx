
type QuestionNumberProps = {
  number: number;
  total: number;
};

export function QuestionNumber({
  number,
  total,
}: QuestionNumberProps) {
  return (
    <div
      className="
        inline-flex items-center gap-2
        rounded-xl
        border border-slate-200
        bg-white
        px-3 py-2
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
      aria-label={`Question ${number} of ${total}`}
    >
      <span
        className="
          flex h-7 w-7 items-center justify-center
          rounded-lg
          bg-indigo-50
          text-xs font-black
          text-indigo-600
          dark:bg-indigo-500/10
          dark:text-indigo-400
        "
      >
        {number}
      </span>

      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
        Question
      </span>

      <span className="text-sm text-slate-400 dark:text-slate-500">
        of
      </span>

      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        {total}
      </span>
    </div>
  );
}

