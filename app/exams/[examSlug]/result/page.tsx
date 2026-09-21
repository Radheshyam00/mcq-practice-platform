import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Target,
  XCircle,
} from "lucide-react";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import { Exam } from "@/models/Exam";
import { Result } from "@/models/Result";
import { authOptions } from "@/lib/auth";

type ExamResultProps = {
  params: Promise<{
    examSlug: string;
  }>;
};

export default async function ExamResult({
  params,
}: ExamResultProps) {
  const { examSlug } = await params;

  await connectDB();

  /*
   * Get exam from MongoDB
   */
  const examDoc = await Exam.findOne({
    slug: examSlug.toLowerCase(),
    isActive: true,
  }).lean();

  if (!examDoc) {
    notFound();
  }

  /*
   * Convert MongoDB document to a plain object.
   */
  const exam = {
    _id: examDoc._id.toString(),
    name: examDoc.name,
    slug: examDoc.slug,
    description: examDoc.description || "",
    durationMinutes: examDoc.durationMinutes || 60,
    isActive: examDoc.isActive !== false,

    subjects: (examDoc.subjects || []).map(
      (subject: any) => ({
        _id: subject._id.toString(),
        name: subject.name,
        slug: subject.slug,
        description: subject.description || "",
      })
    ),
  };

  /*
   * Get logged-in user.
   */
  const session = await getServerSession(authOptions);

  /*
   * Get latest result for this user and exam.
   *
   * If the user is not logged in, no result is displayed.
   */
  let latestResult = null;

  if (session?.user?.id) {
    const resultDoc = await Result.findOne({
      userId: session.user.id,
      examId: examDoc._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (resultDoc) {
      latestResult = {
        id: resultDoc._id.toString(),
        score: resultDoc.score,
        correct: resultDoc.correct,
        wrong: resultDoc.wrong,
        skipped: resultDoc.skipped,
        totalQuestions: resultDoc.totalQuestions,
        timeTakenSeconds: resultDoc.timeTakenSeconds,
        type: resultDoc.type,
        createdAt: resultDoc.createdAt,
      };
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) {
      return "0 min";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }

    if (remainingSeconds === 0) {
      return `${minutes} min`;
    }

    return `${minutes}m ${remainingSeconds}s`;
  };

  const resultTypeLabel =
    latestResult?.type === "mock-test"
      ? "Mock Test"
      : latestResult?.type === "daily-quiz"
        ? "Daily Quiz"
        : "Practice";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Back navigation */}
        <Link
          href={`/exams/${exam.slug}`}
          className="
            group mb-6 inline-flex w-fit items-center gap-2 rounded-xl
            border border-slate-200 bg-white px-3.5 py-2
            text-sm font-semibold text-slate-600 shadow-sm
            transition-all duration-200
            hover:-translate-x-0.5 hover:border-slate-300
            hover:bg-slate-50 hover:text-slate-900
            dark:border-slate-800 dark:bg-slate-900
            dark:text-slate-300 dark:hover:border-slate-700
            dark:hover:bg-slate-800 dark:hover:text-white
          "
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />

          Back to {exam.name}
        </Link>

        {/* Result card */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="relative px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
            {/* Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 ring-8 ring-indigo-50/60 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/5">
              <BarChart3
                className="h-9 w-9"
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>

            {/* Heading */}
            <div className="mx-auto mt-6 max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                <ClipboardCheck
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />

                {exam.name}
              </span>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Result Dashboard
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Review your latest performance, accuracy, correct answers,
                and completion time.
              </p>
            </div>

            {latestResult ? (
              <>
                {/* Result type */}
                <div className="mt-8 flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    <ClipboardCheck className="h-4 w-4 text-indigo-500" />
                    Latest {resultTypeLabel}
                  </span>
                </div>

                {/* Score */}
                <div className="mt-8 text-center">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Your Score
                  </p>

                  <div className="mt-2 flex items-center justify-center gap-1">
                    <span className="text-6xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 sm:text-7xl">
                      {latestResult.score}
                    </span>

                    <span className="self-end pb-2 text-2xl font-bold text-slate-400">
                      %
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {latestResult.correct} correct out of{" "}
                    {latestResult.totalQuestions}
                  </p>
                </div>

                {/* Statistics */}
                <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                  <ResultStat
                    icon={
                      <CheckCircle2 className="h-5 w-5" />
                    }
                    label="Correct"
                    value={`${latestResult.correct}`}
                    iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  />

                  <ResultStat
                    icon={
                      <XCircle className="h-5 w-5" />
                    }
                    label="Wrong"
                    value={`${latestResult.wrong}`}
                    iconClass="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  />

                  <ResultStat
                    icon={
                      <Target className="h-5 w-5" />
                    }
                    label="Skipped"
                    value={`${latestResult.skipped}`}
                    iconClass="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  />

                  <ResultStat
                    icon={
                      <Clock3 className="h-5 w-5" />
                    }
                    label="Time"
                    value={formatTime(
                      latestResult.timeTakenSeconds
                    )}
                    iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  />
                </div>

                {/* Summary */}
                <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-sm dark:bg-slate-900">
                      <CheckCircle2
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Test completed successfully
                      </h2>

                      <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        You scored {latestResult.score}% with{" "}
                        {latestResult.correct} correct answers,
                        {latestResult.wrong} wrong answers, and{" "}
                        {latestResult.skipped} skipped questions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick features */}
                <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
                  <Feature
                    icon={<BarChart3 className="h-4 w-4" />}
                    title="Score"
                    description={`${latestResult.score}% achieved`}
                  />

                  <Feature
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    title="Accuracy"
                    description={`${latestResult.correct}/${latestResult.totalQuestions} correct`}
                  />

                  <Feature
                    icon={<Clock3 className="h-4 w-4" />}
                    title="Time"
                    description={formatTime(
                      latestResult.timeTakenSeconds
                    )}
                  />
                </div>
              </>
            ) : (
              /* Empty result state */
              <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left dark:border-slate-800 dark:bg-slate-950 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-sm dark:bg-slate-900">
                    <CheckCircle2
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      No result available yet
                    </h2>

                    <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Complete a quiz for {exam.name} to see your
                      score, accuracy, correct answers, and other
                      performance statistics.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={`/exams/${exam.slug}/practice`}
                className="
                  inline-flex min-h-12 items-center justify-center gap-2
                  rounded-xl bg-indigo-600 px-6 py-3
                  text-sm font-bold text-white shadow-sm
                  shadow-indigo-500/20 transition-all duration-200
                  hover:-translate-y-0.5 hover:bg-indigo-700
                  hover:shadow-md
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                  dark:focus-visible:ring-offset-slate-900
                "
              >
                <BookOpen
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                Start Practice
              </Link>

              <Link
                href={`/exams/${exam.slug}/mock-test`}
                className="
                  inline-flex min-h-12 items-center justify-center gap-2
                  rounded-xl border border-slate-200 bg-white
                  px-6 py-3 text-sm font-bold text-slate-700
                  shadow-sm transition-all duration-200
                  hover:-translate-y-0.5 hover:border-slate-300
                  hover:bg-slate-50 hover:text-slate-900 hover:shadow-md
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                  dark:border-slate-700 dark:bg-slate-800
                  dark:text-slate-200 dark:hover:border-slate-600
                  dark:hover:bg-slate-700 dark:hover:text-white
                  dark:focus-visible:ring-offset-slate-900
                "
              >
                <ClipboardCheck
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                Take Mock Test
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultStat({
  icon,
  label,
  value,
  iconClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-center text-lg font-black text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
        {icon}
      </div>

      <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
        {title}
      </p>

      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}