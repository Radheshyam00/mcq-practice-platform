import { getMockTest } from "@/data/mockTests";
import { getQuestionsByExam } from "@/data/questions";
import { notFound } from "next/navigation";
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { TestHeader } from "@/components/mock-test/TestHeader";

export default async function TestPage({params}:{params:Promise<{testId:string}>}) {
  const {testId}=await params; const test=getMockTest(testId); if(!test) notFound();
  const qs=getQuestionsByExam(test.examSlug);
  return <div className="mx-auto max-w-6xl px-4 py-10"><TestHeader title={test.title}/><div className="mt-6"><QuizContainer questions={qs} durationMinutes={test.durationMinutes}/></div></div>;
}
