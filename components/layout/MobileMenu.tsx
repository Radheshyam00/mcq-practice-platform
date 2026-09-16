"use client";

import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  Home,
  LayoutGrid,
  ListChecks,
  LogIn,
  Menu,
  ShieldCheck,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const menuItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/exams",
    label: "Exams",
    icon: BookOpen,
  },
  {
    href: "/subjects",
    label: "Subjects",
    icon: LayoutGrid,
  },
  {
    href: "/mock-tests",
    label: "Mock Tests",
    icon: ClipboardCheck,
  },
  {
    href: "/daily-quiz",
    label: "Daily Quiz",
    icon: ListChecks,
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    icon: Trophy,
  },
  {
    href: "/admin/login",
    label: "Admin Login",
    icon: ShieldCheck,
  },
  {
    href: "login",
    label: "Login",
    icon: LogIn,
  },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Prevent background scrolling while menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close menu with Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* ================= MENU BUTTON ================= */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        className="
          group flex h-10 w-10 items-center justify-center
          rounded-xl
          border border-slate-200
          bg-white
          text-slate-700
          shadow-sm
          transition-all duration-200

          hover:border-indigo-200
          hover:bg-indigo-50
          hover:text-indigo-600
          hover:shadow-md

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-indigo-500
          focus-visible:ring-offset-2
          focus-visible:ring-offset-white

          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-300

          dark:hover:border-indigo-500/40
          dark:hover:bg-indigo-950/50
          dark:hover:text-indigo-400

          dark:focus-visible:ring-offset-slate-950
        "
      >
        {open ? (
          <X
            size={20}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:rotate-90"
          />
        ) : (
          <Menu
            size={20}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:scale-110"
          />
        )}
      </button>

      {/* ================= MOBILE PANEL ================= */}
      {open && (
        <>
          {/* Background Overlay */}
          <button
            type="button"
            aria-label="Close mobile menu"
            onClick={() => setOpen(false)}
            className="
              fixed inset-0 top-16 z-40
              cursor-default
              bg-slate-950/30
              backdrop-blur-[2px]
              dark:bg-black/50
            "
          />

          {/* Navigation */}
          <div
            id="mobile-navigation"
            className="
              absolute left-0 right-0 top-16 z-50
              border-b border-slate-200
              bg-white
              shadow-xl
              dark:border-slate-800
              dark:bg-slate-950
            "
          >
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              {/* Menu Header */}
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Navigation
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Explore MCQ Practice
                  </p>
                </div>

                <span
                  className="
                    rounded-full
                    bg-indigo-50
                    px-2.5 py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-indigo-600
                    dark:bg-indigo-950/50
                    dark:text-indigo-400
                  "
                >
                  Menu
                </span>
              </div>

              {/* Menu Items */}
              <nav className="grid gap-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="
                        group flex items-center gap-3
                        rounded-xl
                        border border-transparent
                        px-3 py-3
                        text-sm font-semibold
                        text-slate-700
                        transition-all duration-200

                        hover:border-indigo-100
                        hover:bg-indigo-50
                        hover:text-indigo-600

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        dark:text-slate-300
                        dark:hover:border-indigo-500/20
                        dark:hover:bg-indigo-950/40
                        dark:hover:text-indigo-400
                      "
                    >
                      {/* Icon */}
                      <span
                        className="
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-lg
                          bg-slate-100
                          text-slate-500
                          transition-all duration-200

                          group-hover:bg-indigo-100
                          group-hover:text-indigo-600

                          dark:bg-slate-800
                          dark:text-slate-400
                          dark:group-hover:bg-indigo-950
                          dark:group-hover:text-indigo-400
                        "
                      >
                        <Icon size={18} strokeWidth={2} />
                      </span>

                      {/* Label */}
                      <span className="flex-1">{item.label}</span>

                      {/* Arrow */}
                      <span
                        className="
                          text-slate-300
                          transition-transform duration-200
                          group-hover:translate-x-1
                          group-hover:text-indigo-500
                          dark:text-slate-600
                          dark:group-hover:text-indigo-400
                        "
                      >
                        →
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Info */}
              <div
                className="
                  mt-4
                  rounded-xl
                  border border-indigo-100
                  bg-indigo-50
                  p-3
                  dark:border-indigo-500/20
                  dark:bg-indigo-950/30
                "
              >
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  Practice smarter 🚀
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-indigo-600/80 dark:text-indigo-400/80">
                  Practice questions, attempt mock tests and track your
                  preparation.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}