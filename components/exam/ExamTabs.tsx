import Link from "next/link";
export function ExamTabs({ slug }: { slug: string }) {
  const tabs = [["", "Overview"],["/instructions","Instructions"],["/practice","Practice"],["/mock-test","Mock Tests"],["/questions","Questions"]];
  return <div className="flex gap-2 overflow-x-auto border-b py-2">{tabs.map(([path,label])=><Link key={label} href={`/exams/${slug}${path}`} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">{label}</Link>)}</div>;
}
