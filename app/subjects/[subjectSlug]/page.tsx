import { notFound } from "next/navigation";
import{ connectDB } from "@/lib/mongodb";
import { Exam } from "@/models/Exam";
import { Question } from "@/models/Question";
import { QuizContainer } from "@/components/quiz/QuizContainer";

type SubjectPageProps = {
  params: Promise<{
    subjectSlug: string;
  }>;
};

export default async function SubjectPage({
  params,
}: SubjectPageProps) {
  const { subjectSlug } = await params;

  const slug = subjectSlug.toLowerCase().trim();

  await connectDB();

  /*
   * Find an active exam containing this subject.
   */
  const examDoc = await Exam.findOne({
    isActive: true,
    "subjects.slug": slug,
  }).lean();

  if (!examDoc) {
    notFound();
  }

  /*
   * Find the actual embedded subject.
   */
  const subject = (examDoc.subjects ?? []).find(
    (item: { slug?: string } & Record<string, unknown>) =>
      typeof item.slug === "string" && item.slug.toLowerCase() === slug
  );

  if (!subject) {
    notFound();
  }

  /*
   * Get questions belonging to THIS exam + THIS subject.
   */
  const questionDocs = await Question.find({
    examId: examDoc._id,
    subjectId: subject._id,
    isActive: true,
  })
    .sort({ createdAt: 1 })
    .lean();

  /*
   * Convert MongoDB questions to QuizContainer format.
   */
  const questions = questionDocs.map((question) => ({
    id: question._id.toString(),
    question: question.question,
    options: question.options,
    correctAnswer: question.correctAnswer,
    correctOptionId: question.correctOptionId ?? question.correctAnswer,
    explanation: question.explanation ?? "",
    exam: question.exam ?? examDoc.name,
    examSlug: question.examSlug ?? examDoc.slug ?? slug,
    subject: question.subject ?? subject.name,
    subjectSlug: question.subjectSlug ?? subject.slug ?? slug,
    topic: question.topic,
    difficulty: question.difficulty,
    tags: question.tags ?? [],
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Subject Header */}
      <div className="mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl dark:bg-indigo-950/40">
          📚
        </div>

        <h1 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
          {subject.name}
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-400">
          {subject.description ||
            `Practice multiple-choice questions from ${subject.name}.`}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
            {questionDocs.length} Questions
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {examDoc.name}
          </span>
        </div>
      </div>

      {/* Quiz */}
      {questions.length > 0 ? (
        <QuizContainer
          questions={questions}
          durationMinutes={20}
          examId={examDoc._id.toString()}
          examName={examDoc.name}
          resultType="practice"
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            No Questions Available
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            There are currently no active questions for this subject.
          </p>
        </div>
      )}
    </div>
  );
}