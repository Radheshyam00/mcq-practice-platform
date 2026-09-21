"use client";

import { useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  useEffect(() => {
    // Go to top when the page is refreshed/loaded
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="
        group
        flex h-9 w-9
        items-center justify-center
        rounded-xl
        border border-slate-200
        bg-white
        text-slate-500
        shadow-sm
        transition-all duration-200

        hover:-translate-y-0.5
        hover:border-indigo-200
        hover:bg-indigo-50
        hover:text-indigo-600
        hover:shadow-md

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-indigo-500
        focus-visible:ring-offset-2
        focus-visible:ring-offset-white

        active:translate-y-0
        active:scale-95

        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-400

        dark:hover:border-indigo-500/40
        dark:hover:bg-indigo-950/50
        dark:hover:text-indigo-400

        dark:focus-visible:ring-offset-slate-950
      "
    >
      <ArrowUp
        size={16}
        strokeWidth={2.5}
        className="
          transition-transform duration-200
          group-hover:-translate-y-0.5
        "
      />
    </button>
  );
}