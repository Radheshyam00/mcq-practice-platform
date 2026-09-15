import type { Exam } from "@/types/exam";
export function ExamHeader({ exam }: { exam: Exam }) {
  return <div className={`bg-gradient-to-r ${exam.color} text-white`}><div className="mx-auto max-w-7xl px-4 py-10"><div className="text-4xl">{exam.icon}</div><h1 className="mt-3 text-3xl font-black">{exam.name}</h1><p className="mt-2 max-w-2xl text-white/80">{exam.description}</p></div></div>;
}
