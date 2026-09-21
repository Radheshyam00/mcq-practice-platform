import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { MockTest } from "@/models/MockTest";
import { TestCard } from "@/components/mock-test/TestCard";

type MockTestData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  examId: string;
  examName: string;
  examSlug: string;
  questions: number;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  demo: boolean;
  isActive: boolean;
};

export default async function MockTestsPage() {
  const session = await getServerSession(authOptions);

  const isLoggedIn = Boolean(session?.user);

  let allTests: MockTestData[] = [];

  try {
    await connectDB();

    const mockDocs = await MockTest.find({
      isActive: true,
    })
      .populate("examId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    allTests = mockDocs.map((test: any) => ({
      id: test._id.toString(),

      title: test.title,

      slug: test.slug,

      description: test.description || "",

      examId:
        test.examId?._id?.toString() ||
        test.examId?.toString() ||
        "",

      examName:
        test.examId?.name || "",

      examSlug:
        test.examId?.slug || "",

      questions: test.questionCount,

      duration: test.durationMinutes,

      difficulty: test.difficulty,

      demo: Boolean(test.demo),

      isActive: Boolean(test.isActive),
    }));
  } catch (error) {
    console.error(
      "Failed to load mock tests:",
      error
    );
  }

  /*
   * Logged-in users:
   *    See every active mock test.
   *
   * Logged-out users:
   *    See ONLY the mock test marked demo=true.
   */
  const demoTests = allTests.filter(
    (test) => test.demo === true
  );

  const availableTests = isLoggedIn
    ? allTests
    : demoTests;

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-96 -translate-x-1/2 rounded-full bg-indigo-500/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-indigo-500"
              />

              Exam Simulation
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Mock Tests
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
              Test your knowledge with timed mock exams
              designed to simulate real exam conditions
              and improve your confidence.
            </p>

            <div className="mt-7">
              {isLoggedIn ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  All mock tests are unlocked
                </div>
              ) : (
                <div className="flex max-w-xl flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/50 dark:bg-amber-950/20">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm dark:bg-slate-900 dark:text-amber-400">
                      <LockKeyhole className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
                        Demo access enabled
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-amber-700 dark:text-amber-400">
                        You can try the demo mock test.
                        Login to unlock all mock tests.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/login?callbackUrl=/mock-tests"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                  >
                    Login
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="font-black text-indigo-600 dark:text-indigo-400">
                  {availableTests.length}
                </span>

                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {availableTests.length === 1
                    ? "Mock Test Available"
                    : "Mock Tests Available"}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Timed Practice
                </span>
              </div>

              {!isLoggedIn && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />

                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    Free Demo
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MOCK TESTS
      ========================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {isLoggedIn
                ? "Available Mock Tests"
                : "Demo Mock Test"}
            </h2>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {isLoggedIn
                ? "Choose a test and challenge yourself under timed conditions."
                : "Try the demo test. Login to access the complete mock test library."}
            </p>
          </div>

          <div className="hidden rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200 sm:block dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
            {availableTests.length}{" "}
            {availableTests.length === 1
              ? "test"
              : "tests"}
          </div>
        </div>

        {availableTests.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {availableTests.map((test) => (
              <div
                key={test.id}
                className="h-full min-w-0"
              >
                <TestCard
                  {...test}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-75 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="max-w-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/50 dark:text-indigo-400">
                <LockKeyhole className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                Demo test unavailable
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                There is currently no active demo
                mock test.
              </p>

              <Link
                href="/login?callbackUrl=/mock-tests"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Login to Continue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================
            LOGIN CTA
        ========================================================== */}

        {!isLoggedIn &&
          allTests.length > availableTests.length && (
            <section className="mt-10 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:to-violet-950/20">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
                      <LockKeyhole className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Unlock all mock tests
                      </h3>

                      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                        Login to access all available mock
                        tests, track your attempts, review
                        results, and continue your
                        preparation.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/login?callbackUrl=/mock-tests"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    Login to Unlock
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>
          )}
      </main>
    </div>
  );
}