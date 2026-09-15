import { notFound } from "next/navigation";
import { getExam } from "@/data/exams";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ExamInfo } from "@/components/exam/ExamInfo";
import { ExamTabs } from "@/components/exam/ExamTabs";
import { SubjectCard } from "@/components/exam/SubjectCard";
import Link from "next/link";

export default async function ExamPage({ params }: { params: Promise<{ examSlug: string }> }) {
  const { examSlug } = await params;
  const exam = getExam(examSlug);
  if (!exam) notFound();
  return <><ExamHeader exam={exam}/><div className="mx-auto max-w-7xl px-4"><ExamTabs slug={exam.slug}/><div className="py-8"><ExamInfo exam={exam}/><div className="mt-8 flex flex-wrap gap-3"><Link href={`/exams/${exam.slug}/practice`} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">Start Practice</Link><Link href={`/exams/${exam.slug}/mock-test`} className="rounded-xl border px-5 py-3 font-bold">Take Mock Test</Link></div><h2 className="mt-12 text-2xl font-black">Subjects</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{exam.subjects.map((slug)=><SubjectCard key={slug} slug={slug}/>)}</div></div></div></>;
}
