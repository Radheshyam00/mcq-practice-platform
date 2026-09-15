
import type { Exam } from "@/types/exam";
import { ExamCard as HomeExamCard } from "@/components/home/ExamCard";

interface ExamCardProps {
  exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <div className="h-full min-w-0">
      <HomeExamCard exam={exam} />
    </div>
  );
}
