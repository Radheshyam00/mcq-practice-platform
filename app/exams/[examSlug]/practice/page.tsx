import { notFound } from "next/navigation";
import { getExam } from "@/data/exams";
import { getQuestionsByExam } from "@/data/questions";
import { QuizContainer } from "@/components/quiz/QuizContainer";

export default async function PracticePage({ params }: { params: Promise<{ examSlug:string }> }) {
  const { examSlug }=await params; const exam=getExam(examSlug); if(!exam) notFound();
  const qs=getQuestionsByExam(examSlug);
  return <div className="mx-auto max-w-6xl px-4 py-10"><div className="mb-8"><p className="text-sm font-bold text-indigo-600">{exam.name}</p><h1 className="mt-1 text-3xl font-black">Practice Questions</h1></div><QuizContainer questions={qs} durationMinutes={30}/></div>;
}
