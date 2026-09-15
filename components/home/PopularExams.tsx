
import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";

import { exams } from "@/data/exams";
import { ExamGrid } from "./ExamGrid";

export function PopularExams() {
  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        border-y
        border-slate-200/80
        bg-slate-50
        py-16
        sm:py-20
        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-indigo-200/40
          blur-3xl
          dark:bg-indigo-900/20
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-32
          -left-32
          h-80
          w-80
          rounded-full
          bg-violet-200/40
          blur-3xl
          dark:bg-violet-900/20
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Header */}
        <div
          className="
            flex
            flex-col
            gap-7
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          {/* Heading content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-indigo-200
                bg-white
                px-3.5
                py-2
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-indigo-700
                shadow-sm
                dark:border-indigo-500/30
                dark:bg-indigo-950/40
                dark:text-indigo-300
              "
            >
              <BookOpenCheck
                size={15}
                strokeWidth={2.5}
                aria-hidden="true"
              />

              <span>Popular Preparation</span>
            </div>

            {/* Heading */}
            <h2
              className="
                mt-5
                text-3xl
                font-black
                leading-[1.15]
                tracking-tight
                text-slate-950
                sm:text-4xl
                lg:text-5xl
                dark:text-white
              "
            >
              Popular{" "}
              <span
                className="
                  bg-linear-to-r
                  from-indigo-600
                  via-violet-600
                  to-indigo-600
                  bg-clip-text
                  text-transparent
                  dark:from-indigo-400
                  dark:via-violet-400
                  dark:to-indigo-400
                "
              >
                Exams
              </span>
            </h2>

            {/* Description */}
            <p
              className="
                mt-4
                max-w-xl
                text-sm
                leading-6
                text-slate-600
                sm:text-base
                sm:leading-7
                dark:text-slate-400
              "
            >
              Start with the exams learners practice most. Improve your
              preparation with focused MCQs, practice questions, and mock
              tests.
            </p>
          </div>

          {/* View all */}
          <Link
            href="/exams"
            className="
              group
              inline-flex
              min-h-11
              shrink-0
              items-center
              justify-center
              gap-2
              self-start
              rounded-xl
              border
              border-slate-300
              bg-white
              px-5
              text-sm
              font-bold
              text-slate-800
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-indigo-400
              hover:bg-indigo-50
              hover:text-indigo-700
              hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2
              focus-visible:ring-offset-slate-50
              active:translate-y-0
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-100
              dark:hover:border-indigo-500/60
              dark:hover:bg-indigo-950/50
              dark:hover:text-indigo-300
              dark:focus-visible:ring-offset-slate-950
            "
          >
            <span>View All Exams</span>

            <ArrowRight
              size={17}
              strokeWidth={2.5}
              aria-hidden="true"
              className="
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>

        {/* Divider */}
        <div
          className="
            mt-10
            h-px
            bg-slate-200
            dark:bg-slate-800
          "
        />

        {/* Exam cards */}
        <div className="mt-10">
          <ExamGrid exams={exams} />
        </div>
      </div>
    </section>
  );
}
