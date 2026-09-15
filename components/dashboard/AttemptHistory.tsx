import { Card } from "@/components/common/Card";
export function AttemptHistory() { return <Card><h3 className="font-bold">Recent attempts</h3><div className="mt-4 space-y-3">{["Computer Instructor","Cybersecurity","SSC CGL"].map((x,i)=><div key={x} className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-950"><span>{x}</span><b>{82-i*7}%</b></div>)}</div></Card>; }
