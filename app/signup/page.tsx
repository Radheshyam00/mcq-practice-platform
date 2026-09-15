
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Connect your registration API here.
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Branding */}
          <section className="relative hidden overflow-hidden bg-slate-950 p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

            <Link href="/" className="relative flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <BookOpen className="h-5 w-5" />
              </span>

              <span className="font-black text-white">
                <span className="text-indigo-400">MCQ</span> Practice
              </span>
            </Link>

            <div className="relative">
              <h1 className="text-3xl font-black leading-tight text-white xl:text-4xl">
                Start your
                <span className="block text-indigo-400">
                  preparation today.
                </span>
              </h1>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Create your free account and keep track of your practice,
                mock tests, results and progress.
              </p>

              <div className="mt-7 space-y-3">
                <Benefit text="Practice exam-specific questions" />
                <Benefit text="Take timed mock tests" />
                <Benefit text="Track your performance" />
                <Benefit text="Review your quiz results" />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Free exam preparation platform
            </p>
          </section>

          {/* Form */}
          <section className="p-5 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <Link
                href="/"
                className="flex w-fit items-center gap-2 lg:hidden"
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

              <div className="mt-8 lg:mt-0">
                <h2 className="text-2xl font-black sm:text-3xl">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Join MCQ Practice and start preparing for your exams.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Full name
                  </span>

                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900"
                    />
                  </div>
                </label>

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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Password
                  </span>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Confirm password
                  </span>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </label>

                <label className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 rounded accent-indigo-600"
                  />

                  <span className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                    I agree to the Terms of Service and Privacy Policy.
                  </span>
                </label>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
                >
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-indigo-600 dark:text-indigo-400"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
        <Check className="h-3.5 w-3.5" />
      </span>
      {text}
    </div>
  );
}

