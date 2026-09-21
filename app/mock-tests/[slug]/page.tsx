import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { MockTest } from "@/models/MockTest";
import { Exam } from "@/models/Exam";
import { Question } from "@/models/Question";
import { QuizContainer } from "@/components/quiz/QuizContainer";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MockTestPage({ params }: PageProps) {
  const { slug } = await params;

  await connectDB();

  /*
   * Check authentication
   */
  const session = await getServerSession(authOptions);

  /*
   * Load mock test from MongoDB
   */
  const mockTest = await MockTest.findOne({
    slug: slug.toLowerCase(),
    isActive: true,
  }).lean();

  if (!mockTest) {
    notFound();
  }

  /*
   * Non-logged-in users can ONLY access demo test.
   */
  if (!session && !mockTest.demo) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(
        `/mock-tests/${mockTest.slug}`,
      )}`,
    );
  }

  /*
   * Load associated exam
   */
  const exam = await Exam.findById(mockTest.examId).lean();

  if (!exam || !exam.isActive) {
    notFound();
  }

  /*
   * Difficulty filter
   */
  const difficultyFilter =
    mockTest.difficulty === "Mixed"
      ? {}
      : {
          difficulty: mockTest.difficulty,
        };

  /*
   * Load random questions.
   */
  const questionDocs = await Question.aggregate([
    {
      $match: {
        examId: exam._id,
        isActive: true,
        ...difficultyFilter,
      },
    },
    {
      $sample: {
        size: mockTest.questionCount,
      },
    },
  ]);

  /*
   * Prevent starting a test when there aren't
   * enough questions in MongoDB.
   */
  if (questionDocs.length < mockTest.questionCount) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/mock-tests"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Mock Tests
          </Link>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 dark:border-amber-900/50 dark:bg-amber-950/20">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Mock Test Not Ready
            </h1>

            <p className="mt-3 text-slate-600 dark:text-slate-400">
              This mock test requires{" "}
              <strong>{mockTest.questionCount}</strong> questions, but only{" "}
              <strong>{questionDocs.length}</strong> matching questions are
              currently available.
            </p>

            <div className="mt-6 rounded-xl bg-white p-4 dark:bg-slate-900">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Exam</p>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">
                    {exam.name}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Difficulty</p>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">
                    {mockTest.difficulty}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Required</p>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">
                    {mockTest.questionCount}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Available</p>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">
                    {questionDocs.length}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/mock-tests"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Back to Mock Tests
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Convert MongoDB questions into the Question type
   * expected by QuizContainer.
   */
  const questions = questionDocs.map((question) => ({
    id: question._id.toString(),
    question: question.question,
    options: question.options,
    correctAnswer: question.correctAnswer,
    correctOptionId:
      question.correctOptionId ??
      (typeof question.correctAnswer === "string"
        ? question.correctAnswer
        : ""),
    explanation: question.explanation || "",
    exam: question.exam || exam.name,
    examSlug: question.examSlug || exam.slug || "",
    subject: question.subject || "",
    subjectSlug: question.subjectSlug || "",
    topic: question.topic || "",
    difficulty: question.difficulty,
    tags: Array.isArray(question.tags) ? question.tags : [],
  }));

  /*
   * Render mock test
   */
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/mock-tests"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Mock Tests
            </Link>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {mockTest.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>{exam.name}</span>
              <span>•</span>
              <span>{mockTest.questionCount} Questions</span>
              <span>•</span>
              <span>{mockTest.durationMinutes} Minutes</span>
              <span>•</span>
              <span>{mockTest.difficulty}</span>

              {mockTest.demo && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                    <LockKeyhole className="h-3 w-3" />
                    Demo
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {mockTest.description && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              {mockTest.description}
            </p>
          </div>
        )}

        {/* Quiz */}
        <QuizContainer
          questions={questions}
          durationMinutes={mockTest.durationMinutes}
          examId={exam._id.toString()}
          examName={exam.name}
          resultType="mock-test"
        />
      </div>
    </main>
  );
}