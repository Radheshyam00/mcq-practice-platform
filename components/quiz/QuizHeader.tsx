import Link from "next/link";
export function QuizHeader({ title }: { title: string }) { return <div className="flex items-center justify-between border-b py-4"><Link href="/" className="font-black"><span className="text-indigo-600">MCQ</span> Practice</Link><div className="text-sm font-bold">{title}</div></div>; }
