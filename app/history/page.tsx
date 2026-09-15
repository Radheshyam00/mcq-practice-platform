"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { HISTORY_STORAGE_KEY } from "@/lib/constants";
import { EmptyState } from "@/components/common/EmptyState";

export default function HistoryPage(){const [history]=useLocalStorage<Array<{title:string;score:number;date:string}>>(HISTORY_STORAGE_KEY,[]); return <div className="mx-auto max-w-5xl px-4 py-12"><h1 className="text-4xl font-black">Practice History</h1><div className="mt-8">{history.length?<div className="grid gap-3">{history.map((h,i)=><div key={i} className="flex justify-between rounded-2xl border p-5 dark:border-slate-800"><span>{h.title}</span><b>{h.score}%</b></div>)}</div>:<EmptyState title="No attempts yet" description="Complete a practice quiz to build your history."/>}</div></div>;}
