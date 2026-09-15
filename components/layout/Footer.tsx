import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  Mail,
  MessageCircle,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { BackToTop } from "./BackToTop";

const platformLinks = [
  {
    href: "/exams",
    label: "Exams",
    icon: BookOpen,
  },
  {
    href: "/mock-tests",
    label: "Mock Tests",
    icon: ClipboardCheck,
  },
  {
    href: "/daily-quiz",
    label: "Daily Quiz",
    icon: Trophy,
  },
  {
    href: "/subjects",
    label: "Subjects",
    icon: BookOpen,
  },
];

const companyLinks = [
  {
    href: "/about",
    label: "About Us",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export function Footer() {
  return (
    <footer
      className="
        border-t border-slate-200
        bg-slate-50
        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* =================================================
              BRAND
          ================================================== */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              aria-label="MCQ Practice Home"
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-xl
                outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
              "
            >
              {/* Logo */}
              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  bg-indigo-600
                  text-sm font-black
                  text-white
                  shadow-lg
                  shadow-indigo-500/20
                  transition-all duration-200

                  group-hover:scale-105
                  group-hover:bg-indigo-700

                  dark:bg-indigo-500
                  dark:group-hover:bg-indigo-400
                "
              >
                M
              </div>

              {/* Brand */}
              <div>
                <div
                  className="
                    text-xl
                    font-black
                    leading-none
                    tracking-tight
                    text-slate-900
                    dark:text-white
                  "
                >
                  <span className="text-indigo-600 dark:text-indigo-400">
                    MCQ
                  </span>{" "}
                  Practice
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
            </Link>

            {/* Description */}
            <p
              className="
                mt-5
                max-w-xl
                text-sm
                leading-6
                text-slate-600
                dark:text-slate-400
              "
            >
              Practice multiple-choice questions, improve your accuracy,
              attempt mock tests, and prepare confidently for competitive
              examinations.
            </p>

            {/* Trust Badge */}
            <div
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-xs
                font-semibold
                text-slate-600
                shadow-sm

                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-300
              "
            >
              <ShieldCheck
                size={15}
                strokeWidth={2}
                className="text-emerald-500"
              />

              <span>Free exam practice platform</span>
            </div>
          </div>

          {/* =================================================
              PLATFORM
          ================================================== */}
          <div>
            <h3
              className="
                text-sm
                font-bold
                uppercase
                tracking-wider
                text-slate-900
                dark:text-white
              "
            >
              Platform
            </h3>

            <nav
              aria-label="Platform navigation"
              className="mt-4 grid gap-1.5"
            >
              {platformLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-transparent
                      px-2
                      py-2
                      text-sm
                      font-medium
                      text-slate-600
                      transition-all duration-200

                      hover:border-slate-200
                      hover:bg-white
                      hover:text-indigo-600
                      hover:shadow-sm

                      dark:text-slate-400
                      dark:hover:border-slate-800
                      dark:hover:bg-slate-900
                      dark:hover:text-indigo-400
                    "
                  >
                    <Icon
                      size={15}
                      strokeWidth={2}
                      className="
                        text-slate-400
                        transition-colors
                        group-hover:text-indigo-500
                        dark:text-slate-500
                        dark:group-hover:text-indigo-400
                      "
                    />

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* =================================================
              COMPANY
          ================================================== */}
          <div>
            <h3
              className="
                text-sm
                font-bold
                uppercase
                tracking-wider
                text-slate-900
                dark:text-white
              "
            >
              Company
            </h3>

            <nav
              aria-label="Company navigation"
              className="mt-4 grid gap-1.5"
            >
              {companyLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-transparent
                    px-2
                    py-2
                    text-sm
                    font-medium
                    text-slate-600
                    transition-all duration-200

                    hover:border-slate-200
                    hover:bg-white
                    hover:text-indigo-600
                    hover:shadow-sm

                    dark:text-slate-400
                    dark:hover:border-slate-800
                    dark:hover:bg-slate-900
                    dark:hover:text-indigo-400
                  "
                >
                  <MessageCircle
                    size={15}
                    strokeWidth={2}
                    className="
                      text-slate-400
                      transition-colors
                      group-hover:text-indigo-500
                      dark:text-slate-500
                      dark:group-hover:text-indigo-400
                    "
                  />

                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Contact */}
            <Link
              href="/contact"
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                text-xs
                font-semibold
                text-indigo-600
                transition-colors

                hover:text-indigo-700

                dark:text-indigo-400
                dark:hover:text-indigo-300
              "
            >
              <Mail size={14} strokeWidth={2} />
              <span>Get in touch</span>
            </Link>
          </div>
        </div>

        {/* =====================================================
            DIVIDER
        ====================================================== */}
        <div className="my-10 h-px bg-slate-200 dark:bg-slate-800" />

        {/* =====================================================
            CTA
        ====================================================== */}
        <div
          className="
            flex
            flex-col
            gap-5
            rounded-2xl
            border
            border-indigo-100
            bg-indigo-50
            p-5

            sm:flex-row
            sm:items-center
            sm:justify-between

            dark:border-indigo-500/20
            dark:bg-indigo-950/20
          "
        >
          <div>
            <h3
              className="
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Ready to improve your score?
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-slate-600
                dark:text-slate-400
              "
            >
              Start practicing questions and track your progress.
            </p>
          </div>

          <Link
            href="/exams"
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-indigo-600
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              shadow-md
              shadow-indigo-500/20
              transition-all duration-200

              hover:bg-indigo-700
              hover:shadow-lg
              hover:shadow-indigo-500/25

              active:scale-[0.98]

              dark:bg-indigo-500
              dark:text-white
              dark:hover:bg-indigo-400
            "
          >
            Start Practicing
          </Link>
        </div>
      </div>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}
      <div
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
            flex
            max-w-7xl
            flex-col
            gap-4
            px-4
            py-5
            text-center

            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:text-left
            sm:px-6

            lg:px-8
          "
        >
          {/* Copyright */}
          <p
            className="
              text-xs
              text-slate-500
              dark:text-slate-500
            "
          >
            © 2026{" "}
            <span
              className="
                font-semibold
                text-slate-700
                dark:text-slate-300
              "
            >
              MCQ Practice
            </span>
            . All rights reserved.
          </p>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/about"
              className="
                text-xs
                font-medium
                text-slate-500
                transition-colors

                hover:text-indigo-600

                dark:text-slate-500
                dark:hover:text-indigo-400
              "
            >
              About
            </Link>

            <Link
              href="/contact"
              className="
                text-xs
                font-medium
                text-slate-500
                transition-colors

                hover:text-indigo-600

                dark:text-slate-500
                dark:hover:text-indigo-400
              "
            >
              Contact
            </Link>

            {/* Client Component */}
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}