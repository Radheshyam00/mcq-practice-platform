import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { connectDB} from "@/lib/mongodb";
import { Exam } from "@/models/Exam";
import { Question } from "@/models/Question";
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DailyQuizPage() {
  const session = await getServerSession(authOptions);

  const isLoggedIn = !!session?.user;

  await connectDB();

  /*
   * Find an active exam that has Daily Quiz questions.
   *
   * We use one exam so QuizContainer can save the result
   * with a valid examId.
   */
  const dailyExam = await Question.findOne({
    isDailyQuiz: true,
    isActive: true,
  })
    .select("examId")
    .sort({ createdAt: -1 })
    .lean();

  let examDoc = null;

  if (dailyExam?.examId) {
    examDoc = await Exam.findOne({
      _id: dailyExam.examId,
      isActive: true,
    }).lean();
  }

  /*
   * Get Daily Quiz questions for this exam.
   */
  let questionDocs: any[] = [];

  if (examDoc) {
    questionDocs = await Question.find({
      examId: examDoc._id,
      isDailyQuiz: true,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();
  }

  /*
   * Guests get only 5 demo questions.
   * Logged-in users get the complete Daily Quiz.
   */
  const selectedQuestions = isLoggedIn
    ? questionDocs
    : questionDocs.slice(0, 5);

  const isDemo = !isLoggedIn;

  /*
   * Convert MongoDB questions into QuizContainer format.
   */
  const dailyQuestions = selectedQuestions.map((question) => ({
    id: question._id.toString(),
    question: question.question,
    options: question.options,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation ?? "",
    exam: question.exam ?? examDoc?.name ?? "",
    subject: question.subject ?? "",
    topic: question.topic,
    difficulty: question.difficulty,
  }));

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        {/* Decorative background */}
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
          className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-purple-500/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500"
              />

              Daily Challenge
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Daily Quiz
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
              A quick mixed quiz to keep your preparation consistent. Test
              your knowledge every day and build a stronger learning habit.
            </p>

            {/* Demo/Login notice */}
            {isDemo ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-amber-900 dark:text-amber-200">
                      Demo Daily Quiz
                    </p>

                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                      You can try the first 5 questions without signing in.
                      Login to access the complete daily quiz.
                    </p>
                  </div>

                  <a
                    href="/login?callbackUrl=/daily-quiz"
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    Login
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Full Daily Quiz unlocked
              </div>
            )}

            {/* Quiz Stats */}
            <div className="mt-7 flex flex-wrap gap-3">
              {/* Questions */}
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="font-black text-indigo-600 dark:text-indigo-400">
                  {dailyQuestions.length}
                </span>

                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Questions
                </span>
              </div>

              {/* Duration */}
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span
                  aria-hidden="true"
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  ⏱
                </span>

                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  10 Minutes
                </span>
              </div>

              {/* Mixed */}
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Mixed Topics
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Area */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* Section heading */}
        <div className="mb-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Today&apos;s Challenge
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Answer each question carefully and complete the quiz before
                time runs out.
              </p>
            </div>

            <div className="hidden rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200 sm:block dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
              {dailyQuestions.length} questions · 10 min
            </div>
          </div>
        </div>

        {/* Quiz */}
        {dailyQuestions.length > 0 && examDoc ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 lg:p-6 dark:border-slate-800 dark:bg-slate-900">
            <QuizContainer
              questions={dailyQuestions as any}
              durationMinutes={10}
              examId={examDoc._id.toString()}
              examName={examDoc.name}
              resultType="daily-quiz"
            />
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="max-w-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-2xl dark:border-indigo-900/50 dark:bg-indigo-950/50">
                📝
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                No questions available
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                The daily quiz is not available right now. Please check back
                later.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}