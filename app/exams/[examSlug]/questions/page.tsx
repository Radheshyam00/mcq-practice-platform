import { getExam } from "@/data/exams";
import { getQuestionsByExam } from "@/data/questions";
import { notFound } from "next/navigation";
import Link from "next/link";
export default async function ExamQuestions({params}:{params:Promise<{examSlug:string}>}) {
  const {examSlug}=await params; const exam=getExam(examSlug); if(!exam) notFound(); const qs=getQuestionsByExam(examSlug);
  return <div className="mx-auto max-w-5xl px-4 py-10"><h1 className="text-3xl font-black">{exam.name} Questions</h1><div className="mt-6 grid gap-3">{qs.map((q,i)=><Link key={q.id} href={`/questions/${q.id}`} className="rounded-2xl border p-5 hover:border-indigo-400 dark:border-slate-800"><span className="text-xs text-slate-500">Question {i+1}</span><h2 className="mt-2 font-bold">{q.question}</h2></Link>)}</div></div>;
}
