
"use client";

import { Check, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

type QuestionNavigationProps = {
  total: number;
  current: number;
  answers: Record<string, string>;
  marked: string[];
  onGo: (index: number) => void;
};

export function QuestionNavigation({
  total,
  current,
  answers,
  marked,
  onGo,
}: QuestionNavigationProps) {
  const answeredCount = Object.keys(answers).filter(
    (key) => answers[key] !== undefined && answers[key] !== "",
  ).length;

  const markedCount = marked.length;
  const unansweredCount = Math.max(total - answeredCount, 0);

  return (
    <aside
      className="
        overflow-hidden rounded-3xl
        border border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* Header */}
      <div
        className="
          border-b border-slate-200
          bg-slate-50/70
          px-5 py-4
          dark:border-slate-800
          dark:bg-slate-950/40
        "
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Question palette
            </h3>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Navigate through your questions
            </p>
          </div>

          <div
            className="
              flex h-9 w-9 items-center justify-center
              rounded-xl
              bg-indigo-50
              text-indigo-600
              dark:bg-indigo-500/10
              dark:text-indigo-400
            "
          >
            <span className="text-sm font-black">{current + 1}</span>
          </div>
        </div>
      </div>

      {/* Progress summary */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-slate-500 dark:text-slate-400">
            Progress
          </span>

          <span className="font-bold text-slate-800 dark:text-slate-200">
            {answeredCount}/{total}
          </span>
        </div>

        <div
          className="
            mt-2 h-2 overflow-hidden rounded-full
            bg-slate-100
            dark:bg-slate-800
          "
        >
          <div
            className="
              h-full rounded-full
              bg-indigo-600
              transition-all duration-300
              dark:bg-indigo-500
            "
            style={{
              width: `${total > 0 ? (answeredCount / total) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Question buttons */}
      <div className="px-5 py-5">
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8">
          {Array.from({ length: total }, (_, index) => {
            const key = String(index);
            const isCurrent = index === current;
            const isAnswered =
              answers[key] !== undefined && answers[key] !== "";
            const isMarked = marked.includes(key);

            return (
              <button
                key={key}
                type="button"
                onClick={() => onGo(index)}
                aria-label={`Go to question ${index + 1}${
                  isAnswered ? ", answered" : ", unanswered"
                }${isMarked ? ", marked for review" : ""}`}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-xl border",
                  "text-sm font-bold transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                  "dark:focus-visible:ring-offset-slate-900",

                  // Current
                  isCurrent &&
                    "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-500",

                  // Answered
                  !isCurrent &&
                    isAnswered &&
                    "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/50",

                  // Unanswered
                  !isCurrent &&
                    !isAnswered &&
                    "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300",
                )}
              >
                {isAnswered && !isCurrent ? (
                  <Check
                    className="absolute right-1 top-1 h-3 w-3 text-emerald-600 dark:text-emerald-400"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                ) : null}

                <span>{index + 1}</span>

                {/* Marked indicator */}
                {isMarked && (
                  <span
                    className={cn(
                      "absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2",
                      isCurrent
                        ? "border-indigo-600 bg-amber-500 text-white dark:border-indigo-500"
                        : "border-white bg-amber-500 text-white dark:border-slate-900",
                    )}
                    title="Marked for review"
                  >
                    <Flag className="h-2.5 w-2.5" fill="currentColor" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        className="
          border-t border-slate-200
          bg-slate-50/50
          px-5 py-4
          dark:border-slate-800
          dark:bg-slate-950/30
        "
      >
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Legend
            className="bg-indigo-600 dark:bg-indigo-500"
            label="Current"
            darkText={false}
          />

          <Legend
            className="border border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30"
            label="Answered"
          />

          <Legend
            className="border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            label="Unanswered"
          />

          <Legend
            className="bg-amber-500"
            label={`Marked${markedCount > 0 ? ` (${markedCount})` : ""}`}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {unansweredCount} unanswered
          </span>

          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {answeredCount === total && total > 0
              ? "All questions answered"
              : `${total - answeredCount} remaining`}
          </span>
        </div>
      </div>
    </aside>
  );
}

function Legend({
  className,
  label,
  darkText = true,
}: {
  className: string;
  label: string;
  darkText?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "h-3 w-3 shrink-0 rounded-full",
          className,
        )}
      />

      <span
        className={cn(
          "text-[11px] font-medium",
          darkText
            ? "text-slate-600 dark:text-slate-400"
            : "text-slate-600 dark:text-slate-300",
        )}
      >
        {label}
      </span>
    </div>
  );
}

