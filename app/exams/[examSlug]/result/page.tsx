import { getExam } from "@/data/exams";
import { notFound } from "next/navigation";
export default async function ExamResult({params}:{params:Promise<{examSlug:string}>}) {
  const {examSlug}=await params; const exam=getExam(examSlug); if(!exam) notFound();
  return <div className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-3xl font-black">{exam.name} Result</h1><p className="mt-3 text-slate-500">Your result will appear here after submitting a quiz.</p></div>;
}
