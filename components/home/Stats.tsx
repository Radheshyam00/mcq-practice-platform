export function Stats() {
  return <section className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-12 md:grid-cols-4">{[["34K+","Questions"],["13K+","Learners"],["250+","Mock Tests"],["92%","Satisfaction"]].map(([n,l])=><div key={l} className="rounded-2xl border p-6 text-center dark:border-slate-800"><div className="text-3xl font-black text-indigo-600">{n}</div><div className="mt-1 text-sm text-slate-500">{l}</div></div>)}</section>;
}
