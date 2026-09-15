import type { Exam } from "@/types/exam";
export function ExamInfo({ exam }: { exam: Exam }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Questions", exam.totalQuestions.toLocaleString()+"+"],["Subjects", exam.subjects.length],["Mock time", exam.durationMinutes+" min"],["Category", exam.category]].map(([a,b])=><div key={a} className="rounded-xl border p-4 dark:border-slate-800"><div className="text-xs text-slate-500">{a}</div><div className="mt-1 font-bold">{b}</div></div>)}</div>;
}
