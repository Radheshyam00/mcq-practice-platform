import Link from "next/link";

export function Navbar() {
  return <nav className="hidden items-center gap-6 md:flex">
    <Link href="/exams" className="text-sm font-medium hover:text-indigo-600">Exams</Link>
    <Link href="/subjects" className="text-sm font-medium hover:text-indigo-600">Subjects</Link>
    <Link href="/mock-tests" className="text-sm font-medium hover:text-indigo-600">Mock Tests</Link>
    <Link href="/daily-quiz" className="text-sm font-medium hover:text-indigo-600">Daily Quiz</Link>
    <Link href="/leaderboard" className="text-sm font-medium hover:text-indigo-600">Leaderboard</Link>
  </nav>;
}
