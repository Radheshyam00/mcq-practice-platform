"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  LogOut,
  Target,
  Trophy,
  User,
} from "lucide-react";

type DashboardStats = {
  questionsAttempted: number;
  accuracy: number;
  totalTimeSeconds: number;
  completedTests: number;
  rank: number | null;
};

type RecentResult = {
  id: string;
  examName: string;
  score: number;
  correct: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  type: "practice" | "mock-test" | "daily-quiz";
  createdAt: string;
};

type Exam = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  totalQuestions: number;
  durationMinutes: number;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [stats, setStats] = useState<DashboardStats>({
    questionsAttempted: 0,
    accuracy: 0,
    totalTimeSeconds: 0,
    completedTests: 0,
    rank: null,
  });

  const [recentResults, setRecentResults] = useState<RecentResult[]>(
    []
  );

  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(true);

  const userName = session?.user?.name || "Student";

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    loadDashboard();
  }, [status]);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await fetch("/api/dashboard", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load dashboard"
        );
      }

      setStats(
        data.stats || {
          questionsAttempted: 0,
          accuracy: 0,
          totalTimeSeconds: 0,
          completedTests: 0,
          rank: null,
        }
      );

      setRecentResults(data.recentResults || []);
      setExams(data.exams || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatTime(seconds: number) {
    if (!seconds || seconds <= 0) {
      return "0h";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-sm font-semibold text-slate-500">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome */}
        <Link
          href="/profile"
          className="block rounded-3xl bg-slate-900 p-7 text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl dark:bg-slate-900 sm:p-10"
        >
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

              <p className="mt-4 text-sm font-semibold text-white/80">
                View your profile →
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <User size={30} />
            </div>
          </div>
        </Link>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<BookOpen size={21} />}
            title="Questions"
            value={stats.questionsAttempted.toLocaleString()}
            description="Attempted"
          />

          <StatCard
            icon={<Target size={21} />}
            title="Accuracy"
            value={`${stats.accuracy}%`}
            description="Overall accuracy"
          />

          <StatCard
            icon={<Trophy size={21} />}
            title="Rank"
            value={
              stats.rank
                ? `#${stats.rank.toLocaleString()}`
                : "#--"
            }
            description="Leaderboard"
          />

          <StatCard
            icon={<Clock3 size={21} />}
            title="Practice"
            value={formatTime(stats.totalTimeSeconds)}
            description="Total time"
          />
        </div>

        {/* Main Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Start Practice */}
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

            {loading ? (
              <div className="rounded-2xl border border-slate-200 p-6 text-center text-sm font-semibold text-slate-500 dark:border-slate-800">
                Loading exams...
              </div>
            ) : exams.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                <BookOpen className="mx-auto text-slate-400" />

                <p className="mt-3 font-bold">
                  No exams available
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Active exams will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {exams.map((exam) => (
                  <Link
                    key={exam._id}
                    href={`/exams/${exam.slug}/practice`}
                    className="group rounded-2xl border border-slate-200 p-5 text-left transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md dark:border-slate-700 dark:hover:border-slate-500"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {exam.name}
                      </h3>

                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        Practice
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {exam.description ||
                        "Practice MCQs for this exam."}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-400">
                      <span>
                        {exam.totalQuestions.toLocaleString()}+
                        questions
                      </span>

                      <span>
                        {exam.durationMinutes} min
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-5">
              <Link
                href="/exams"
                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                View All Exams
              </Link>
            </div>
          </div>

          {/* Progress */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                <Award size={20} />
              </div>

              <div>
                <h2 className="font-black">
                  Your Progress
                </h2>

                <p className="text-xs text-slate-500">
                  Overall performance
                </p>
              </div>
            </div>

            {recentResults.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No activity yet
                </p>

                <p className="mt-2 text-2xl font-black">
                  Start practicing
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Complete your first quiz or mock test to
                  see your progress here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentResults.slice(0, 4).map((result) => (
                  <div
                    key={result.id}
                    className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {result.examName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {result.correct}/
                          {result.totalQuestions} correct
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${
                          result.score >= 80
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : result.score >= 60
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                              : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        }`}
                      >
                        {result.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {recentResults.length > 0 && (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your latest practice and test results.
                </p>
              </div>

              <CheckCircle2 className="text-slate-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">
                      Exam
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">
                      Type
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">
                      Score
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">
                      Correct
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentResults.map((result) => (
                    <tr key={result.id}>
                      <td className="px-4 py-4 text-sm font-bold">
                        {result.examName}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                          {result.type === "mock-test"
                            ? "Mock Test"
                            : result.type === "daily-quiz"
                              ? "Daily Quiz"
                              : "Practice"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-sm font-black">
                          {result.score}%
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {result.correct}/
                        {result.totalQuestions}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {formatTime(
                          result.timeTakenSeconds
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
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

      <p className="mt-1 text-2xl font-black">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}