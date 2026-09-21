import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  ClipboardCheck,
  HelpCircle,
} from "lucide-react";

import { connectDB } from "@/lib/mongodb";
import { Exam } from "@/models/Exam";
import { Question } from "@/models/Question";

import { QuizContainer } from "@/components/quiz/QuizContainer";

type PracticePageProps = {
  params: Promise<{
    examSlug: string;
  }>;
};

export default async function PracticePage({
  params,
}: PracticePageProps) {
  const { examSlug } = await params;

  await connectDB();

  /*
   * Find active exam from MongoDB
   */
  const examDoc = await Exam.findOne({
    slug: examSlug.toLowerCase(),
    isActive: true,
  }).lean();

  if (!examDoc) {
    notFound();
  }

  /*
   * Get active questions for this exam
   */
  const questionDocs = await Question.find({
    examId: examDoc._id,
    isActive: true,
  })
    .sort({ createdAt: 1 })
    .lean();

  /*
   * Convert MongoDB questions into the format
   * expected by QuizContainer.
   *
   * Current MongoDB structure:
   *
   * options: string[]
   * correctAnswer: number
   */
  const questions = questionDocs.map((question) => ({
    id: question._id.toString(),

    question: question.question,

    options: question.options,

    correctAnswer: question.correctAnswer,

    correctOptionId:
      typeof question.correctAnswer === "number" &&
      Array.isArray(question.options)
        ? question.options[question.correctAnswer] || ""
        : "",

    explanation: question.explanation || "",

    exam: question.exam || examDoc.name,

    examSlug: examDoc.slug,

    subject: question.subject || "",

    subjectSlug: question.subjectSlug || question.subject || "",

    topic: question.topic,

    difficulty: question.difficulty,

    tags: Array.isArray(question.tags) ? question.tags : [],
  }));

  /*
   * Convert MongoDB exam into a plain object.
   */
  const exam = {
    _id: examDoc._id.toString(),

    name: examDoc.name,

    slug: examDoc.slug,

    description: examDoc.description || "",

    durationMinutes:
      examDoc.durationMinutes || 60,

    isActive:
      examDoc.isActive !== false,

    subjects: (examDoc.subjects || []).map(
      (subject: {
        _id: { toString: () => string } | string;
        name: string;
        slug: string;
        description?: string;
      }) => ({
        _id: subject._id.toString(),

        name: subject.name,

        slug: subject.slug,

        description:
          subject.description || "",
      })
    ),
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
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

        {/* Practice header */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-8">
          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="relative px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                {/* Breadcrumb */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {exam.name}
                  </span>

                  <span className="text-slate-300 dark:text-slate-700">
                    /
                  </span>

                  <span className="text-slate-500 dark:text-slate-400">
                    Practice
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
                      Practice Questions
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                      Practice questions for{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {exam.name}
                      </span>{" "}
                      and improve your accuracy and exam readiness.
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
                    {questions.length === 1
                      ? "Question"
                      : "Questions"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz */}
        {questions.length > 0 ? (
          <QuizContainer
            questions={questions}
            durationMinutes={
              examDoc.durationMinutes || 30
            }

            /*
             * IMPORTANT:
             * Pass the MongoDB Exam ID.
             * This is required by /api/results.
             */
            examId={examDoc._id.toString()}

            /*
             * Used when saving the result.
             */
            examName={examDoc.name}

            /*
             * Identify this result as practice.
             */
            resultType="practice"
          />
        ) : (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <ClipboardCheck
                className="h-8 w-8"
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              No practice questions available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Practice questions for {exam.name} are not available yet.
              Please check back later.
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
              <ArrowLeft
                className="h-4 w-4"
                aria-hidden="true"
              />

              Back to Exam
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}