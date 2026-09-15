
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardCheck,
  Edit3,
  FileQuestion,
  Plus,
  Trash2,
} from "lucide-react";

import { mockTests } from "@/data/mockTests";

export default function AdminMockTestsPage() {
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
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <ClipboardCheck className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black">Mock Tests</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage mock test collections.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create Mock Test
            </button>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">
            {mockTests.map((test) => (
              <div
                key={test.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <FileQuestion className="h-5 w-5" />
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

                <h2 className="mt-4 text-lg font-black">{test.title}</h2>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Info label="Questions" value={String(test.questions)} />
                  <Info label="Minutes" value={String(test.durationMinutes)} />
                  <Info label="Level" value={test.difficulty} />
                </div>
              </div>
            ))}

            {mockTests.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
                <ClipboardCheck className="mx-auto h-10 w-10 text-slate-400" />
                <h2 className="mt-4 font-bold">No mock tests</h2>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
      <p className="text-[10px] font-bold uppercase text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

