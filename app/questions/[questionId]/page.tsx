import { notFound } from "next/navigation";
import { getQuestion } from "@/data/questions";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import Link from "next/link";

export default async function QuestionPage({params}:{params:Promise<{questionId:string}>}) {
  const {questionId}=await params; const q=getQuestion(questionId); if(!q) notFound();
  return <div className="mx-auto max-w-3xl px-4 py-12"><Link href="/questions" className="text-sm font-bold text-indigo-600">← Questions</Link><Card className="mt-5"><Badge>{q.difficulty}</Badge><h1 className="mt-5 text-2xl font-black">{q.question}</h1><div className="mt-6 grid gap-3">{q.options.map(o=><div key={o.id} className={`rounded-xl border p-4 ${o.id===q.correctOptionId?"border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30":""}`}><b className="uppercase">{o.id}.</b> {o.text}</div>)}</div><div className="mt-6 rounded-xl bg-slate-50 p-5 dark:bg-slate-950"><h2 className="font-bold">Explanation</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{q.explanation}</p></div></Card></div>;
}
