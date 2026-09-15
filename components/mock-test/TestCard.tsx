import Link from "next/link";
import type { ReactNode } from "react";
export function TestCard({ id, title, questions, durationMinutes, difficulty }: { id:string; title:string; questions:number; durationMinutes:number; difficulty:string }) {
  return <Link href={`/mock-tests/${id}`} className="block rounded-2xl border bg-white p-5 hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"><h3 className="font-bold">{title}</h3><div className="mt-4 flex gap-4 text-xs text-slate-500"><span>{questions} questions</span><span>{durationMinutes} min</span><span>{difficulty}</span></div></Link>;
}
