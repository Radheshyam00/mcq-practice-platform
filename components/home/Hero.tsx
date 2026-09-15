import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Target,
  Trophy,
} from "lucide-react";

const options = [
  {
    letter: "A",
    text: "DHCP",
    correct: false,
  },
  {
    letter: "B",
    text: "DNS",
    correct: true,
  },
  {
    letter: "C",
    text: "ARP",
    correct: false,
  },
  {
    letter: "D",
    text: "FTP",
    correct: false,
  },
];

export function Hero() {
  return (
    <section
      className="
        relative
        overflow-hidden
        border-b
        border-slate-200
        bg-white
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
          -left-32
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
          -bottom-40
          right-0
          h-96
          w-96
          rounded-full
          bg-violet-200/30
          blur-3xl
          dark:bg-violet-900/10
        "
      />

      <div
        className="
          relative
          mx-auto
          grid
          max-w-7xl
          gap-12
          px-4
          py-16
          sm:px-6
          sm:py-20
          lg:grid-cols-2
          lg:items-center
          lg:gap-16
          lg:px-8
          lg:py-24
        "
      >
        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-indigo-200
              bg-indigo-50
              px-3.5
              py-2
              text-xs
              font-bold
              text-indigo-700
              shadow-sm

              dark:border-indigo-500/20
              dark:bg-indigo-950/40
              dark:text-indigo-300
            "
          >
            <CheckCircle2
              size={15}
              strokeWidth={2.5}
              className="text-indigo-600 dark:text-indigo-400"
            />

            <span>Free exam practice platform</span>
          </div>

          {/* Heading */}
          <h1
            className="
              text-4xl
              font-black
              leading-[1.08]
              tracking-tight
              text-slate-950

              sm:text-5xl
              lg:text-6xl
              xl:text-7xl

              dark:text-white
            "
          >
            Master your exam with{" "}
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
              MCQ practice.
            </span>
          </h1>

          {/* Description */}
          <p
            className="
              mt-6
              max-w-xl
              text-base
              leading-7
              text-slate-600

              sm:text-lg
              sm:leading-8

              dark:text-slate-400
            "
          >
            Practice topic-wise questions, take timed mock tests, review
            explanations, and track your performance — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/exams"
              className="
                group
                inline-flex
                min-h-12
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-6
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-indigo-500/20
                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-indigo-700
                hover:shadow-xl
                hover:shadow-indigo-500/25

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2

                active:translate-y-0
              "
            >
              Explore Exams

              <ArrowRight
                size={18}
                strokeWidth={2.5}
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-1
                "
              />
            </Link>

            <Link
              href="/daily-quiz"
              className="
                inline-flex
                min-h-12
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                px-6
                text-sm
                font-bold
                text-slate-700
                shadow-sm
                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:border-indigo-200
                hover:bg-indigo-50
                hover:text-indigo-600
                hover:shadow-md

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-200
                dark:hover:border-indigo-500/40
                dark:hover:bg-indigo-950/40
                dark:hover:text-indigo-400
              "
            >
              Daily Quiz
            </Link>
          </div>

          {/* Trust / Stats */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Target
                size={15}
                className="text-indigo-500"
              />
              Topic-wise practice
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Clock3
                size={15}
                className="text-indigo-500"
              />
              Timed tests
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Trophy
                size={15}
                className="text-indigo-500"
              />
              Track progress
            </div>
          </div>
        </div>

        {/* =====================================================
            QUESTION PREVIEW
        ====================================================== */}
        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          {/* Glow */}
          <div
            aria-hidden="true"
            className="
              absolute
              -inset-4
              rounded-4xl
              bg-indigo-500/10
              blur-2xl
              dark:bg-indigo-500/5
            "
          />

          {/* Main Card */}
          <div
            className="
              relative
              rounded-4xl
              border
              border-slate-200
              bg-white
              p-3
              shadow-2xl
              shadow-slate-900/10

              dark:border-slate-800
              dark:bg-slate-900
              dark:shadow-black/30
            "
          >
            {/* Browser/Header */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-100
                px-3
                pb-3
                dark:border-slate-800
              "
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>

              <span
                className="
                  rounded-full
                  bg-emerald-50
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-emerald-600

                  dark:bg-emerald-950/40
                  dark:text-emerald-400
                "
              >
                Practice Mode
              </span>
            </div>

            {/* Question Area */}
            <div
              className="
                mt-3
                rounded-2xl
                bg-slate-50
                p-5

                sm:p-6

                dark:bg-slate-950
              "
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-4">
                <span
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Question 12 of 30
                </span>

                <span
                  className="
                    rounded-full
                    bg-indigo-100
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    text-indigo-700
                    dark:bg-indigo-950
                    dark:text-indigo-300
                  "
                >
                  Networking
                </span>
              </div>

              {/* Progress */}
              <div
                className="
                  mt-4
                  h-1.5
                  overflow-hidden
                  rounded-full
                  bg-slate-200
                  dark:bg-slate-800
                "
              >
                <div
                  className="
                    h-full
                    w-[40%]
                    rounded-full
                    bg-indigo-600
                    dark:bg-indigo-500
                  "
                />
              </div>

              {/* Question */}
              <h2
                className="
                  mt-6
                  text-lg
                  font-bold
                  leading-7
                  text-slate-900

                  sm:text-xl
                  sm:leading-8

                  dark:text-white
                "
              >
                Which protocol resolves domain names to IP addresses?
              </h2>

              {/* Options */}
              <div className="mt-5 grid gap-2.5">
                {options.map((option) => (
                  <div
                    key={option.letter}
                    className={`
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      p-3
                      text-sm
                      font-medium
                      transition-all

                      ${
                        option.correct
                          ? `
                            border-indigo-500
                            bg-indigo-50
                            text-indigo-700
                            shadow-sm
                            shadow-indigo-500/10
                            dark:border-indigo-500
                            dark:bg-indigo-950/50
                            dark:text-indigo-300
                          `
                          : `
                            border-slate-200
                            bg-white
                            text-slate-700
                            dark:border-slate-800
                            dark:bg-slate-900
                            dark:text-slate-300
                          `
                      }
                    `}
                  >
                    {/* Letter */}
                    <span
                      className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-xs
                        font-black

                        ${
                          option.correct
                            ? `
                              bg-indigo-600
                              text-white
                              dark:bg-indigo-500
                            `
                            : `
                              bg-slate-100
                              text-slate-500
                              dark:bg-slate-800
                              dark:text-slate-400
                            `
                        }
                      `}
                    >
                      {option.letter}
                    </span>

                    <span className="flex-1">{option.text}</span>

                    {option.correct && (
                      <CheckCircle2
                        size={18}
                        strokeWidth={2.5}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Status */}
              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-between
                  border-t
                  border-slate-200
                  pt-4
                  dark:border-slate-800
                "
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Clock3 size={14} />
                  <span>01:42 remaining</span>
                </div>

                <span
                  className="
                    text-xs
                    font-bold
                    text-emerald-600
                    dark:text-emerald-400
                  "
                >
                  Correct answer
                </span>
              </div>
            </div>
          </div>

          {/* Floating Score Card */}
          <div
            className="
              absolute
              -bottom-5
              -left-3
              hidden
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              shadow-xl

              sm:flex
              lg:-left-8

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600
                dark:bg-emerald-950/50
                dark:text-emerald-400
              "
            >
              <Trophy size={18} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Accuracy
              </p>

              <p className="text-sm font-black text-slate-900 dark:text-white">
                92% Correct
              </p>
            </div>
          </div>

          {/* Floating Timer Card */}
          <div
            className="
              absolute
              -right-2
              -top-5
              hidden
              items-center
              gap-2
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              shadow-xl

              sm:flex
              lg:-right-6

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <Clock3
              size={17}
              className="text-indigo-600 dark:text-indigo-400"
            />

            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Timed Test
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}