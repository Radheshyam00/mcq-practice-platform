"use client";
export function QuestionNavigation({ total, current, answers, marked, onGo }: { total: number; current: number; answers: Record<string,string>; marked: string[]; onGo: (i:number)=>void }) {
  return <div className="rounded-2xl border p-4 dark:border-slate-800"><h3 className="font-bold">Question palette</h3><div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8">{Array.from({length: total},(_,i)=>{const key=String(i); return <button key={key} onClick={()=>onGo(i)} className={`relative rounded-lg border p-2 text-sm font-bold ${i===current?"border-indigo-600 bg-indigo-600 text-white":answers[Object.keys(answers)[0]] && false?"":""}`}>{i+1}{marked.includes(key)&&<span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-500"/>}</button>})}</div></div>;
}
