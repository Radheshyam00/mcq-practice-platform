import { exams } from "@/data/exams";
import { ExamGrid } from "./ExamGrid";

export function PopularExams() {
  return <section className="mx-auto max-w-7xl px-4 py-16"><div className="mb-8"><h2 className="text-3xl font-black">Popular Exams</h2><p className="mt-2 text-slate-500">Start with the exams learners practice most.</p></div><ExamGrid exams={exams}/></section>;
}
