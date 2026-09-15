import { questions } from "@/data/questions";
import Link from "next/link";
export default function QuestionsPage(){return <div className="mx-auto max-w-5xl px-4 py-12"><h1 className="text-4xl font-black">Questions</h1><div className="mt-8 grid gap-3">{questions.map(q=><Link href={`/questions/${q.id}`} key={q.id} className="rounded-2xl border p-5 hover:border-indigo-400 dark:border-slate-800"><h2 className="font-bold">{q.question}</h2><p className="mt-2 text-xs text-slate-500">{q.examSlug} • {q.subjectSlug} • {q.difficulty}</p></Link>)}</div></div>;}
