
"use client";

import { Check, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

type OptionButtonProps = {
  id: string;
  text: string;
  selected?: boolean;
  correct?: boolean;
  wrong?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function OptionButton({
  id,
  text,
  selected = false,
  correct = false,
  wrong = false,
  disabled = false,
  onClick,
}: OptionButtonProps) {
  const stateClasses = correct
    ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500/80 dark:bg-emerald-950/30"
    : wrong
      ? "border-red-500 bg-red-50 dark:border-red-500/80 dark:bg-red-950/30"
      : selected
        ? "border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-500/80 dark:bg-indigo-950/40"
        : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/60 dark:hover:bg-indigo-950/20";

  const badgeClasses = correct
    ? "border-emerald-500 bg-emerald-500 text-white"
    : wrong
      ? "border-red-500 bg-red-500 text-white"
      : selected
        ? "border-indigo-500 bg-indigo-600 text-white"
        : "border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl border p-4 text-left",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        "dark:focus-visible:ring-offset-slate-950",
        "hover:-translate-y-0.5 hover:shadow-sm",
        "disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
        stateClasses,
      )}
    >
      {/* Option letter */}
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
          "text-sm font-bold uppercase transition-all duration-200",
          badgeClasses,
        )}
      >
        {correct ? (
          <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        ) : wrong ? (
          <CircleX
            className="h-4 w-4"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        ) : (
          id
        )}
      </span>

      {/* Option text */}
      <span
        className={cn(
          "min-w-0 flex-1 text-sm font-medium leading-6",
          correct
            ? "text-emerald-800 dark:text-emerald-200"
            : wrong
              ? "text-red-800 dark:text-red-200"
              : selected
                ? "text-indigo-900 dark:text-indigo-100"
                : "text-slate-700 dark:text-slate-200",
        )}
      >
        {text}
      </span>

      {/* Status indicator */}
      {correct && (
        <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          Correct
        </span>
      )}

      {wrong && (
        <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
          Wrong
        </span>
      )}
    </button>
  );
}

