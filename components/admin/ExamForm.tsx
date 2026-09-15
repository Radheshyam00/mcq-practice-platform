"use client";
import { Button } from "@/components/common/Button";
export function ExamForm() { return <form onSubmit={e=>{e.preventDefault();alert("Demo form submitted");}} className="grid gap-4 rounded-2xl border p-6 dark:border-slate-800"><input required placeholder="Exam name" className="rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-900"/><textarea required placeholder="Description" className="rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-900"/><Button type="submit">Save Exam</Button></form>; }
