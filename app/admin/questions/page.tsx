"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  FileQuestion,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";

type Question = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  topic: string;
  exam: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isDailyQuiz: boolean;
  isActive: boolean;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadQuestions() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/questions?search=${encodeURIComponent(search)}`
      );

      const data = await response.json();

      if (response.ok) {
        setQuestions(data.questions || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  async function deleteQuestion(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) return;

    const response = await fetch(`/api/admin/questions/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setQuestions((current) =>
        current.filter((question) => question._id !== id)
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/admin/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>

            <h1 className="text-3xl font-black tracking-tight">
              Question Bank
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add, edit, delete and organize your MCQ questions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/questions/import"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <Upload className="h-4 w-4" />
              Import
            </Link>

            <Link
              href="/admin/questions/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    loadQuestions();
                  }
                }}
                placeholder="Search questions..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <button
              onClick={loadQuestions}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                <tr>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Question
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Subject
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Exam
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Difficulty
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Daily
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      Loading questions...
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center"
                    >
                      <FileQuestion className="mx-auto h-10 w-10 text-slate-300" />

                      <p className="mt-3 font-bold">
                        No questions found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Add your first question to the question bank.
                      </p>
                    </td>
                  </tr>
                ) : (
                  questions.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-950"
                    >
                      <td className="max-w-md px-5 py-4">
                        <p className="line-clamp-2 text-sm font-bold">
                          {item.question}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {item.topic}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {item.subject}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {item.exam}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold dark:bg-slate-800">
                          {item.difficulty}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {item.isDailyQuiz ? (
                          <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/questions/${item._id}/edit`}
                            className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() =>
                              deleteQuestion(item._id)
                            }
                            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}