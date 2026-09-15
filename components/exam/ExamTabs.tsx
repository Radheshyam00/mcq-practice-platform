
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ExamTabsProps {
  slug: string;
}

export function ExamTabs({ slug }: ExamTabsProps) {
  const pathname = usePathname();

  const tabs = [
    {
      path: "",
      label: "Overview",
    },
    {
      path: "/instructions",
      label: "Instructions",
    },
    {
      path: "/practice",
      label: "Practice",
    },
    {
      path: "/mock-test",
      label: "Mock Tests",
    },
    {
      path: "/questions",
      label: "Questions",
    },
  ];

  const basePath = `/exams/${slug}`;

  return (
    <nav
      aria-label="Exam navigation"
      className="
        border-b
        border-slate-200
        dark:border-slate-800
      "
    >
      <div
        className="
          -mb-px
          flex
          gap-1
          overflow-x-auto
          px-1
          scrollbar-none
        "
      >
        {tabs.map((tab) => {
          const href = `${basePath}${tab.path}`;

          const isActive =
            tab.path === ""
              ? pathname === basePath
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={tab.label}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`
                relative
                shrink-0
                whitespace-nowrap
                rounded-t-xl
                px-4
                py-3
                text-sm
                font-bold
                transition-all
                duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2
                dark:focus-visible:ring-offset-slate-950
                ${
                  isActive
                    ? `
                      bg-indigo-50
                      text-indigo-700
                      dark:bg-indigo-950/50
                      dark:text-indigo-300
                    `
                    : `
                      text-slate-500
                      hover:bg-slate-100
                      hover:text-slate-900
                      dark:text-slate-400
                      dark:hover:bg-slate-900
                      dark:hover:text-slate-100
                    `
                }
              `}
            >
              {tab.label}

              {/* Active indicator */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    inset-x-2
                    -bottom-px
                    h-0.5
                    rounded-full
                    bg-indigo-600
                    dark:bg-indigo-400
                  "
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
