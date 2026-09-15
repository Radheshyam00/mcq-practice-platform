import { notFound } from "next/navigation";
import { subjects } from "@/data/subjects";
import { getQuestionsBySubject } from "@/data/questions";
import { QuizContainer } from "@/components/quiz/QuizContainer";

export default async function SubjectPage({params}:{params:Promise<{subjectSlug:string}>}) {
  const {subjectSlug}=await params; const subject=subjects.find(s=>s.slug===subjectSlug); if(!subject) notFound();
  return <div className="mx-auto max-w-6xl px-4 py-10"><div className="mb-8"><div className="text-4xl">{subject.icon}</div><h1 className="mt-3 text-3xl font-black">{subject.name}</h1><p className="mt-2 text-slate-500">{subject.description}</p></div><QuizContainer questions={getQuestionsBySubject(subjectSlug)} durationMinutes={20}/></div>;
}
