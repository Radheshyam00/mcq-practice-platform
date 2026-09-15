import Link from "next/link";
import { Search } from "lucide-react";
import { Navbar } from "./Navbar";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
      <Link href="/" className="text-xl font-black tracking-tight"><span className="text-indigo-600">MCQ</span> Practice</Link>
      <Navbar />
      <div className="flex items-center gap-1">
        <Link href="/search" className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><Search size={19}/></Link>
        <ThemeToggle />
        <MobileMenu />
      </div>
    </div>
  </header>;
}
