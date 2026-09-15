
import type { Exam } from "@/types/exam";

interface ExamHeaderProps {
  exam: Exam;
}

export function ExamHeader({ exam }: ExamHeaderProps) {
  return (
    <section
      className={`
        relative
        isolate
        overflow-hidden
        bg-linear-to-r
        ${exam.color}
        text-white
      `}
    >
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-72
          w-72
          rounded-full
          bg-white/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-32
          left-1/3
          h-72
          w-72
          rounded-full
          bg-white/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-4
          py-10
          sm:px-6
          sm:py-12
          lg:px-8
          lg:py-14
        "
      >
        <div className="max-w-3xl">
          {/* Exam icon */}
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-white/20
              bg-white/15
              text-3xl
              shadow-lg
              shadow-black/10
              backdrop-blur-sm
              sm:h-20
              sm:w-20
              sm:text-4xl
            "
          >
            <span aria-hidden="true">{exam.icon}</span>
          </div>

          {/* Title */}
          <h1
            className="
              mt-5
              text-3xl
              font-black
              leading-tight
              tracking-tight
              sm:text-4xl
              lg:text-5xl
            "
          >
            {exam.name}
          </h1>

          {/* Description */}
          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-6
              text-white/85
              sm:text-base
              sm:leading-7
            "
          >
            {exam.description}
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-12
          bg-linear-to-t
          from-black/10
          to-transparent
        "
      />
    </section>
  );
}
