
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ClipboardCheck,
  FileQuestion,
  Sparkles,
} from "lucide-react";

import { getExam } from "@/data/exams";
import { mockTests } from "@/data/mockTests";
import { TestCard } from "@/components/mock-test/TestCard";

type ExamMockTestsProps = {
  params: Promise<{
    examSlug: string;
  }>;
};

export default async function ExamMockTests({
  params,
}: ExamMockTestsProps) {
  const { examSlug } = await params;

  const exam = getExam(examSlug);

  if (!exam) {
    notFound();
  }

  const tests = mockTests.filter((test) => test.examSlug === examSlug);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Back navigation */}
        <Link
          href={`/exams/${exam.slug}`}
          className="
            group mb-6 inline-flex items-center gap-2 rounded-xl
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

        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="relative px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                  <Sparkles
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  Mock Test Series
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
                  {exam.name}
                  <span className="block text-indigo-600 dark:text-indigo-400">
                    Mock Tests
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                  Test your preparation with exam-style mock tests. Improve
                  your speed, accuracy, and confidence before the actual exam.
                </p>
              </div>

              {/* Test count */}
              <div className="shrink-0 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950 sm:p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <ClipboardCheck
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      {tests.length}
                    </p>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {tests.length === 1 ? "Mock Test" : "Mock Tests"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tests section */}
        <section className="mt-8 sm:mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <FileQuestion
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Available Tests
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Choose a mock test and start practicing.
              </p>
            </div>

            {tests.length > 0 && (
              <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {tests.length} available
              </span>
            )}
          </div>

          {tests.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {tests.map((test) => (
                <TestCard key={test.id} {...test} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <FileQuestion
                  className="h-8 w-8"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                Mock tests coming soon
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Mock tests for {exam.name} are being prepared. Check back
                soon for new practice tests.
              </p>

              <Link
                href={`/exams/${exam.slug}/practice`}
                className="
                  mt-6 inline-flex items-center justify-center gap-2
                  rounded-xl bg-indigo-600 px-5 py-3
                  text-sm font-bold text-white shadow-sm
                  shadow-indigo-500/20 transition-all duration-200
                  hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                  dark:focus-visible:ring-offset-slate-950
                "
              >
                <ClipboardCheck
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                Practice Questions
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
