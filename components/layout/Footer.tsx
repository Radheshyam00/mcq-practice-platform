"use client";

import Link from "next/link";

import { BackToTop } from "./BackToTop";

export function Footer() {
  return (
    <footer
      className="
        border-t
        border-slate-200
        bg-white
        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-3
          sm:px-6
          lg:px-8
        "
      >
        {/* =========================================================
            BOTTOM BAR — ALWAYS VISIBLE
        ========================================================= */}
        <div
          className="
            flex
            flex-col
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          <div
            className="
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* Copyright */}
            <p>
              © {new Date().getFullYear()} MCQ Practice. All
              rights reserved.
            </p>

            {/* Bottom Links */}
            <div className="flex items-center gap-5">
              <Link
                href="/about"
                className="
                  transition
                  hover:text-indigo-600
                  dark:hover:text-indigo-400
                "
              >
                About
              </Link>

              <Link
                href="/contact"
                className="
                  transition
                  hover:text-indigo-600
                  dark:hover:text-indigo-400
                "
              >
                Contact
              </Link>

              <BackToTop />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}