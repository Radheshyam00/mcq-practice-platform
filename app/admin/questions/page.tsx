
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  FileQuestion,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { questions } from "@/data/questions";

export default function AdminQuestionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin Dashboard
        </Link>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <FileQuestion className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black">Questions</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage your MCQ question bank.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
          </div>

          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                placeholder="Search questions..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {questions.length > 0 ? (
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-slate-50 dark:bg-slate-950">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                      Question
                    </th>
                    <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                      Difficulty
                    </th>
                    <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                      Tags
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {questions.map((question) => (
                    <tr
                      key={question.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-950/60"
                    >
                      <td className="max-w-xl px-5 py-4">
                        <p className="line-clamp-2 text-sm font-semibold">
                          {question.question}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          ID: {question.id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {question.difficulty}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex max-w-xs flex-wrap gap-1.5">
                          {question.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                            aria-label="Edit question"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                            aria-label="Delete question"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <FileQuestion className="mx-auto h-10 w-10 text-slate-400" />
                <h2 className="mt-4 font-bold">No questions found</h2>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

