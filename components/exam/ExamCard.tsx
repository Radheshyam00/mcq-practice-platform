import type { Exam } from "@/types/exam";
import { ExamCard as HomeExamCard } from "@/components/home/ExamCard";
export function ExamCard({ exam }: { exam: Exam }) { return <HomeExamCard exam={exam}/>; }
