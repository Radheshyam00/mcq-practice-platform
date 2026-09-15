
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, FileQuestion } from "lucide-react";

type Exam = {
  id?: string;
  slug?: string;
  name?: string;
  title?: string;
  description?: string;
  questions?: number;
  questionCount?: number;
  duration?: number;
  durationMinutes?: number;
  category?: string;
  color?: string;
};

type ExamGridProps = {
  exams: Exam[];
};

export function ExamGrid({ exams }: ExamGridProps) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
        xl:grid-cols-3
      "
    >
      {exams.map((exam, index) => {
        const title = exam.name || exam.title || "Practice Exam";

        const questionCount =
          exam.questions ?? exam.questionCount ?? 0;

        const duration =
          exam.duration ?? exam.durationMinutes ?? 0;

        const slug = exam.slug || exam.id || String(index);

        return (
          <article
            key={exam.id || exam.slug || index}
            className="
              group
              relative
              flex
              min-h-67.5
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-indigo-300
              hover:shadow-xl
              hover:shadow-indigo-100/60
              dark:border-slate-800
              dark:bg-slate-900
              dark:hover:border-indigo-500/50
              dark:hover:shadow-indigo-950/30
            "
          >
            {/* Top accent */}
            <div
              className="
                h-1
                w-full
                bg-linear-to-r
                from-indigo-500
                via-violet-500
                to-indigo-500
              "
            />

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              {/* Icon + Category */}
              <div className="flex items-start justify-between gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-50
                    text-indigo-600
                    ring-1
                    ring-inset
                    ring-indigo-100
                    transition-transform
                    duration-300
                    group-hover:scale-105
                    dark:bg-indigo-950/60
                    dark:text-indigo-300
                    dark:ring-indigo-500/20
                  "
                >
                  <BookOpen
                    size={23}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-slate-200
                    bg-slate-50
                    px-2.5
                    py-1
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-600
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-slate-300
                  "
                >
                  {exam.category || "Practice"}
                </span>
              </div>

              {/* Title */}
              <h3
                className="
                  mt-5
                  line-clamp-2
                  text-lg
                  font-extrabold
                  leading-7
                  text-slate-900
                  transition-colors
                  group-hover:text-indigo-700
                  dark:text-white
                  dark:group-hover:text-indigo-300
                "
              >
                {title}
              </h3>

              {/* Description */}
              <p
                className="
                  mt-2
                  line-clamp-2
                  min-h-12
                  text-sm
                  leading-6
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {exam.description ||
                  "Practice important multiple-choice questions and improve your exam preparation."}
              </p>

              {/* Stats */}
              <div
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2.5
                    dark:border-slate-800
                    dark:bg-slate-950/70
                  "
                >
                  <FileQuestion
                    size={16}
                    className="shrink-0 text-indigo-500"
                    aria-hidden="true"
                  />

                  <div className="min-w-0">
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                      "
                    >
                      Questions
                    </p>

                    <p
                      className="
                        text-sm
                        font-bold
                        text-slate-800
                        dark:text-slate-200
                      "
                    >
                      {questionCount || "MCQs"}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2.5
                    dark:border-slate-800
                    dark:bg-slate-950/70
                  "
                >
                  <Clock3
                    size={16}
                    className="shrink-0 text-violet-500"
                    aria-hidden="true"
                  />

                  <div className="min-w-0">
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                      "
                    >
                      Duration
                    </p>

                    <p
                      className="
                        text-sm
                        font-bold
                        text-slate-800
                        dark:text-slate-200
                      "
                    >
                      {duration ? `${duration} min` : "Practice"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Button */}
              <Link
                href={`/exams/${slug}`}
                className="
                  mt-5
                  inline-flex
                  min-h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-indigo-600
                  px-4
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  shadow-indigo-200
                  transition-all
                  duration-200
                  hover:bg-indigo-700
                  hover:shadow-md
                  hover:shadow-indigo-300/50
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-indigo-500
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-white
                  active:scale-[0.99]
                  dark:bg-indigo-500
                  dark:hover:bg-indigo-400
                  dark:shadow-none
                  dark:focus-visible:ring-offset-slate-900
                "
              >
                <span>Start Practice</span>

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
          </article>
        );
      })}
    </div>
  );
}
