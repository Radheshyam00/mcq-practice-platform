import Link from "next/link";
import { subjects } from "@/data/subjects";

interface SubjectCardProps {
  slug: string;
}

export function SubjectCard({ slug }: SubjectCardProps) {
  const subject = subjects.find((item) => item.slug === slug);

  if (!subject) return null;

  return (
    <Link
      href={`/subjects/${slug}`}
      className="
        group relative block h-full overflow-hidden
        rounded-2xl border border-slate-200
        bg-white p-5
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-indigo-300
        hover:shadow-xl hover:shadow-indigo-100/60
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-indigo-500
        focus-visible:ring-offset-2
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-indigo-500/60
        dark:hover:shadow-indigo-950/30
        dark:focus-visible:ring-offset-slate-950
      "
    >
      {/* Top gradient accent */}
      <div
        aria-hidden="true"
        className="
          absolute inset-x-0 top-0 h-1
          bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500
          opacity-0 transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      <div className="flex h-full flex-col">
        {/* Icon */}
        <div
          className="
            flex h-14 w-14 shrink-0 items-center justify-center
            rounded-2xl
            border border-indigo-100
            bg-indigo-50
            text-2xl
            shadow-sm
            transition-transform duration-300
            group-hover:scale-105
            dark:border-indigo-900/50
            dark:bg-indigo-950/50
          "
        >
          <span aria-hidden="true">{subject.icon}</span>
        </div>

        {/* Content */}
        <div className="mt-5 min-w-0">
          <h3
            className="
              truncate text-lg font-extrabold tracking-tight
              text-slate-900
              transition-colors
              group-hover:text-indigo-600
              dark:text-white
              dark:group-hover:text-indigo-400
            "
          >
            {subject.name}
          </h3>

          <p
            className="
              mt-2 line-clamp-2
              text-sm leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            {subject.description}
          </p>
        </div>

        {/* Footer */}
        <div
          className="
            mt-auto flex items-center justify-between
            border-t border-slate-100
            pt-4
            dark:border-slate-800
          "
        >
          <span
            className="
              text-xs font-bold uppercase tracking-wider
              text-slate-400
              dark:text-slate-500
            "
          >
            Practice
          </span>

          <span
            aria-hidden="true"
            className="
              flex h-8 w-8 items-center justify-center
              rounded-full
              bg-slate-100
              text-slate-500
              transition-all duration-300
              group-hover:bg-indigo-600
              group-hover:text-white
              dark:bg-slate-800
              dark:text-slate-400
              dark:group-hover:bg-indigo-500
              dark:group-hover:text-white
            "
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}