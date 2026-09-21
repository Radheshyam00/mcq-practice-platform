import { connectDB } from "@/lib/mongodb";
import { Result } from "@/models/Result";

type LeaderboardRow = {
  name: string;
  accuracy: number;
  points: number;
  attempts: number;
};

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

export default async function LeaderboardPage() {
  await connectDB();

  /*
   * Current weekly period
   *
   * Monday 00:00 → now
   */
  const now = new Date();

  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();

  const daysFromMonday = day === 0 ? 6 : day - 1;

  startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  /*
   * Aggregate weekly results.
   *
   * Accuracy:
   *   total correct / total questions
   *
   * Points:
   *   total correct answers × 10
   */
  const leaderboard = await Result.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfWeek,
          $lte: now,
        },
      },
    },

    {
      $group: {
        _id: "$userId",

        name: {
          $last: "$studentName",
        },

        totalCorrect: {
          $sum: "$correct",
        },

        totalQuestions: {
          $sum: "$totalQuestions",
        },

        attempts: {
          $sum: 1,
        },
      },
    },

    {
      $project: {
        _id: 0,
        name: 1,
        totalCorrect: 1,
        totalQuestions: 1,
        attempts: 1,

        accuracy: {
          $cond: [
            {
              $gt: ["$totalQuestions", 0],
            },
            {
              $multiply: [
                {
                  $divide: [
                    "$totalCorrect",
                    "$totalQuestions",
                  ],
                },
                100,
              ],
            },
            0,
          ],
        },

        points: {
          $multiply: ["$totalCorrect", 10],
        },
      },
    },

    {
      $sort: {
        accuracy: -1,
        points: -1,
        attempts: -1,
      },
    },

    {
      $limit: 50,
    },
  ]);

  const rows: LeaderboardRow[] = leaderboard.map((item) => ({
    name: item.name || "Unknown User",
    accuracy: Math.round(item.accuracy || 0),
    points: item.points || 0,
    attempts: item.attempts || 0,
  }));

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
              See how learners are performing this week based on accuracy and
              points earned from completed tests.
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
                  This Week
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

        {/* Empty state */}
        {rows.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="text-4xl">🏆</div>

            <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
              No rankings yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Complete a practice session or mock test this week to appear on
              the leaderboard.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[650px] text-left">
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
                  {rows.map((row, index) => {
                    const rank = index + 1;
                    const rankStyle = getRankStyle(rank);

                    return (
                      <tr
                        key={`${row.name}-${rank}`}
                        className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50 dark:border-slate-800/80 dark:hover:bg-slate-800/40"
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
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {row.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {row.name}
                              </span>

                              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                {row.attempts}{" "}
                                {row.attempts === 1
                                  ? "attempt"
                                  : "attempts"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            {row.accuracy}%
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <span className="font-black text-indigo-600 dark:text-indigo-400">
                            {row.points.toLocaleString()}
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
              {rows.map((row, index) => {
                const rank = index + 1;
                const rankStyle = getRankStyle(rank);

                return (
                  <div
                    key={`${row.name}-${rank}`}
                    className="p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${rankStyle.badge}`}
                      >
                        {rank <= 3 ? rankStyle.icon : `#${rank}`}
                      </div>

                      {/* Avatar */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {row.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name */}
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-slate-900 dark:text-white">
                          {row.name}
                        </span>

                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {row.accuracy}% accuracy · {row.attempts}{" "}
                          {row.attempts === 1 ? "attempt" : "attempts"}
                        </p>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                          {row.points.toLocaleString()}
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
        )}

        {/* Bottom note */}
        <div className="mt-5 flex items-center justify-center text-center">
          <p className="text-xs leading-5 text-slate-400 dark:text-slate-500">
            Rankings are calculated from results completed during the current
            week.
          </p>
        </div>
      </main>
    </div>
  );
}