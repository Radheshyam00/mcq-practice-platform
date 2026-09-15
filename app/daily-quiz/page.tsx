import { questions } from "@/data/questions";
import { QuizContainer } from "@/components/quiz/QuizContainer";
export default function DailyQuizPage(){return <div className="mx-auto max-w-6xl px-4 py-12"><div className="mb-8"><div className="text-sm font-bold text-indigo-600">EVERY DAY</div><h1 className="mt-1 text-4xl font-black">Daily Quiz</h1><p className="mt-2 text-slate-500">A quick mixed quiz to keep your preparation consistent.</p></div><QuizContainer questions={questions.slice(0,5)} durationMinutes={10}/></div>;}
