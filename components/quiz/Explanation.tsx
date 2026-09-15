
import { CheckCircle2, Lightbulb } from "lucide-react";

type ExplanationProps = {
  text: string;
};

export function Explanation({ text }: ExplanationProps) {
  return (
    <div
      className="
        mt-6 overflow-hidden rounded-2xl
        border border-emerald-200
        bg-emerald-50
        shadow-sm
        dark:border-emerald-900/60
        dark:bg-emerald-950/30
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between gap-3
          border-b border-emerald-200
          px-4 py-3
          dark:border-emerald-900/60
          sm:px-5
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-xl
              bg-emerald-100
              text-emerald-600
              dark:bg-emerald-500/10
              dark:text-emerald-400
            "
          >
            <CheckCircle2
              className="h-5 w-5"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </div>

          <div>
            <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              Explanation
            </h3>

            <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">
              Correct answer explained
            </p>
          </div>
        </div>

        <Lightbulb
          className="hidden h-5 w-5 text-emerald-600/50 dark:text-emerald-400/40 sm:block"
          aria-hidden="true"
        />
      </div>

      {/* Explanation content */}
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <p
          className="
            text-sm leading-7
            text-slate-700
            dark:text-slate-300
          "
        >
          {text}
        </p>
      </div>
    </div>
  );
}

