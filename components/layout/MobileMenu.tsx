"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return <div className="md:hidden">
    <button onClick={() => setOpen(!open)} className="rounded-xl p-2">{open ? <X/> : <Menu/>}</button>
    {open && <div className="absolute left-0 right-0 top-16 border-b bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="grid gap-2">
        {["/exams","/subjects","/mock-tests","/daily-quiz","/leaderboard"].map((href) => <Link onClick={() => setOpen(false)} key={href} href={href} className="rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-slate-900">{href.slice(1).replace("-", " ")}</Link>)}
      </div>
    </div>}
  </div>;
}
