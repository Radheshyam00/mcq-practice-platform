import Link from "next/link";

export function Footer() {
  return <footer className="mt-16 border-t border-slate-200 dark:border-slate-800">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
      <div><div className="text-lg font-black"><span className="text-indigo-600">MCQ</span> Practice</div><p className="mt-2 text-sm text-slate-500">Practice smarter. Improve faster.</p></div>
      <div><h3 className="font-bold">Platform</h3><div className="mt-3 grid gap-2 text-sm text-slate-500"><Link href="/exams">Exams</Link><Link href="/mock-tests">Mock Tests</Link><Link href="/daily-quiz">Daily Quiz</Link></div></div>
      <div><h3 className="font-bold">Company</h3><div className="mt-3 grid gap-2 text-sm text-slate-500"><Link href="/about">About</Link><Link href="/contact">Contact</Link></div></div>
    </div>
    <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500 dark:border-slate-800">© 2026 MCQ Practice. All rights reserved.</div>
  </footer>;
}
