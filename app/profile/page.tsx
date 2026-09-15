
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Edit3,
  GraduationCap,
  Mail,
  ShieldCheck,
  Trophy,
  User,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </span>

            <span className="hidden text-lg font-black sm:block">
              <span className="text-indigo-600 dark:text-indigo-400">MCQ</span>{" "}
              Practice
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Page heading */}
        <div className="mb-6">
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal information and view your learning progress.
          </p>
        </div>

        {/* Profile hero */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-indigo-100 text-3xl font-black text-indigo-700 shadow-lg dark:border-slate-900 dark:bg-indigo-500/10 dark:text-indigo-400">
                  R
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-black">Radheshyam</h2>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Active
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Student · MCQ Practice Member
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          {/* Personal information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <User className="h-5 w-5" />
              </span>

              <div>
                <h2 className="font-black">Personal Information</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your account details
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Info
                icon={<User className="h-4 w-4" />}
                label="Full Name"
                value="Radheshyam"
              />

              <Info
                icon={<Mail className="h-4 w-4" />}
                label="Email Address"
                value="user@example.com"
              />

              <Info
                icon={<GraduationCap className="h-4 w-4" />}
                label="Account Type"
                value="Student"
              />

              <Info
                icon={<CalendarDays className="h-4 w-4" />}
                label="Member Since"
                value="September 2026"
              />
            </div>
          </section>

          {/* Learning stats */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Trophy className="h-5 w-5" />
              </span>

              <div>
                <h2 className="font-black">Learning Statistics</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your preparation overview
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Stat
                icon={<BookOpen className="h-4 w-4" />}
                label="Questions Practiced"
                value="128"
              />

              <Stat
                icon={<Trophy className="h-4 w-4" />}
                label="Mock Tests Completed"
                value="12"
              />

              <Stat
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Average Accuracy"
                value="78%"
              />

              <Stat
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Best Score"
                value="94%"
              />
            </div>
          </section>
        </div>

        {/* Account security */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </span>

              <div>
                <h2 className="font-black">Account Security</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Keep your account protected
                </p>
              </div>
            </div>

            <Link
              href="/settings"
              className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
            >
              Security Settings
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </div>

      <p className="mt-2 break-words text-sm font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
        {icon}
      </span>

      <span className="min-w-0 flex-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <strong className="text-sm font-black">{value}</strong>
    </div>
  );
}

