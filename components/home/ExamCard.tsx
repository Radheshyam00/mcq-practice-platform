import Link from "next/link";
import type { Exam } from "@/types/exam";

export function ExamCard({ exam }: { exam: Exam }) {
  return <Link href={`/exams/${exam.slug}`} className="group block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${exam.color} text-2xl`}>{exam.icon}</div>
    <h3 className="text-lg font-bold group-hover:text-indigo-600">{exam.name}</h3>
    <p className="mt-2 line-clamp-2 text-sm text-slate-500">{exam.description}</p>
    <div className="mt-5 flex justify-between text-xs text-slate-500"><span>{exam.totalQuestions.toLocaleString()}+ questions</span><span>{exam.durationMinutes} min mock</span></div>
  </Link>;
}
