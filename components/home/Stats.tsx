import {
  BarChart3,
  BookOpenCheck,
  GraduationCap,
  Trophy,
} from "lucide-react";

const stats = [
  {
    value: "34K+",
    label: "Questions",
    description: "Practice questions",
    icon: BookOpenCheck,
  },
  {
    value: "13K+",
    label: "Learners",
    description: "Active learners",
    icon: GraduationCap,
  },
  {
    value: "250+",
    label: "Mock Tests",
    description: "Exam simulations",
    icon: Trophy,
  },
  {
    value: "92%",
    label: "Satisfaction",
    description: "Learner satisfaction",
    icon: BarChart3,
  },
];

export function Stats() {
  return (
    <section
      className="
        relative
        overflow-hidden
        border-y
        border-slate-200
        bg-white
        py-12
        sm:py-14
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
          left-1/2
          top-0
          h-64
          w-64
          -translate-x-1/2
          rounded-full
          bg-indigo-200/20
          blur-3xl
          dark:bg-indigo-900/10
        "
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Small heading */}
        <div className="mb-8 text-center">
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-indigo-600
              dark:text-indigo-400
            "
          >
            Our platform
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-black
              tracking-tight
              text-slate-950
              sm:text-3xl
              dark:text-white
            "
          >
            Built for better exam preparation
          </h2>
        </div>

        {/* Stats */}
        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:gap-5
            lg:grid-cols-4
          "
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                  text-center
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-indigo-200
                  hover:bg-white
                  hover:shadow-lg
                  hover:shadow-indigo-500/5
                  sm:p-6
                  dark:border-slate-800
                  dark:bg-slate-900/60
                  dark:hover:border-indigo-500/40
                  dark:hover:bg-slate-900
                  dark:hover:shadow-black/20
                "
              >
                {/* Top accent */}
                <div
                  className="
                    absolute
                    left-0
                    top-0
                    h-0.5
                    w-0
                    bg-linear-to-r
                    from-indigo-500
                    to-violet-500
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />

                {/* Icon */}
                <div
                  className="
                    mx-auto
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-50
                    text-indigo-600
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:bg-indigo-600
                    group-hover:text-white
                    dark:bg-indigo-950/60
                    dark:text-indigo-400
                    dark:group-hover:bg-indigo-500
                    dark:group-hover:text-white
                  "
                >
                  <Icon size={19} strokeWidth={2.2} />
                </div>

                {/* Number */}
                <div
                  className="
                    mt-4
                    text-2xl
                    font-black
                    tracking-tight
                    text-indigo-600
                    sm:text-3xl
                    dark:text-indigo-400
                  "
                >
                  {stat.value}
                </div>

                {/* Label */}
                <div
                  className="
                    mt-1
                    text-sm
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {stat.label}
                </div>

                {/* Description */}
                <p
                  className="
                    mt-1
                    text-[11px]
                    leading-5
                    text-slate-500
                    dark:text-slate-500
                  "
                >
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}