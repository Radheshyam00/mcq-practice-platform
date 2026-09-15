
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  Trophy,
  XCircle,
} from "lucide-react";

const results = [
  {
    name: "Aarav Sharma",
    exam: "Computer Instructor",
    score: 92,
    correct: 46,
    total: 50,
    time: "24 min",
  },
  {
    name: "Priya Singh",
    exam: "Cybersecurity",
    score: 86,
    correct: 43,
    total: 50,
    time: "27 min",
  },
  {
    name: "Radheshyam",
    exam: "SSC CGL",
    score: 78,
    correct: 39,
    total: 50,
    time: "29 min",
  },
  {
    name: "Neha Verma",
    exam: "Computer Science",
    score: 68,
    correct: 34,
    total: 50,
    time: "30 min",
  },
];

export default function AdminResultsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin Dashboard
        </Link>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <BarChart3 className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black">Results</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Monitor quiz and mock test performance.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <Stat
              icon={<Trophy className="h-5 w-5" />}
              title="Average Score"
              value="81%"
            />

            <Stat
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Completed"
              value="2,481"
            />

            <Stat
              icon={<Clock3 className="h-5 w-5" />}
              title="Attempts Today"
              value="184"
            />
          </div>

          <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 dark:bg-slate-950">
                <tr>
                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Student
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Exam
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Score
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Correct
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((result) => (
                  <tr key={`${result.name}-${result.exam}`}>
                    <td className="px-5 py-4 text-sm font-bold">
                      {result.name}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {result.exam}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-black ${
                          result.score >= 80
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : result.score >= 60
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                              : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        }`}
                      >
                        {result.score}%
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold">
                      {result.correct}/{result.total}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {result.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500">{title}</p>
          <p className="mt-1 text-xl font-black">{value}</p>
        </div>
      </div>
    </div>
  );
}

