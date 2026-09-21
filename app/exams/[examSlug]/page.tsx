import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";

import { connectDB } from "@/lib/mongodb";
import { Exam } from "@/models/Exam";
import { Question } from "@/models/Question";

import { ExamHeader } from "@/components/exam/ExamHeader";
import { ExamInfo } from "@/components/exam/ExamInfo";
import { ExamTabs } from "@/components/exam/ExamTabs";
import { SubjectCard } from "@/components/exam/SubjectCard";

type ExamPageProps = {
  params: Promise<{
    examSlug: string;
  }>;
};

type ExamSubject = {
  _id: { toString: () => string } | string;
  name: string;
  slug: string;
  description?: string;
};

export default async function ExamPage({ params }: ExamPageProps) {
  const { examSlug } = await params;

  await connectDB();

  const examDoc = await Exam.findOne({
    slug: examSlug.toLowerCase(),
    isActive: true,
  }).lean();

  if (!examDoc) {
    notFound();
  }

  // Count active questions for this exam
  const totalQuestions = await Question.countDocuments({
    examId: examDoc._id,
    isActive: true,
  });

  // Convert MongoDB document to plain object
  const exam = {
    id: examDoc._id.toString(),
    _id: examDoc._id.toString(),
    name: examDoc.name,
    shortName: examDoc.shortName ?? examDoc.name.slice(0, 3).toUpperCase(),
    slug: examDoc.slug,
    description: examDoc.description ?? "",
    icon: examDoc.icon ?? "BookOpen",
    color: examDoc.color ?? "indigo",

    subjects: (examDoc.subjects ?? []).map((subject: {
      _id: { toString: () => string } | string;
      name: string;
      slug: string;
      description?: string;
    }) => ({
      _id: subject._id.toString(),
      name: subject.name,
      slug: subject.slug,
      description: subject.description ?? "",
    })),

    durationMinutes: examDoc.durationMinutes,
    isActive: examDoc.isActive,

    // Values required by existing ExamInfo
    totalQuestions,
    category: "Competitive Exam",
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <ExamHeader exam={exam} />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ExamTabs slug={exam.slug} />

        <div className="py-8 sm:py-10 lg:py-12">
          <ExamInfo exam={exam} />

          {/* Action section */}
          <section className="mt-8">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl"
              />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                    <Sparkles
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Start your preparation
                  </div>

                  <h2 className="mt-3 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    Ready to test your knowledge?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Practice subject-wise questions or challenge yourself with
                    a full mock test.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                  <Link
                    href={`/exams/${exam.slug}/practice`}
                    className="
                      group inline-flex min-h-12 flex-1 items-center justify-center
                      gap-2 rounded-xl bg-indigo-600 px-5 py-3
                      text-sm font-bold text-white
                      shadow-sm shadow-indigo-500/20
                      transition-all duration-200
                      hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md
                      focus:outline-none focus-visible:ring-2
                      focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                      dark:focus-visible:ring-offset-slate-900
                      sm:flex-none
                    "
                  >
                    <BookOpen
                      className="h-4 w-4"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />

                    <span>Start Practice</span>

                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>

                  <Link
                    href={`/exams/${exam.slug}/mock-test`}
                    className="
                      inline-flex min-h-12 flex-1 items-center justify-center
                      gap-2 rounded-xl border border-slate-200
                      bg-white px-5 py-3 text-sm font-bold
                      text-slate-700 shadow-sm
                      transition-all duration-200
                      hover:-translate-y-0.5 hover:border-slate-300
                      hover:bg-slate-50 hover:text-slate-900 hover:shadow-md
                      focus:outline-none focus-visible:ring-2
                      focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                      dark:border-slate-700 dark:bg-slate-800
                      dark:text-slate-200 dark:hover:border-slate-600
                      dark:hover:bg-slate-700 dark:hover:text-white
                      dark:focus-visible:ring-offset-slate-900
                      sm:flex-none
                    "
                  >
                    <ClipboardCheck
                      className="h-4 w-4"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />

                    <span>Take Mock Test</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Subjects */}
          <section className="mt-12 sm:mt-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <BookOpen
                      className="h-4.5 w-4.5"
                      aria-hidden="true"
                    />
                  </div>

                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Subjects
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Choose a subject to start focused practice.
                </p>
              </div>

              <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {exam.subjects.length}{" "}
                {exam.subjects.length === 1 ? "Subject" : "Subjects"}
              </span>
            </div>

            {exam.subjects.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {exam.subjects.map((subject: ExamSubject) => (
                  <SubjectCard
                    key={subject._id.toString()}
                    slug={subject.slug}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <BookOpen className="h-7 w-7" aria-hidden="true" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  No subjects available
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Subject-wise practice is not available for this exam yet.
                  Please check back later.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}