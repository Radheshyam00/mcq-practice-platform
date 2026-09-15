"use client";
import { useState } from "react";
import { Button } from "@/components/common/Button";
export function QuestionForm() { const [question,setQuestion]=useState(""); return <form onSubmit={(e)=>{e.preventDefault();alert("Demo form submitted");}} className="grid gap-4 rounded-2xl border p-6 dark:border-slate-800"><label className="grid gap-2 text-sm font-semibold">Question<textarea value={question} onChange={e=>setQuestion(e.target.value)} rows={4} className="rounded-xl border p-3 font-normal dark:border-slate-700 dark:bg-slate-900"/></label><Button type="submit">Save Question</Button></form>; }
