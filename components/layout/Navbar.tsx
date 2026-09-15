import Link from "next/link";

const links = [
  { href: "/exams", label: "Exams" },
  { href: "/subjects", label: "Subjects" },
  { href: "/mock-tests", label: "Mock Tests" },
  { href: "/daily-quiz", label: "Daily Quiz" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/admin/login", label: "Admin" },
  { href: "/login", label: "Users" },

];

export function Navbar() {
  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="
            rounded-xl px-3 py-2
            text-sm font-semibold
            text-slate-700
            transition-all duration-200

            hover:bg-slate-100
            hover:text-indigo-600

            dark:text-slate-300
            dark:hover:bg-slate-800
            dark:hover:text-indigo-400
          "
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}