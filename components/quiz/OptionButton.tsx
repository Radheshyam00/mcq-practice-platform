"use client";
import { cn } from "@/lib/utils";
export function OptionButton({ id, text, selected, correct, wrong, disabled, onClick }: { id: string; text: string; selected?: boolean; correct?: boolean; wrong?: boolean; disabled?: boolean; onClick: () => void }) {
  return <button disabled={disabled} onClick={onClick} className={cn("flex w-full items-start gap-3 rounded-xl border p-4 text-left transition", selected && "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40", correct && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30", wrong && "border-red-500 bg-red-50 dark:bg-red-950/30", !selected && !correct && !wrong && "hover:border-indigo-300")}>
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold uppercase">{id}</span><span>{text}</span>
  </button>;
}
