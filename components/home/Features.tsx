
import {
  BarChart3,
  BookOpenCheck,
  Clock3,
  Lightbulb,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Topic-wise Practice",
    text: "Focus on one subject or topic at a time and strengthen your fundamentals.",
  },
  {
    icon: Clock3,
    title: "Timed Mock Tests",
    text: "Build speed and accuracy by practicing under realistic exam conditions.",
  },
  {
    icon: Lightbulb,
    title: "Detailed Explanations",
    text: "Understand why every answer is correct and learn from your mistakes.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    text: "Review your attempts, monitor accuracy, and identify your weak areas.",
  },
];

export function Features() {
  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        border-y
        border-slate-200/80
        bg-white
        py-16
        sm:py-20
        lg:py-24
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
          -left-40
          top-0
          h-80
          w-80
          rounded-full
          bg-indigo-100/60
          blur-3xl
          dark:bg-indigo-950/30
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-0
          h-80
          w-80
          rounded-full
          bg-violet-100/60
          blur-3xl
          dark:bg-violet-950/25
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
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
          <div
            className="
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
              uppercase
              tracking-wider
              text-indigo-700
              shadow-sm
              shadow-indigo-100/50
              dark:border-indigo-500/30
              dark:bg-indigo-950/50
              dark:text-indigo-300
              dark:shadow-none
            "
          >
            <BookOpenCheck
              size={15}
              strokeWidth={2.5}
              aria-hidden="true"
            />

            <span>Powerful Practice Tools</span>
          </div>

          {/* Heading */}
          <h2
            className="
              mt-5
              text-3xl
              font-black
              leading-tight
              tracking-tight
              text-slate-950
              sm:text-4xl
              lg:text-5xl
              dark:text-white
            "
          >
            Everything you need to{" "}
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
              improve
            </span>
          </h2>

          {/* Description */}
          <p
            className="
              mx-auto
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
            Practice smarter with focused questions, realistic mock tests,
            detailed explanations, and useful performance insights.
          </p>
        </div>

        {/* Feature cards */}
        <div
          className="
            mt-10
            grid
            grid-cols-1
            gap-5
            sm:mt-12
            sm:grid-cols-2
            lg:grid-cols-4
            lg:gap-6
          "
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="
                  group
                  relative
                  flex
                  min-h-70
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                  shadow-slate-200/60
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-indigo-300
                  hover:shadow-xl
                  hover:shadow-indigo-100/60
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:shadow-none
                  dark:hover:border-indigo-500/50
                  dark:hover:shadow-indigo-950/30
                "
              >
                {/* Top gradient line */}
                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-x-0
                    top-0
                    h-1
                    origin-left
                    scale-x-0
                    bg-linear-to-r
                    from-indigo-500
                    via-violet-500
                    to-indigo-500
                    transition-transform
                    duration-300
                    group-hover:scale-x-100
                  "
                />

                {/* Icon */}
                <div
                  className="
                    flex
                    h-13
                    w-13
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-indigo-100
                    bg-indigo-50
                    text-indigo-600
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:border-indigo-200
                    group-hover:bg-indigo-600
                    group-hover:text-white
                    group-hover:shadow-lg
                    group-hover:shadow-indigo-500/20
                    dark:border-indigo-500/20
                    dark:bg-indigo-950/60
                    dark:text-indigo-300
                    dark:group-hover:border-indigo-500
                    dark:group-hover:bg-indigo-500
                    dark:group-hover:text-white
                  "
                >
                  <Icon
                    size={23}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <div className="mt-5">
                  <h3
                    className="
                      text-base
                      font-extrabold
                      leading-6
                      text-slate-900
                      transition-colors
                      group-hover:text-indigo-700
                      dark:text-white
                      dark:group-hover:text-indigo-300
                    "
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="
                      mt-2.5
                      text-sm
                      leading-6
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {feature.text}
                  </p>
                </div>

                {/* Bottom content */}
                <div className="mt-auto pt-6">
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      border-t
                      border-slate-100
                      pt-4
                      dark:border-slate-800
                    "
                  >
                    <span
                      aria-hidden="true"
                      className="
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-indigo-500
                        transition-all
                        duration-300
                        group-hover:w-6
                        dark:bg-indigo-400
                      "
                    />

                    <span
                      className="
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-slate-400
                        transition-colors
                        group-hover:text-indigo-600
                        dark:text-slate-500
                        dark:group-hover:text-indigo-400
                      "
                    >
                      Practice smarter
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
