"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Play,
  Sparkles,
  Trophy,
} from "lucide-react";

type TestCardProps = {
  id: string;
  title: string;
  slug: string;
  description: string;
  examId?: string;
  examName?: string;
  examSlug?: string;
  questions: number;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  demo?: boolean;
  isActive?: boolean;
  isLoggedIn?: boolean;
};

export function TestCard({
  title,
  slug,
  description,
  examName,
  questions,
  duration,
  difficulty,
  demo = false,
  isLoggedIn = false,
}: TestCardProps) {
  /*
   * Access rule:
   *
   * Logged in:
   *   - Can start every active mock test.
   *
   * Logged out:
   *   - Can start only demo mock test.
   */
  const locked = !isLoggedIn && !demo;

  const difficultyClass =
    difficulty === "Easy"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-900/50"
      : difficulty === "Medium"
        ? "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-900/50"
        : difficulty === "Hard"
          ? "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-900/50"
          : "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:ring-violet-900/50";

  return (
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-2xl",
        "border bg-white shadow-sm transition-all duration-300",
        "dark:bg-slate-900",
        locked
          ? "border-slate-200 dark:border-slate-800"
          : "border-slate-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:hover:border-indigo-800",
      ].join(" ")}
    >
      {/* Top gradient */}
      <div
        className={[
          "h-1.5 w-full",
          locked
            ? "bg-slate-300 dark:bg-slate-700"
            : "bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500",
        ].join(" ")}
      />

      <div className="flex flex-1 flex-col p-6">
        {/* Badges */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {demo && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-900/60">
                <Sparkles className="h-3.5 w-3.5" />
                Demo
              </span>
            )}

            {isLoggedIn && !demo && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900/50">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Unlocked
              </span>
            )}

            {locked && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
                <LockKeyhole className="h-3.5 w-3.5" />
                Login Required
              </span>
            )}
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${difficultyClass}`}
          >
            {difficulty}
          </span>
        </div>

        {/* Icon */}
        <div
          className={[
            "mt-6 flex h-14 w-14 items-center justify-center rounded-2xl",
            locked
              ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
              : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
          ].join(" ")}
        >
          {locked ? (
            <LockKeyhole className="h-7 w-7" />
          ) : (
            <Trophy className="h-7 w-7" />
          )}
        </div>

        {/* Content */}
        <h3 className="mt-5 text-xl font-black tracking-tight text-slate-900 dark:text-white">
          {title}
        </h3>

        {/* Exam name */}
        {examName && (
          <div className="mt-2 text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {examName}
          </div>
        )}

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description || "Test your knowledge with this mock examination."}
        </p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-xs font-semibold text-slate-400">
              Questions
            </div>

            <div className="mt-1 text-base font-black text-slate-900 dark:text-white">
              {questions}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
              <Clock3 className="h-3.5 w-3.5" />
              Duration
            </div>

            <div className="mt-1 text-base font-black text-slate-900 dark:text-white">
              {duration} min
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-auto pt-6">
          {locked ? (
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(
                `/mock-tests/${slug}`,
              )}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
            >
              <LockKeyhole className="h-4 w-4" />
              Login to Start
            </Link>
          ) : (
            <Link
              href={`/mock-tests/${slug}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
            >
              <Play className="h-4 w-4 fill-current" />
              Start Mock Test
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}