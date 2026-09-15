import Link from "next/link";
import { subjects } from "@/data/subjects";
export function SubjectCard({ slug }: { slug: string }) {
  const subject = subjects.find((s) => s.slug === slug);
  if (!subject) return null;
  return <Link href={`/subjects/${slug}`} className="block rounded-2xl border bg-white p-5 hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"><div className="text-2xl">{subject.icon}</div><h3 className="mt-3 font-bold">{subject.name}</h3><p className="mt-1 text-sm text-slate-500">{subject.description}</p></Link>;
}
