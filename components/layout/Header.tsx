import Link from "next/link";
import { Search } from "lucide-react";

import { Navbar } from "./Navbar";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header
      className="
        sticky top-0 z-50 w-full
        border-b
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      <div
        className="
          mx-auto flex h-16 max-w-7xl items-center
          justify-between px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* ================= LOGO ================= */}
        <Link
          href="/"
          aria-label="MCQ Practice Home"
          className="
            group flex shrink-0 items-center gap-2
            rounded-xl px-1 py-1
            outline-none
            transition-all duration-200
            focus-visible:ring-2
            focus-visible:ring-indigo-500
          "
        >
          {/* Logo Icon */}
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              bg-indigo-600
              text-sm font-black text-white
              shadow-md shadow-indigo-500/20
              transition-all duration-200
              group-hover:scale-105
              group-hover:bg-indigo-700
              dark:bg-indigo-500
              dark:group-hover:bg-indigo-400
            "
          >
            M
          </div>

          {/* Logo Text */}
          <div className="hidden sm:block">
            <div
              className="
                text-lg font-black
                leading-none tracking-tight
                text-slate-900
                dark:text-white
              "
            >
              <span className="text-indigo-600 dark:text-indigo-400">
                MCQ
              </span>{" "}
              <span>Practice</span>
            </div>

            <p
              className="
                mt-1
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-slate-500
                dark:text-slate-400
              "
            >
              Learn • Practice • Succeed
            </p>
          </div>

          {/* Mobile Logo */}
          <span
            className="
              text-base font-black tracking-tight
              text-slate-900
              sm:hidden
              dark:text-white
            "
          >
            <span className="text-indigo-600 dark:text-indigo-400">
              MCQ
            </span>
          </span>
        </Link>

        {/* ================= DESKTOP NAVBAR ================= */}
        <div className="hidden flex-1 justify-center lg:flex">
          <Navbar />
        </div>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <Link
            href="/search"
            aria-label="Search questions and exams"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              border border-transparent
              text-slate-600
              transition-all duration-200

              hover:border-slate-200
              hover:bg-slate-100
              hover:text-indigo-600

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500

              dark:text-slate-300
              dark:hover:border-slate-700
              dark:hover:bg-slate-800
              dark:hover:text-indigo-400
            "
          >
            <Search
              size={19}
              strokeWidth={2}
              className="transition-transform duration-200 hover:scale-110"
            />
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>

      {/* Mobile Accent */}
      <div
        className="
          h-px w-full
          bg-linear-to-r
          from-transparent
          via-indigo-500/40
          to-transparent
          lg:hidden
        "
      />
    </header>
  );
}