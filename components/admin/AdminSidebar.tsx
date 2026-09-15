import Link from "next/link";
export function AdminSidebar() { return <aside className="rounded-2xl border p-4 dark:border-slate-800"><div className="font-black">Admin</div><div className="mt-4 grid gap-1">{["Dashboard","Questions","Exams","Subjects"].map(x=><Link key={x} href="#" className="rounded-xl p-3 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">{x}</Link>)}</div></aside>; }
