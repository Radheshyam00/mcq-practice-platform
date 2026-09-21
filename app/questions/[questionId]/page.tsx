import { notFound } from "next/navigation";
import Link from "next/link";

import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { Exam } from "@/models/Exam";

import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";

type QuestionPageProps = {
  params: Promise<{
    questionId: string;
  }>;
};

export default async function QuestionPage({
  params,
}: QuestionPageProps) {
  const { questionId } = await params;

  await connectDB();

  /*
   * Find question from MongoDB
   */
  const question = await Question.findById(questionId).lean();

  if (!question || question.isActive === false) {
    notFound();
  }

  /*
   * Find exam
   */
  const exam = await Exam.findById(question.examId).lean();

  /*
   * Find subject from embedded exam subjects
   */
  let subjectName = question.subject || "Unknown Subject";

  if (exam) {
    const subject = exam.subjects?.find(
      (item: any) =>
        item._id.toString() === question.subjectId.toString()
    );

    if (subject) {
      subjectName = subject.name;
    }
  }

  /*
   * Exam information
   */
  const examName = question.exam || exam?.name || "Exam";

  /*
   * Safe options
   */
  const options = question.options || [];

  /*
   * Correct answer index
   */
  const correctAnswer = question.correctAnswer;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">

        {/* Back */}
        <Link
          href={
            exam?.slug
              ? `/exams/${exam.slug}/questions`
              : "/questions"
          }
          className="
            inline-flex items-center gap-2
            text-sm font-bold
            text-indigo-600
            hover:text-indigo-700
            dark:text-indigo-400
            dark:hover:text-indigo-300
          "
        >
          ← Questions
        </Link>

        {/* Question Card */}
        <Card className="mt-5">

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{question.difficulty}</Badge>

            {subjectName && (
              <span
                className="
                  rounded-full
                  bg-slate-100
                  px-3 py-1
                  text-xs font-semibold
                  text-slate-600
                  dark:bg-slate-800
                  dark:text-slate-300
                "
              >
                {subjectName}
              </span>
            )}

            {question.topic && (
              <span
                className="
                  rounded-full
                  bg-slate-100
                  px-3 py-1
                  text-xs font-semibold
                  text-slate-600
                  dark:bg-slate-800
                  dark:text-slate-300
                "
              >
                {question.topic}
              </span>
            )}
          </div>

          {/* Exam */}
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {examName}
          </p>

          {/* Question */}
          <h1 className="mt-3 text-2xl font-black leading-9 text-slate-900 dark:text-white">
            {question.question}
          </h1>

          {/* Options */}
          <div className="mt-6 grid gap-3">
            {options.map((option: string, index: number) => {
              const isCorrect = index === correctAnswer;

              return (
                <div
                  key={`${question._id.toString()}-${index}`}
                  className={`
                    flex items-start gap-3
                    rounded-xl border p-4
                    transition-colors
                    ${
                      isCorrect
                        ? `
                          border-emerald-500
                          bg-emerald-50
                          dark:bg-emerald-950/30
                        `
                        : `
                          border-slate-200
                          bg-white
                          dark:border-slate-800
                          dark:bg-slate-900
                        `
                    }
                  `}
                >
                  {/* Option letter */}
                  <b
                    className={`
                      shrink-0 uppercase
                      ${
                        isCorrect
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500 dark:text-slate-400"
                      }
                    `}
                  >
                    {String.fromCharCode(65 + index)}.
                  </b>

                  {/* Option text */}
                  <span
                    className={`
                      leading-6
                      ${
                        isCorrect
                          ? "font-semibold text-emerald-800 dark:text-emerald-300"
                          : "text-slate-700 dark:text-slate-300"
                      }
                    `}
                  >
                    {option}
                  </span>

                  {/* Correct */}
                  {isCorrect && (
                    <span
                      className="
                        ml-auto shrink-0
                        text-xs font-bold
                        text-emerald-600
                        dark:text-emerald-400
                      "
                    >
                      Correct
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Correct answer */}
          <div
            className="
              mt-6 rounded-xl
              border border-emerald-200
              bg-emerald-50 p-5
              dark:border-emerald-500/20
              dark:bg-emerald-950/30
            "
          >
            <h2
              className="
                font-bold
                text-emerald-800
                dark:text-emerald-300
              "
            >
              Correct Answer
            </h2>

            <p
              className="
                mt-2 text-sm
                text-emerald-700
                dark:text-emerald-400
              "
            >
              Option{" "}
              {String.fromCharCode(65 + correctAnswer)} —{" "}
              {options[correctAnswer]}
            </p>
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div
              className="
                mt-6 rounded-xl
                bg-slate-50 p-5
                dark:bg-slate-950
              "
            >
              <h2 className="font-bold">
                Explanation
              </h2>

              <p
                className="
                  mt-2 text-sm leading-6
                  text-slate-600
                  dark:text-slate-400
                "
              >
                {question.explanation}
              </p>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}