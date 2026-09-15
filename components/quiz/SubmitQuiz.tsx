
"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/common/Button";

type SubmitQuizProps = {
  onSubmit: () => void;
};

export function SubmitQuiz({ onSubmit }: SubmitQuizProps) {
  return (
    <Button
      variant="danger"
      onClick={onSubmit}
      className="
        inline-flex items-center justify-center
        gap-2
        rounded-xl
        px-4 py-2.5
        text-sm font-bold
        shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        focus-visible:ring-2
        focus-visible:ring-red-500
        focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-slate-950
      "
    >
      <Send
        className="h-4 w-4"
        strokeWidth={2.2}
        aria-hidden="true"
      />

      <span>Submit Quiz</span>
    </Button>
  );
}

