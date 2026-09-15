
export function TestInstructions() {
  const instructions = [
    {
      title: "Read carefully",
      description: "Read every question and all options carefully before answering.",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
        </svg>
      ),
    },
    {
      title: "Manage your time",
      description: "Keep an eye on the timer and distribute your time wisely.",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
    },
    {
      title: "Navigate freely",
      description: "Move between questions whenever you need to review an answer.",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      ),
    },
    {
      title: "Submit on time",
      description: "Make sure you submit your test before the timer reaches zero.",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12.5 9.5 17 19 7" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
    },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 11h6" />
            <path d="M9 15h6" />
            <path d="M9 7h6" />
            <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Instructions
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Keep these points in mind before starting your test.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 space-y-3">
        {instructions.map((item, index) => (
          <div
            key={item.title}
            className="group flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/5"
          >
            {/* Number */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-slate-400 shadow-sm dark:bg-slate-900 dark:text-slate-500">
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* Icon */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              {item.icon}
            </div>

            {/* Text */}
            <div className="min-w-0 pt-0.5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.3 3.9 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>

        <p className="text-xs leading-5 text-amber-800 dark:text-amber-300">
          <span className="font-bold">Tip:</span> Stay focused and avoid
          spending too much time on a single question.
        </p>
      </div>
    </section>
  );
}
