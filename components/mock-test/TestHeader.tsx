
type TestHeaderProps = {
  title: string;
};

export function TestHeader({ title }: TestHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl dark:bg-indigo-500/10" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl" />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
            <path d="M8 13h8" />
            <path d="M8 17h5" />
          </svg>
        </div>

        <div className="min-w-0">
          <div className="mb-1 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            Timed Mock Test
          </div>

          <h1 className="wrap-break-word text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {title}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Test your knowledge under exam-like conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
