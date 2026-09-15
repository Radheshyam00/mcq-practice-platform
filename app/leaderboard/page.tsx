const rows = [
  ["Aarav Sharma", 98, 1240],
  ["Priya Singh", 96, 1190],
  ["Radheshyam", 92, 1050],
  ["Neha Verma", 90, 980],
  ["Vikram Patel", 88, 910],
] as const;

function getRankStyle(rank: number) {
  if (rank === 1) {
    return {
      badge:
        "bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-900/60",
      icon: "🏆",
    };
  }

  if (rank === 2) {
    return {
      badge:
        "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
      icon: "🥈",
    };
  }

  if (rank === 3) {
    return {
      badge:
        "bg-orange-100 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:ring-orange-900/60",
      icon: "🥉",
    };
  }

  return {
    badge:
      "bg-slate-100 text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
    icon: `#${rank}`,
  };
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-indigo-500"
              />
              Weekly Rankings
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Leaderboard
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
              See how you compare with other learners and compete for the top
              spot by improving your accuracy and points.
            </p>

            {/* Stats */}
            <div className="mt-7 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="font-black text-indigo-600 dark:text-indigo-400">
                  {rows.length}
                </span>

                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Top Learners
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Weekly Ranking
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* Section heading */}
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Top Performers
            </h2>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Keep practicing to climb the rankings.
            </p>
          </div>

          <div className="hidden rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200 sm:block dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
            This Week
          </div>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-162.5 text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/70">
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Rank
                  </th>

                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Learner
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Accuracy
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Points
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map(([name, accuracy, points], index) => {
                  const rank = index + 1;
                  const rankStyle = getRankStyle(rank);
                  const isCurrentUser = name === "Radheshyam";

                  return (
                    <tr
                      key={name}
                      className={`
                        border-b border-slate-100 transition-colors last:border-b-0
                        dark:border-slate-800/80
                        ${
                          isCurrentUser
                            ? "bg-indigo-50/70 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/30"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        }
                      `}
                    >
                      <td className="px-6 py-5">
                        <div
                          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-2 text-sm font-black ${rankStyle.badge}`}
                        >
                          {rank <= 3 ? rankStyle.icon : `#${rank}`}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                              flex h-10 w-10 shrink-0 items-center justify-center
                              rounded-full text-sm font-black
                              ${
                                isCurrentUser
                                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                              }
                            `}
                          >
                            {name.charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {name}
                              </span>

                              {isCurrentUser && (
                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                  You
                                </span>
                              )}
                            </div>

                            {rank === 1 && (
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                Current leader
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {accuracy}%
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <span className="font-black text-indigo-600 dark:text-indigo-400">
                          {points.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
            {rows.map(([name, accuracy, points], index) => {
              const rank = index + 1;
              const rankStyle = getRankStyle(rank);
              const isCurrentUser = name === "Radheshyam";

              return (
                <div
                  key={name}
                  className={`
                    p-4 transition-colors
                    ${
                      isCurrentUser
                        ? "bg-indigo-50/70 dark:bg-indigo-950/20"
                        : ""
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${rankStyle.badge}`}
                    >
                      {rank <= 3 ? rankStyle.icon : `#${rank}`}
                    </div>

                    {/* Avatar */}
                    <div
                      className={`
                        flex h-11 w-11 shrink-0 items-center justify-center
                        rounded-full text-sm font-black
                        ${
                          isCurrentUser
                            ? "bg-indigo-600 text-white dark:bg-indigo-500"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }
                      `}
                    >
                      {name.charAt(0)}
                    </div>

                    {/* Name */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-bold text-slate-900 dark:text-white">
                          {name}
                        </span>

                        {isCurrentUser && (
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                            You
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {accuracy}% accuracy
                      </p>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        {points.toLocaleString()}
                      </p>

                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Points
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-5 flex items-center justify-center text-center">
          <p className="text-xs leading-5 text-slate-400 dark:text-slate-500">
            Rankings are based on weekly accuracy and points.
          </p>
        </div>
      </main>
    </div>
  );
}