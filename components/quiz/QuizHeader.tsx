
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

type QuizHeaderProps = {
  title: string;
};

export function QuizHeader({ title }: QuizHeaderProps) {
  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-slate-200
        bg-white/95
        backdrop-blur
        dark:border-slate-800
        dark:bg-slate-950/95
      "
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="
            group flex shrink-0 items-center gap-2
            rounded-xl
            px-2 py-1.5
            transition-colors
            hover:bg-slate-100
            dark:hover:bg-slate-900
          "
          aria-label="Go to MCQ Practice home"
        >
          <span
            className="
              flex h-9 w-9 items-center justify-center
              rounded-xl
              bg-indigo-600
              text-white
              shadow-sm
              shadow-indigo-500/20
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            <BookOpen
              className="h-5 w-5"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </span>

          <span className="hidden text-base font-black tracking-tight text-slate-900 dark:text-white sm:block">
            <span className="text-indigo-600 dark:text-indigo-400">
              MCQ
            </span>{" "}
            Practice
          </span>
        </Link>

        {/* Quiz title */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

          <div className="min-w-0">
            <p className="hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:block">
              Quiz
            </p>

            <h1
              className="
                max-w-45 truncate
                text-sm font-bold
                text-slate-800
                dark:text-slate-200
                sm:max-w-md sm:text-base
              "
              title={title}
            >
              {title}
            </h1>
          </div>
        </div>

        {/* Home / exit */}
        <Link
          href="/"
          className="
            hidden items-center gap-2
            rounded-xl
            border border-slate-200
            bg-white
            px-3 py-2
            text-xs font-semibold
            text-slate-600
            transition-all
            hover:border-slate-300
            hover:bg-slate-50
            hover:text-slate-900
            sm:flex
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-300
            dark:hover:border-slate-600
            dark:hover:bg-slate-800
            dark:hover:text-white
          "
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Exit Quiz
        </Link>
      </div>
    </header>
  );
}

