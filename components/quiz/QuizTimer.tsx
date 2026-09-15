
"use client";

import { Clock, AlertTriangle } from "lucide-react";
import { formatTime } from "@/lib/utils";

type QuizTimerProps = {
  seconds: number;
};

export function QuizTimer({ seconds }: QuizTimerProps) {
  const safeSeconds = Math.max(0, seconds);

  const isCritical = safeSeconds < 30;
  const isWarning = safeSeconds < 60 && !isCritical;

  const containerClass = isCritical
    ? `
        border-red-200
        bg-red-50
        text-red-700
        dark:border-red-900/60
        dark:bg-red-950/40
        dark:text-red-300
      `
    : isWarning
      ? `
          border-amber-200
          bg-amber-50
          text-amber-700
          dark:border-amber-900/60
          dark:bg-amber-950/40
          dark:text-amber-300
        `
      : `
          border-slate-200
          bg-slate-50
          text-slate-700
          dark:border-slate-700
          dark:bg-slate-800
          dark:text-slate-200
        `;

  return (
    <div
      role="timer"
      aria-live={isCritical ? "assertive" : "polite"}
      aria-label={`Time remaining: ${formatTime(safeSeconds)}`}
      className={`
        inline-flex items-center gap-2.5
        rounded-xl
        border
        px-3.5 py-2
        text-sm font-bold
        shadow-sm
        transition-all duration-200
        ${isCritical ? "animate-pulse" : ""}
        ${containerClass}
      `}
    >
      <span
        className={`
          flex h-7 w-7 items-center justify-center
          rounded-lg
          ${
            isCritical
              ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              : isWarning
                ? "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                : "bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400"
          }
        `}
      >
        {isCritical ? (
          <AlertTriangle
            className="h-4 w-4"
            strokeWidth={2.3}
            aria-hidden="true"
          />
        ) : (
          <Clock
            className="h-4 w-4"
            strokeWidth={2.3}
            aria-hidden="true"
          />
        )}
      </span>

      <div className="flex items-center gap-2">
        <span className="hidden text-xs font-semibold opacity-70 sm:inline">
          Time
        </span>

        <span className="font-mono tabular-nums tracking-wide">
          {formatTime(safeSeconds)}
        </span>
      </div>
    </div>
  );
}

