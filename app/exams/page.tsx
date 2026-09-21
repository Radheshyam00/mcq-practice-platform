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
import { Exam } from "@/models/Exam";
import { Question } from "@/models/Question";
import { ExamGrid } from "@/components/home/ExamGrid";

export const dynamic = "force-dynamic";

type ExamData = {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  totalQuestions: number;
  durationMinutes: number;
  isActive: boolean;
  demo: boolean;
  subjects: {
    _id: string;
    name: string;
    slug: string;
    description: string;
  }[];
};

export default async function ExamsPage() {
  const session = await getServerSession(authOptions);

  const isLoggedIn = Boolean(session?.user);

  let allExams: ExamData[] = [];

  try {
    await connectDB();

    const examDocs = await Exam.find({
      isActive: true,
    })
      .sort({ name: 1 })
      .lean();

    /*
     * Get question counts for every active exam.
     */
    const questionCounts = await Question.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$examId",
          totalQuestions: {
            $sum: 1,
          },
        },
      },
    ]);

    const questionCountMap = new Map<string, number>();

    for (const item of questionCounts) {
      if (item._id) {
        questionCountMap.set(
          item._id.toString(),
          item.totalQuestions,
        );
      }
    }

    /*
     * Convert MongoDB documents.
     */
    allExams = examDocs.map((exam: any) => ({
      id: exam._id.toString(),

      _id: exam._id.toString(),

      name: exam.name,

      slug: exam.slug,

      description: exam.description ?? "",

      category: "Competitive Exam",

      totalQuestions:
        questionCountMap.get(
          exam._id.toString(),
        ) ?? 0,

      durationMinutes:
        exam.durationMinutes ?? 60,

      isActive: Boolean(exam.isActive),

      demo: Boolean(exam.demo),

      subjects: (exam.subjects ?? []).map(
        (subject: any) => ({
          _id: subject._id.toString(),

          name: subject.name ?? "",

          slug: subject.slug ?? "",

          description:
            subject.description ?? "",
        }),
      ),
    }));
  } catch (error) {
    console.error(
      "Failed to load exams:",
      error,
    );
  }

  /*
   * Logged-in users:
   *    See every active exam.
   *
   * Logged-out users:
   *    See ONLY the exam marked demo=true.
   */
  const demoExams = allExams.filter(
    (exam) => exam.demo === true,
  );

  const availableExams = isLoggedIn
    ? allExams
    : demoExams;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/10"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-indigo-500"
              />

              Exam Practice
            </div>

            {/* Title */}
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              All Exams
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
              Choose an exam, practice multiple-choice questions, and improve
              your preparation with focused practice.
            </p>

            {/* Access Message */}
            <div className="mt-7">
              {isLoggedIn ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />

                  All exams are unlocked
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
                        You can try the demo exam.
                        Login to unlock all exams.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/login?callbackUrl=/exams"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                  >
                    Login

                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="font-black text-indigo-600 dark:text-indigo-400">
                  {availableExams.length}
                </span>

                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {availableExams.length === 1
                    ? "Exam Available"
                    : "Exams Available"}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Practice at your own pace
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

      {/* Exam Grid */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {isLoggedIn
                ? "Available Exams"
                : "Demo Exam"}
            </h2>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {isLoggedIn
                ? "Select an exam below to start your preparation."
                : "Try the demo exam. Login to access the complete exam library."}
            </p>
          </div>

          <div className="hidden rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200 sm:block dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
            {availableExams.length}{" "}
            {availableExams.length === 1
              ? "exam"
              : "exams"}
          </div>
        </div>

        {availableExams.length > 0 ? (
          <ExamGrid exams={availableExams} />
        ) : (
          <div className="flex min-h-75 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="max-w-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/50 dark:text-indigo-400">
                <LockKeyhole className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                Demo exam unavailable
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                There is currently no active demo exam.
              </p>

              <Link
                href="/login?callbackUrl=/exams"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Login to Continue

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Login CTA */}
        {!isLoggedIn &&
          allExams.length > availableExams.length && (
            <section className="mt-10 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:to-violet-950/20">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
                      <LockKeyhole className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Unlock all exams
                      </h3>

                      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                        Login to access all available exams,
                        practice questions, track your progress,
                        and continue your preparation.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/login?callbackUrl=/exams"
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