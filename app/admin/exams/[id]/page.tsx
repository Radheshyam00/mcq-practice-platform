"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  Edit3,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

type Subject = {
  _id: string;
  name: string;
  slug: string;
};

type Exam = {
  _id: string;
  name: string;
  slug: string;
  subjects: Subject[];
};

type Question = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subjectId: string;
};

export default function ManageExamQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [examId, setExamId] = useState("");

  const [exam, setExam] = useState<Exam | null>(
    null
  );

  const [questions, setQuestions] = useState<
    Question[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      setExamId(id);
    });
  }, [params]);

  useEffect(() => {
    if (!examId) return;

    async function load() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/admin/exams/${examId}/questions`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load"
          );
        }

        setExam(data.exam);
        setQuestions(data.questions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [examId]);

  function getSubjectName(subjectId: string) {
    return (
      exam?.subjects.find(
        (subject) => subject._id === subjectId
      )?.name || "Unknown Subject"
    );
  }

  async function deleteQuestion(id: string) {
    const confirmed = window.confirm(
      "Delete this question?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/questions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setQuestions((current) =>
        current.filter(
          (question) => question._id !== id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete question.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </main>
    );
  }

  if (!exam) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 dark:bg-slate-950">
        <p>Exam not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin/exams"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-800 dark:bg-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exams
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-2xl font-black">
                    {exam.name}
                  </h1>

                  <p className="text-sm text-slate-500">
                    /{exam.slug}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/admin/questions/new?examId=${exam._id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold text-slate-500">
              Total Questions
            </p>

            <p className="mt-2 text-3xl font-black">
              {questions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold text-slate-500">
              Subjects
            </p>

            <p className="mt-2 text-3xl font-black">
              {exam.subjects.length}
            </p>
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h2 className="text-lg font-black">
              Questions
            </h2>

            <p className="text-sm text-slate-500">
              Questions stored in MongoDB for this exam.
            </p>
          </div>

          {questions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-bold">
                No questions found.
              </p>

              <Link
                href={`/admin/questions/new?examId=${exam._id}`}
                className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                Add First Question
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {questions.map((question, index) => (
                <div
                  key={question._id}
                  className="p-5"
                >
                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-black dark:bg-slate-800">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {getSubjectName(
                            question.subjectId
                          )}
                        </span>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {question.difficulty}
                        </span>
                      </div>

                      <h3 className="mt-3 font-bold">
                        {question.question}
                      </h3>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {question.options.map(
                          (option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`rounded-lg border px-3 py-2 text-sm ${
                                optionIndex ===
                                question.correctAnswer
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                                  : "border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              <span className="mr-2 font-bold">
                                {String.fromCharCode(
                                  65 + optionIndex
                                )}
                                .
                              </span>

                              {option}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <Link
                        href={`/admin/questions/edit/${question._id}`}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          deleteQuestion(
                            question._id
                          )
                        }
                        className="rounded-lg p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}