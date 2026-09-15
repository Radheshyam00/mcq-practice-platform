
import {
  BookOpenCheck,
  Clock3,
  Layers3,
  ListChecks,
} from "lucide-react";

import type { Exam } from "@/types/exam";

interface ExamInfoProps {
  exam: Exam;
}

export function ExamInfo({ exam }: ExamInfoProps) {
  const info = [
    {
      label: "Questions",
      value: `${exam.totalQuestions.toLocaleString()}+`,
      icon: ListChecks,
    },
    {
      label: "Subjects",
      value: exam.subjects.length.toString(),
      icon: BookOpenCheck,
    },
    {
      label: "Mock Time",
      value: `${exam.durationMinutes} min`,
      icon: Clock3,
    },
    {
      label: "Category",
      value: exam.category,
      icon: Layers3,
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:grid-cols-4
        sm:gap-4
      "
    >
      {info.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
              shadow-slate-200/50
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-indigo-200
              hover:shadow-md
              hover:shadow-indigo-100/50
              sm:p-5
              dark:border-slate-800
              dark:bg-slate-900
              dark:shadow-none
              dark:hover:border-indigo-500/40
              dark:hover:shadow-indigo-950/20
            "
          >
            {/* Small accent */}
            <div
              aria-hidden="true"
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
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-indigo-50
                text-indigo-600
                transition-colors
                dark:bg-indigo-950/60
                dark:text-indigo-300
              "
            >
              <Icon
                size={18}
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </div>

            {/* Label */}
            <p
              className="
                mt-3
                text-[11px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-500
                dark:text-slate-400
              "
            >
              {item.label}
            </p>

            {/* Value */}
            <p
              className="
                mt-1
                truncate
                text-base
                font-extrabold
                text-slate-900
                sm:text-lg
                dark:text-white
              "
              title={String(item.value)}
            >
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
