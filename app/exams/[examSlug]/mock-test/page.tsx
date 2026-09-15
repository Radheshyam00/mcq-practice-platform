import { getExam } from "@/data/exams";
import { mockTests } from "@/data/mockTests";
import { notFound } from "next/navigation";
import { TestCard } from "@/components/mock-test/TestCard";

export default async function ExamMockTests({ params }: { params: Promise<{examSlug:string}> }) {
  const {examSlug}=await params; const exam=getExam(examSlug); if(!exam) notFound();
  const tests=mockTests.filter(t=>t.examSlug===examSlug);
  return <div className="mx-auto max-w-7xl px-4 py-10"><h1 className="text-3xl font-black">{exam.name} Mock Tests</h1><div className="mt-7 grid gap-4 md:grid-cols-2">{tests.length ? tests.map(t=><TestCard key={t.id} {...t}/>) : <p className="text-slate-500">Mock tests will be added soon.</p>}</div></div>;
}
