"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { BOOKMARK_STORAGE_KEY } from "@/lib/constants";
import { EmptyState } from "@/components/common/EmptyState";
import { questions } from "@/data/questions";
import Link from "next/link";

export default function BookmarksPage(){const [ids]=useLocalStorage<string[]>(BOOKMARK_STORAGE_KEY,[]); const saved=questions.filter(q=>ids.includes(q.id)); return <div className="mx-auto max-w-5xl px-4 py-12"><h1 className="text-4xl font-black">Bookmarks</h1><div className="mt-8">{saved.length?<div className="grid gap-3">{saved.map(q=><Link href={`/questions/${q.id}`} key={q.id} className="rounded-2xl border p-5 dark:border-slate-800"><b>{q.question}</b></Link>)}</div>:<EmptyState title="No bookmarks yet" description="Bookmark questions while practicing to review them later."/>}</div></div>;}
