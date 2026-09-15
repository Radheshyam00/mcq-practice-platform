
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Edit3,
  GraduationCap,
  Plus,
  Trash2,
} from "lucide-react";

import { exams } from "@/data/exams";

export default function AdminExamsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin Dashboard
        </Link>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black">Exams</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage exams and their subjects.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Exam
            </button>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <div
                key={exam.slug}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      className="rounded-lg p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h2 className="mt-5 text-lg font-black">{exam.name}</h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  /{exam.slug}
                </p>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                  <span className="text-xs font-semibold text-slate-500">
                    Subjects
                  </span>

                  <span className="font-black">
                    {exam.subjects.length}
                  </span>
                </div>

                <Link
                  href={`/exams/${exam.slug}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  View Exam
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

