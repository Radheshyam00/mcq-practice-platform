"use client";
import { Clock } from "lucide-react";
import { formatTime } from "@/lib/utils";
export function QuizTimer({ seconds }: { seconds: number }) { return <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${seconds<60?"bg-red-50 text-red-600 dark:bg-red-950/40":"bg-slate-100 dark:bg-slate-800"}`}><Clock size={17}/>{formatTime(seconds)}</div>; }
