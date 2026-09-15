import { getMockTest } from "@/data/mockTests";
import { notFound } from "next/navigation";
export default async function TestResultPage({params}:{params:Promise<{testId:string}>}) {
  const {testId}=await params; const test=getMockTest(testId); if(!test) notFound();
  return <div className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-3xl font-black">{test.title} Result</h1><p className="mt-3 text-slate-500">Complete the test to view the result.</p></div>;
}
