"use client";

import { signOut, useSession } from "next-auth/react";
import {
  Award,
  BookOpen,
  Clock3,
  LogOut,
  Target,
  Trophy,
  User,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  const userName = session?.user?.name || "Student";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <BookOpen size={20} />
            </div>

            <div>
              <p className="font-black">MCQ Practice</p>
              <p className="text-xs text-slate-500">
                Student Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              signOut({
                callbackUrl: "/login",
              })
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl dark:bg-slate-900 sm:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-300">
                Welcome back
              </p>

              <h1 className="text-3xl font-black sm:text-4xl">
                {userName}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                Continue practicing multiple-choice questions,
                track your progress and prepare for your exams.
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <User size={30} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<BookOpen size={21} />}
            title="Questions"
            value="0"
            description="Attempted"
          />

          <StatCard
            icon={<Target size={21} />}
            title="Accuracy"
            value="0%"
            description="Overall accuracy"
          />

          <StatCard
            icon={<Trophy size={21} />}
            title="Rank"
            value="#--"
            description="Leaderboard"
          />

          <StatCard
            icon={<Clock3 size={21} />}
            title="Practice"
            value="0h"
            description="Total time"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  Start Practice
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Choose an exam and start solving questions.
                </p>
              </div>

              <BookOpen className="text-slate-400" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Computer Science",
                "Cyber Security",
                "Networking",
                "General Knowledge",
              ].map((exam) => (
                <button
                  key={exam}
                  className="rounded-2xl border border-slate-200 p-5 text-left transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md dark:border-slate-700 dark:hover:border-slate-500"
                >
                  <h3 className="font-bold">{exam}</h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Practice MCQs
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                <Award size={20} />
              </div>

              <div>
                <h2 className="font-black">Your Progress</h2>
                <p className="text-xs text-slate-500">
                  This week
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No activity yet
              </p>

              <p className="mt-2 text-2xl font-black">
                Start practicing
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
        {icon}
      </div>

      <p className="text-sm font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-black">{value}</p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}