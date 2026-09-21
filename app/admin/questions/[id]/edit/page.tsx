
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type Question = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  exam: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  negativeMarks: number;
};

export default function EditQuestionPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<Question>({
    _id: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    exam: "",
    subject: "",
    topic: "",
    difficulty: "Medium",
    marks: 1,
    negativeMarks: 0,
  });

  useEffect(() => {
    if (!id) return;

    async function loadQuestion() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/admin/questions/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load question");
        }

        const question = data.question || data;

        setForm({
          _id: question._id,
          question: question.question || "",
          options:
            Array.isArray(question.options) && question.options.length >= 2
              ? question.options
              : ["", "", "", ""],
          correctAnswer:
            typeof question.correctAnswer === "number"
              ? question.correctAnswer
              : 0,
          explanation: question.explanation || "",
          exam: question.exam || "",
          subject: question.subject || "",
          topic: question.topic || "",
          difficulty: question.difficulty || "Medium",
          marks: question.marks ?? 1,
          negativeMarks: question.negativeMarks ?? 0,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuestion();
  }, [id]);

  function updateField<K extends keyof Question>(
    field: K,
    value: Question[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateOption(index: number, value: string) {
    setForm((previous) => ({
      ...previous,
      options: previous.options.map((option, i) =>
        i === index ? value : option
      ),
    }));
  }

  function addOption() {
    setForm((previous) => ({
      ...previous,
      options: [...previous.options, ""],
    }));
  }

  function removeOption(index: number) {
    if (form.options.length <= 2) return;

    setForm((previous) => {
      const options = previous.options.filter((_, i) => i !== index);

      let correctAnswer = previous.correctAnswer;

      if (index === previous.correctAnswer) {
        correctAnswer = 0;
      } else if (index < previous.correctAnswer) {
        correctAnswer = previous.correctAnswer - 1;
      }

      return {
        ...previous,
        options,
        correctAnswer,
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.question.trim()) {
      setError("Please enter the question.");
      return;
    }

    if (form.options.some((option) => !option.trim())) {
      setError("Please fill all options.");
      return;
    }

    if (
      form.correctAnswer < 0 ||
      form.correctAnswer >= form.options.length
    ) {
      setError("Please select the correct answer.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/admin/questions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: form.question.trim(),
          options: form.options.map((option) => option.trim()),
          correctAnswer: form.correctAnswer,
          explanation: form.explanation.trim(),
          exam: form.exam.trim(),
          subject: form.subject.trim(),
          topic: form.topic.trim(),
          difficulty: form.difficulty,
          marks: Number(form.marks),
          negativeMarks: Number(form.negativeMarks),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update question");
      }

      setSuccess("Question updated successfully.");

      setTimeout(() => {
        router.push("/admin/questions");
        router.refresh();
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update question"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(`/api/admin/questions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete question");
      }

      router.push("/admin/questions");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete question"
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto flex max-w-5xl items-center justify-center py-32">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <Loader2 className="h-6 w-6 animate-spin" />
            Loading question...
          </div>
        </div>
      </main>
    );
  }

  if (error && !form._id) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/admin/questions"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Questions
          </Link>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/questions"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Questions
            </Link>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Edit Question
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update question content, answer, exam and difficulty.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            <Check className="h-4 w-4" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Question
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter the question text and answer choices.
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                Question Text
              </span>

              <textarea
                value={form.question}
                onChange={(e) =>
                  updateField("question", e.target.value)
                }
                rows={5}
                placeholder="Enter your question..."
                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>

            {/* Options */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Answer Options
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select the radio button for the correct answer.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addOption}
                  className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
                >
                  + Add Option
                </button>
              </div>

              <div className="space-y-3">
                {form.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 rounded-xl border p-3 transition ${
                      form.correctAnswer === index
                        ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20"
                        : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                    }`}
                  >
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={form.correctAnswer === index}
                      onChange={() =>
                        updateField("correctAnswer", index)
                      }
                      className="mt-3 h-4 w-4 accent-emerald-600"
                    />

                    <div className="flex-1">
                      <div className="mb-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                        Option {String.fromCharCode(65 + index)}
                      </div>

                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          updateOption(index, e.target.value)
                        }
                        placeholder={`Enter option ${String.fromCharCode(
                          65 + index
                        )}`}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    {form.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="mt-7 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        title="Remove option"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Explanation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Explanation
            </h2>

            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Optional explanation shown after the question is answered.
            </p>

            <textarea
              value={form.explanation}
              onChange={(e) =>
                updateField("explanation", e.target.value)
              }
              rows={4}
              placeholder="Explain why the selected answer is correct..."
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </section>

          {/* Metadata */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Question Details
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Categorize the question for exams and practice.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Exam"
                value={form.exam}
                onChange={(value) => updateField("exam", value)}
                placeholder="e.g. Computer Instructor"
              />

              <Field
                label="Subject"
                value={form.subject}
                onChange={(value) => updateField("subject", value)}
                placeholder="e.g. Computer Science"
              />

              <Field
                label="Topic"
                value={form.topic}
                onChange={(value) => updateField("topic", value)}
                placeholder="e.g. Operating System"
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Difficulty
                </label>

                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    updateField(
                      "difficulty",
                      e.target.value as Question["difficulty"]
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Marks
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={form.marks}
                  onChange={(e) =>
                    updateField("marks", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Negative Marks
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={form.negativeMarks}
                  onChange={(e) =>
                    updateField(
                      "negativeMarks",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/questions"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || deleting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </div>
  );
}

