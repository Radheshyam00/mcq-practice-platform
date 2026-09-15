const features = [
  ["🎯", "Topic-wise Practice", "Focus on one subject or topic at a time."],
  ["⏱️", "Timed Mock Tests", "Build speed and accuracy under exam conditions."],
  ["💡", "Detailed Explanations", "Understand why every answer is correct."],
  ["📊", "Performance Tracking", "Review attempts and improve weak areas."]
];
export function Features() {
  return <section className="bg-slate-50 py-16 dark:bg-slate-900/40"><div className="mx-auto max-w-7xl px-4"><h2 className="text-center text-3xl font-black">Everything you need to improve</h2><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{features.map(([icon,title,text])=><div key={title} className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-950"><div className="text-3xl">{icon}</div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm text-slate-500">{text}</p></div>)}</div></div></section>;
}
