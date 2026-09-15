
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Connect your authentication API here.
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left branding */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_35%)]" />

          <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                <BookOpen className="h-5 w-5" />
              </span>

              <span className="text-lg font-black text-white">
                <span className="text-indigo-400">MCQ</span> Practice
              </span>
            </Link>

            <div className="max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Smart Exam Preparation
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight text-white xl:text-5xl">
                Practice smarter.
                <span className="block text-indigo-400">
                  Perform better.
                </span>
              </h1>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                Practice thousands of multiple-choice questions, take mock
                tests, track your performance, and prepare confidently for
                competitive exams.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <Feature value="1K+" label="Questions" />
                <Feature value="18+" label="Exams" />
                <Feature value="64+" label="Mock Tests" />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              © 2026 MCQ Practice. All rights reserved.
            </p>
          </div>
        </section>

        {/* Login */}
        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mx-auto flex w-fit items-center gap-2 lg:hidden"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="font-black">
                <span className="text-indigo-600 dark:text-indigo-400">
                  MCQ
                </span>{" "}
                Practice
              </span>
            </Link>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 lg:mt-0">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <LockKeyhole className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-2xl font-black">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Sign in to continue your exam preparation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Email address
                  </span>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900"
                    />
                  </div>
                </label>

                <label className="block">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold">Password</span>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded accent-indigo-600"
                  />

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Remember me
                  </span>
                </label>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs text-slate-400">OR</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Create account
                </Link>
              </p>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              By signing in, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

