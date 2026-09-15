import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
  return <section className="overflow-hidden bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-950">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2 lg:items-center">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><CheckCircle2 size={15}/> Free exam practice platform</div>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Master your exam with <span className="text-indigo-600">MCQ practice.</span></h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">Practice topic-wise questions, take timed mock tests, review explanations and track your performance.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/exams" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700">Explore Exams <ArrowRight size={18}/></Link><Link href="/daily-quiz" className="rounded-xl border px-5 py-3 font-bold">Daily Quiz</Link></div>
      </div>
      <div className="rounded-3xl border bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900"><div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-950"><div className="text-sm font-bold text-slate-500">Sample Question</div><div className="mt-3 text-xl font-bold">Which protocol resolves domain names to IP addresses?</div><div className="mt-5 grid gap-3">{["DHCP","DNS","ARP","FTP"].map((x,i)=><div key={x} className={"rounded-xl border p-3 " + (i===1 ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50" : "")}>{String.fromCharCode(65+i)}. {x}</div>)}</div></div></div>
    </div>
  </section>;
}
