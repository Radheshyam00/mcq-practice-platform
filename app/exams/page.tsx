import { exams } from "@/data/exams";
import { ExamGrid } from "@/components/home/ExamGrid";

export default function ExamsPage() {
  return <div className="mx-auto max-w-7xl px-4 py-12"><h1 className="text-4xl font-black">All Exams</h1><p className="mt-2 text-slate-500">Choose an exam and start practicing.</p><div className="mt-8"><ExamGrid exams={exams}/></div></div>;
}
