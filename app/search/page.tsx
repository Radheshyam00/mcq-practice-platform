"use client";
import { useState } from "react";
import { questions } from "@/data/questions";
import { exams } from "@/data/exams";
import { SearchBar } from "@/components/common/SearchBar";
import Link from "next/link";

export default function SearchPage(){const [q,setQ]=useState(""); const term=q.toLowerCase(); const qs=questions.filter(x=>x.question.toLowerCase().includes(term)); const es=exams.filter(x=>x.name.toLowerCase().includes(term)); return <div className="mx-auto max-w-5xl px-4 py-12"><h1 className="text-4xl font-black">Search</h1><div className="mt-6"><SearchBar value={q} onChange={setQ}/></div><div className="mt-8 grid gap-8">{es.length>0&&<section><h2 className="text-xl font-black">Exams</h2><div className="mt-3 grid gap-2">{es.map(e=><Link href={`/exams/${e.slug}`} key={e.id} className="rounded-xl border p-4">{e.name}</Link>)}</div></section>}<section><h2 className="text-xl font-black">Questions</h2><div className="mt-3 grid gap-2">{qs.length?qs.map(x=><Link href={`/questions/${x.id}`} key={x.id} className="rounded-xl border p-4">{x.question}</Link>):<p className="text-sm text-slate-500">No matching questions.</p>}</div></section></div></div>;}
