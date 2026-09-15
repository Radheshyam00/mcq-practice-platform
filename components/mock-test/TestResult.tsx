import type { QuizResult } from "@/types/result";
export function TestResult({ result }: { result: QuizResult }) { return <div className="rounded-2xl border p-8 text-center dark:border-slate-800"><div className="text-4xl font-black text-indigo-600">{result.percentage}%</div><p className="mt-2 text-slate-500">{result.correct}/{result.total} correct</p></div>; }
