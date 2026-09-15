"use client";
import type { Question } from "@/types/question";
import { OptionButton } from "./OptionButton";
import { Badge } from "@/components/common/Badge";

export function QuestionCard({ question, selected, showAnswer, onSelect }: { question: Question; selected?: string; showAnswer?: boolean; onSelect: (id: string) => void }) {
  return <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><div className="flex justify-between gap-4"><Badge>{question.difficulty}</Badge><span className="text-xs text-slate-500">{question.tags.join(" • ")}</span></div><h2 className="mt-5 text-xl font-bold leading-8">{question.question}</h2><div className="mt-6 grid gap-3">{question.options.map((o)=><OptionButton key={o.id} id={o.id} text={o.text} selected={selected===o.id} correct={showAnswer && o.id===question.correctOptionId} wrong={showAnswer && selected===o.id && o.id!==question.correctOptionId} disabled={showAnswer} onClick={()=>onSelect(o.id)}/>)}</div></div>;
}
