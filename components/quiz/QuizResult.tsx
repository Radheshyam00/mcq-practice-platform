
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleX,
  RotateCcw,
  Trophy,
} from "lucide-react";

type QuizResultData = {
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  percentage: number;
};

type QuizResultProps = {
  result: QuizResultData;
};

export function QuizResult({ result }: QuizResultProps) {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round(result.percentage)),
  );

  const getPerformance = () => {
    if (percentage >= 90) {
      return {
        title: "Outstanding!",
        description: "Excellent work. You have mastered this quiz.",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/60",
      };
    }

    if (percentage >= 75) {
      return {
        title: "Great job!",
        description: "Strong performance. Keep building on your progress.",
        className:
          "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-900/60",
      };
    }

    if (percentage >= 50) {
      return {
        title: "Good effort!",
        description: "You're making progress. A little more practice will help.",
        className:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/60",
      };
    }

    return {
      title: "Keep practicing!",
      description: "Review the topics and try the quiz again.",
      className:
        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/60",
    };
  };

  const performance = getPerformance();

  const scoreCircumference = 2 * Math.PI * 42;
  const scoreOffset =
    scoreCircumference -
    (percentage / 100) * scoreCircumference;

  return (
    <div
      className="
        mx-auto w-full max-w-3xl
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
          relative overflow-hidden
          border-b border-slate-200
          bg-slate-50/70
          px-5 py-8 text-center
          dark:border-slate-800
          dark:bg-slate-950/40
          sm:px-8
        "
      >
        {/* Decorative background */}
        <div
          className="
            pointer-events-none absolute -left-16 -top-16
            h-40 w-40 rounded-full
            bg-indigo-500/10 blur-3xl
          "
        />

        <div
          className="
            pointer-events-none absolute -bottom-20 -right-10
            h-44 w-44 rounded-full
            bg-emerald-500/10 blur-3xl
          "
        />

        <div className="relative">
          {/* Trophy */}
          <div
            className="
              mx-auto flex h-12 w-12 items-center justify-center
              rounded-2xl
              bg-indigo-100
              text-indigo-600
              dark:bg-indigo-500/10
              dark:text-indigo-400
            "
          >
            <Trophy className="h-6 w-6" aria-hidden="true" />
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Quiz Result
          </p>

          <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Quiz completed!
          </h1>
        </div>
      </div>

      {/* Score */}
      <div className="px-5 py-8 sm:px-8">
        <div className="flex flex-col items-center">
          <div className="relative h-40 w-40">
            <svg
              className="h-full w-full -rotate-90"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100 dark:text-slate-800"
              />

              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={scoreCircumference}
                strokeDashoffset={scoreOffset}
                className="text-indigo-600 transition-all duration-700 dark:text-indigo-500"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {percentage}%
              </span>

              <span className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                Score
              </span>
            </div>
          </div>

          {/* Performance badge */}
          <div
            className={`
              mt-6 rounded-full border
              px-4 py-2
              text-sm font-bold
              ${performance.className}
            `}
          >
            {performance.title}
          </div>

          <p className="mt-3 max-w-md text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
            {performance.description}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultStat
            icon={
              <CheckCircle2
                className="h-5 w-5"
                aria-hidden="true"
              />
            }
            value={result.correct}
            label="Correct"
            className="
              border-emerald-200 bg-emerald-50
              text-emerald-600
              dark:border-emerald-900/60
              dark:bg-emerald-950/30
              dark:text-emerald-400
            "
          />

          <ResultStat
            icon={
              <CircleX
                className="h-5 w-5"
                aria-hidden="true"
              />
            }
            value={result.wrong}
            label="Wrong"
            className="
              border-rose-200 bg-rose-50
              text-rose-600
              dark:border-rose-900/60
              dark:bg-rose-950/30
              dark:text-rose-400
            "
          />

          <ResultStat
            value={result.skipped}
            label="Skipped"
            className="
              border-amber-200 bg-amber-50
              text-amber-600
              dark:border-amber-900/60
              dark:bg-amber-950/30
              dark:text-amber-400
            "
          />

          <ResultStat
            value={result.total}
            label="Total"
            className="
              border-slate-200 bg-slate-50
              text-slate-600
              dark:border-slate-800
              dark:bg-slate-950
              dark:text-slate-300
            "
          />
        </div>

        {/* Accuracy summary */}
        <div
          className="
            mt-5 rounded-2xl
            border border-slate-200
            bg-slate-50
            p-4
            dark:border-slate-800
            dark:bg-slate-950/50
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Overall accuracy
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {result.correct} correct out of {result.total} questions
              </p>
            </div>

            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {percentage}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-700 dark:bg-indigo-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/exams"
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl
              bg-indigo-600
              px-5 py-3
              text-sm font-bold text-white
              shadow-sm shadow-indigo-500/20
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-indigo-700
              hover:shadow-md
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2
              dark:focus-visible:ring-offset-slate-900
            "
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Practice Again
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <Link
            href="/"
            className="
              inline-flex items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white
              px-5 py-3
              text-sm font-bold
              text-slate-700
              transition-all duration-200
              hover:border-slate-300
              hover:bg-slate-50
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-200
              dark:hover:border-slate-600
              dark:hover:bg-slate-800
            "
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ResultStat({
  icon,
  value,
  label,
  className,
}: {
  icon?: React.ReactNode;
  value: number;
  label: string;
  className: string;
}) {
  return (
    <div
      className={`
        rounded-2xl border p-4
        text-center
        transition-transform duration-200
        hover:-translate-y-0.5
        ${className}
      `}
    >
      {icon && (
        <div className="mb-2 flex justify-center">
          {icon}
        </div>
      )}

      <div className="text-xl font-black">{value}</div>

      <p className="mt-1 text-xs font-semibold opacity-75">
        {label}
      </p>
    </div>
  );
}

