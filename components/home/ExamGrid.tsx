import type { Exam } from "@/types/exam";
import { ExamCard } from "./ExamCard";

export function ExamGrid({ exams }: { exams: Exam[] }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{exams.map((exam) => <ExamCard key={exam.id} exam={exam}/>)}</div>;
}
