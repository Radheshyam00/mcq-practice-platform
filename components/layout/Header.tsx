"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";

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
        <nav
          className="
            hidden flex-1 items-center justify-center gap-1
            lg:flex
          "
        >
          {/* Exams */}
          <Link
            href="/exams"
            className="
              rounded-lg px-3 py-2
              text-sm font-semibold
              text-slate-600
              transition-colors
              hover:bg-slate-100
              hover:text-indigo-600
              dark:text-slate-300
              dark:hover:bg-slate-800
              dark:hover:text-indigo-400
            "
          >
            Exams
          </Link>

          {/* Subjects */}
          <Link
            href="/subjects"
            className="
              rounded-lg px-3 py-2
              text-sm font-semibold
              text-slate-600
              transition-colors
              hover:bg-slate-100
              hover:text-indigo-600
              dark:text-slate-300
              dark:hover:bg-slate-800
              dark:hover:text-indigo-400
            "
          >
            Subjects
          </Link>

          {/* Mock Tests */}
          <Link
            href="/mock-tests"
            className="
              rounded-lg px-3 py-2
              text-sm font-semibold
              text-slate-600
              transition-colors
              hover:bg-slate-100
              hover:text-indigo-600
              dark:text-slate-300
              dark:hover:bg-slate-800
              dark:hover:text-indigo-400
            "
          >
            Mock Tests
          </Link>

          {/* Daily Quiz */}
          <Link
            href="/daily-quiz"
            className="
              rounded-lg px-3 py-2
              text-sm font-semibold
              text-slate-600
              transition-colors
              hover:bg-slate-100
              hover:text-indigo-600
              dark:text-slate-300
              dark:hover:bg-slate-800
              dark:hover:text-indigo-400
            "
          >
            Daily Quiz
          </Link>

          {/* ================= LOGGED-IN USER ================= */}
          {isLoggedIn && !isAdmin && (
            <>
              {/* Leaderboard */}
              <Link
                href="/leaderboard"
                className="
                  rounded-lg px-3 py-2
                  text-sm font-semibold
                  text-slate-600
                  transition-colors
                  hover:bg-slate-100
                  hover:text-indigo-600
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                  dark:hover:text-indigo-400
                "
              >
                Leaderboard
              </Link>

              {/* Profile */}
              <Link
                href="/profile"
                className="
                  rounded-lg px-3 py-2
                  text-sm font-semibold
                  text-slate-600
                  transition-colors
                  hover:bg-slate-100
                  hover:text-indigo-600
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                  dark:hover:text-indigo-400
                "
              >
                Profile
              </Link>
            </>
          )}

          {/* ================= ADMIN ================= */}
          {isLoggedIn && isAdmin && (
            <Link
              href="/admin/profile"
              className="
                rounded-lg px-3 py-2
                text-sm font-semibold
                text-slate-600
                transition-colors
                hover:bg-slate-100
                hover:text-indigo-600
                dark:text-slate-300
                dark:hover:bg-slate-800
                dark:hover:text-indigo-400
              "
            >
              Admin Profile
            </Link>
          )}
        </nav>

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

          {/* ================= AUTH ACTIONS ================= */}

          {/* Logged Out */}
          {status !== "loading" && !isLoggedIn && (
            <div className="hidden items-center gap-1.5 lg:flex">
              <Link
                href="/login"
                className="
                  rounded-lg px-3 py-2
                  text-sm font-semibold
                  text-slate-700
                  transition-colors
                  hover:bg-slate-100
                  hover:text-indigo-600
                  dark:text-slate-200
                  dark:hover:bg-slate-800
                  dark:hover:text-indigo-400
                "
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="
                  rounded-lg
                  bg-indigo-600
                  px-3.5 py-2
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  hover:bg-indigo-700
                  hover:shadow-md
                  dark:bg-indigo-500
                  dark:hover:bg-indigo-400
                "
              >
                Signup
              </Link>
            </div>
          )}

          {/* Logged In - Logout */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
              className="
                hidden
                rounded-lg
                px-3 py-2
                text-sm font-semibold
                text-slate-700
                transition-colors
                hover:bg-red-50
                hover:text-red-600
                lg:block
                dark:text-slate-200
                dark:hover:bg-red-950/30
                dark:hover:text-red-400
              "
            >
              Logout
            </button>
          )}

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