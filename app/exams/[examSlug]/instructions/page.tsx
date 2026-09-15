
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ClipboardCheck,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { getExam } from "@/data/exams";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ExamTabs } from "@/components/exam/ExamTabs";
import { TestInstructions } from "@/components/mock-test/TestInstructions";

type InstructionsPageProps = {
  params: Promise<{
    examSlug: string;
  }>;
};

export default async function InstructionsPage({
  params,
}: InstructionsPageProps) {
  const { examSlug } = await params;
  const exam = getExam(examSlug);

  if (!exam) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <ExamHeader exam={exam} />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ExamTabs slug={exam.slug} />

        <div className="py-8 sm:py-10 lg:py-12">
          {/* Page heading */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl"
            />

            <div className="relative px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                    <ClipboardCheck
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Mock Test
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                    Test Instructions
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                    Review the instructions carefully before starting your{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {exam.name}
                    </span>{" "}
                    mock test.
                  </p>
                </div>

                {/* Quick info */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-auto">
                  <InfoItem
                    icon={<Clock3 className="h-4 w-4" />}
                    label="Timed"
                  />
                  <InfoItem
                    icon={<ClipboardCheck className="h-4 w-4" />}
                    label="Exam Mode"
                  />
                  <InfoItem
                    icon={<ShieldCheck className="h-4 w-4" />}
                    label="Fair Test"
                    className="col-span-2 sm:col-span-1"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Instructions */}
          <section className="mt-6 sm:mt-8">
            <TestInstructions />
          </section>

          {/* Bottom navigation */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Ready to begin?
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Make sure you understand the rules before starting.
                </p>
              </div>

              <Link
                href={`/exams/${exam.slug}`}
                className="
                  inline-flex min-h-11 items-center justify-center gap-2
                  rounded-xl border border-slate-200 bg-white
                  px-5 py-2.5 text-sm font-bold text-slate-700
                  shadow-sm transition-all duration-200
                  hover:-translate-y-0.5 hover:border-slate-300
                  hover:bg-slate-50 hover:text-slate-900 hover:shadow-md
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                  dark:border-slate-700 dark:bg-slate-800
                  dark:text-slate-200 dark:hover:border-slate-600
                  dark:hover:bg-slate-700 dark:hover:text-white
                  dark:focus-visible:ring-offset-slate-950
                "
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Exam
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`
        flex items-center gap-2.5 rounded-2xl
        border border-slate-200 bg-slate-50
        px-3 py-3 text-xs font-bold text-slate-600
        dark:border-slate-700 dark:bg-slate-950
        dark:text-slate-300
        ${className}
      `}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
        {icon}
      </span>
      {label}
    </div>
  );
}

