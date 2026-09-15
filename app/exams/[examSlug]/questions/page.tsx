
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

import { getExam } from "@/data/exams";
import { getQuestionsByExam } from "@/data/questions";

type ExamQuestionsProps = {
  params: Promise<{
    examSlug: string;
  }>;
};

export default async function ExamQuestions({
  params,
}: ExamQuestionsProps) {
  const { examSlug } = await params;

  const exam = getExam(examSlug);

  if (!exam) {
    notFound();
  }

  const questions = getQuestionsByExam(examSlug);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
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

        {/* Page header */}
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
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {exam.name}
                  </span>

                  <span className="text-slate-300 dark:text-slate-700">
                    /
                  </span>

                  <span className="text-slate-500 dark:text-slate-400">
                    Questions
                  </span>
                </div>

                <div className="mt-4 flex items-start gap-4">
                  <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 sm:flex">
                    <BookOpen
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                      {exam.name} Questions
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                      Browse all available questions and open any question to
                      practice it individually.
                    </p>
                  </div>
                </div>
              </div>

              {/* Question count */}
              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
                  <HelpCircle
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    {questions.length}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {questions.length === 1 ? "Question" : "Questions"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className="mt-8 sm:mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Question Bank
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Select a question to view its details.
              </p>
            </div>

            {questions.length > 0 && (
              <span className="hidden shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm sm:inline-flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {questions.length} available
              </span>
            )}
          </div>

          {questions.length > 0 ? (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <Link
                  key={question.id}
                  href={`/questions/${question.id}`}
                  className="
                    group block rounded-2xl border
                    border-slate-200 bg-white p-4 shadow-sm
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:border-indigo-300
                    hover:shadow-md
                    dark:border-slate-800 dark:bg-slate-900
                    dark:hover:border-indigo-500/60
                    sm:p-5
                  "
                >
                  <div className="flex items-start gap-4">
                    {/* Number */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-black text-slate-600 transition-colors group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:border-indigo-500/40 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Question {index + 1}
                        </span>

                        {question.difficulty && (
                          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                            {question.difficulty}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-slate-800 transition-colors group-hover:text-indigo-700 dark:text-slate-200 dark:group-hover:text-indigo-300 sm:text-base">
                        {question.question}
                      </h3>

                      {question.tags?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {question.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all duration-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 sm:flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:border-indigo-500/40 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400">
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <CheckCircle2
                  className="h-8 w-8"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                No questions available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Questions for {exam.name} have not been added yet. Please
                check back later.
              </p>

              <Link
                href={`/exams/${exam.slug}`}
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
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Exam
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

