import { Card } from "@/components/common/Card";
export function PerformanceChart() { return <Card><h3 className="font-bold">Weekly performance</h3><div className="mt-6 flex h-40 items-end gap-3">{[45,60,55,72,68,82,78].map((n,i)=><div key={i} className="flex-1 rounded-t-lg bg-indigo-500/80" style={{height:`${n}%`}} title={`${n}%`}/>)}</div></Card>; }
