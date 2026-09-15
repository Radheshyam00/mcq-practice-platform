"use client";
import { useCallback } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { useTimer } from "@/hooks/useTimer";
import { QuestionCard } from "./QuestionCard";
import { QuestionNumber } from "./QuestionNumber";
import { QuizProgress } from "./QuizProgress";
import { QuizTimer } from "./QuizTimer";
import { Explanation } from "./Explanation";
import { QuizResult } from "./QuizResult";
import { Button } from "@/components/common/Button";
import type { Question } from "@/types/question";

export function QuizContainer({ questions, durationMinutes = 30 }: { questions: Question[]; durationMinutes?: number }) {
  const quiz = useQuiz(questions);
  const finish = useCallback(() => quiz.submit(), [quiz]);
  const timer = useTimer(durationMinutes * 60, !quiz.submitted, finish);

  if (!questions.length) return <div className="rounded-2xl border p-8 text-center">No questions available.</div>;
  if (quiz.submitted) return <QuizResult result={quiz.result}/>;

  return <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
    <div>
      <div className="mb-5 flex items-center justify-between"><QuestionNumber number={quiz.currentIndex+1} total={questions.length}/><QuizTimer seconds={timer.seconds}/></div>
      <QuizProgress current={quiz.currentIndex} total={questions.length}/>
      <div className="mt-5"><QuestionCard question={quiz.current} selected={quiz.answers[quiz.current.id]} onSelect={quiz.choose}/></div>
      {quiz.answers[quiz.current.id] && <Explanation text={quiz.current.explanation}/>}
      <div className="mt-5 flex justify-between"><Button variant="outline" disabled={quiz.currentIndex===0} onClick={quiz.previous}>Previous</Button><div className="flex gap-2"><Button variant="outline" onClick={quiz.toggleMark}>{quiz.marked.includes(quiz.current.id) ? "Unmark" : "Mark"}</Button>{quiz.currentIndex===questions.length-1?<Button variant="danger" onClick={quiz.submit}>Submit</Button>:<Button onClick={quiz.next}>Next</Button>}</div></div>
    </div>
    <aside className="hidden lg:block"><div className="rounded-2xl border p-4 dark:border-slate-800"><h3 className="font-bold">Questions</h3><div className="mt-4 grid grid-cols-5 gap-2">{questions.map((q,i)=><button key={q.id} onClick={()=>quiz.goTo(i)} className={`rounded-lg border p-2 text-xs font-bold ${i===quiz.currentIndex?"bg-indigo-600 text-white":quiz.answers[q.id]?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950":""}`}>{i+1}</button>)}</div></div></aside>
  </div>;
}
