"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
    setMounted(true);
  }, []);

  const toggle = () => {
    const nextTheme = !dark;

    document.documentElement.classList.toggle("dark", nextTheme);
    localStorage.setItem("theme", nextTheme ? "dark" : "light");

    setDark(nextTheme);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="
          flex h-10 w-10 items-center justify-center
          rounded-xl
          border border-slate-200
          bg-white
          text-slate-600
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-300
        "
      >
        <Moon size={18} strokeWidth={2} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        group relative
        flex h-10 w-10 items-center justify-center
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        text-slate-600
        shadow-sm
        transition-all
        duration-200

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
      {/* Light mode icon */}
      <Sun
        size={19}
        strokeWidth={2}
        className="
          absolute
          rotate-90
          scale-0
          transition-all
          duration-300
          dark:rotate-0
          dark:scale-100
        "
      />

      {/* Dark mode icon */}
      <Moon
        size={19}
        strokeWidth={2}
        className="
          rotate-0
          scale-100
          transition-all
          duration-300
          dark:-rotate-90
          dark:scale-0
        "
      />

      {/* Hover glow */}
      <span
        className="
          pointer-events-none
          absolute inset-0
          rounded-xl
          bg-indigo-500/0
          transition-all duration-200
          group-hover:bg-indigo-500/5
          dark:group-hover:bg-indigo-400/5
        "
      />
    </button>
  );
}