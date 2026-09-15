import { notFound } from "next/navigation";
import { getExam } from "@/data/exams";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ExamTabs } from "@/components/exam/ExamTabs";
import { TestInstructions } from "@/components/mock-test/TestInstructions";

export default async function InstructionsPage({ params }: { params: Promise<{ examSlug:string }> }) {
  const { examSlug } = await params; const exam=getExam(examSlug); if(!exam) notFound();
  return <><ExamHeader exam={exam}/><div className="mx-auto max-w-7xl px-4"><ExamTabs slug={exam.slug}/><div className="py-8"><TestInstructions/></div></div></>;
}
