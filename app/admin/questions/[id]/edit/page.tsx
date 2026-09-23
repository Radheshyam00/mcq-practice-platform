
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

type Difficulty = "Easy" | "Medium" | "Hard";

type Subject = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

type Exam = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  subjects: Subject[];
  durationMinutes?: number;
  isActive?: boolean;
};

type Question = {
  _id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  examId: string;
  subjectId: string;
  exam?: string;
  subject?: string;
  topic: string;
  difficulty: Difficulty;
  isDailyQuiz: boolean;
  isActive: boolean;
};

type FormState = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  examId: string;
  subjectId: string;
  topic: string;
  difficulty: Difficulty;
  isDailyQuiz: boolean;
  isActive: boolean;
};

const emptyForm: FormState = {
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
  examId: "",
  subjectId: "",
  topic: "",
  difficulty: "Medium",
  isDailyQuiz: false,
  isActive: true,
};

export default function EditQuestionPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : (params?.id as string | undefined);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!id) {
      setError("Question ID is missing.");
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [questionResponse, examsResponse] = await Promise.all([
          fetch(`/api/admin/questions/${id}`, {
            method: "GET",
            cache: "no-store",
          }),
          fetch("/api/admin/exams", {
            method: "GET",
            cache: "no-store",
          }),
        ]);

        const questionData = await questionResponse.json();
        const examsData = await examsResponse.json();

        if (!questionResponse.ok) {
          throw new Error(
            questionData.message || "Failed to load question."
          );
        }

        if (!examsResponse.ok) {
          throw new Error(
            examsData.message || "Failed to load exams."
          );
        }

        const question = questionData.question || questionData;

        const loadedExams: Exam[] = Array.isArray(examsData)
          ? examsData
          : Array.isArray(examsData.exams)
            ? examsData.exams
            : [];

        setExams(loadedExams);

        const normalizedExamId = question.examId
          ? String(question.examId)
          : "";

        const selectedExam =
          loadedExams.find(
            (exam) => String(exam._id) === normalizedExamId
          ) ||
          loadedExams.find(
            (exam) =>
              question.exam &&
              exam.name.trim().toLowerCase() ===
                String(question.exam).trim().toLowerCase()
          );

        const resolvedExamId = selectedExam
          ? String(selectedExam._id)
          : normalizedExamId;

        const examSubjects = selectedExam?.subjects || [];

        setSubjects(examSubjects);

        const normalizedSubjectId = question.subjectId
          ? String(question.subjectId)
          : "";

        const selectedSubject =
          examSubjects.find(
            (subject) =>
              String(subject._id) === normalizedSubjectId
          ) ||
          examSubjects.find(
            (subject) =>
              question.subject &&
              subject.name.trim().toLowerCase() ===
                String(question.subject).trim().toLowerCase()
          );

        const resolvedSubjectId = selectedSubject
          ? String(selectedSubject._id)
          : normalizedSubjectId;

        const rawOptions = Array.isArray(question.options)
          ? question.options
          : [];

        const options: [string, string, string, string] = [
          String(rawOptions[0] ?? ""),
          String(rawOptions[1] ?? ""),
          String(rawOptions[2] ?? ""),
          String(rawOptions[3] ?? ""),
        ];

        let correctAnswer = Number(question.correctAnswer);

        if (
          !Number.isInteger(correctAnswer) ||
          correctAnswer < 0 ||
          correctAnswer > 3
        ) {
          correctAnswer = 0;
        }

        setForm({
          question: question.question || "",
          options,
          correctAnswer,
          explanation: question.explanation || "",
          examId: resolvedExamId,
          subjectId: resolvedSubjectId,
          topic: question.topic || "",
          difficulty:
            question.difficulty === "Easy" ||
            question.difficulty === "Hard"
              ? question.difficulty
              : "Medium",
          isDailyQuiz:
            typeof question.isDailyQuiz === "boolean"
              ? question.isDailyQuiz
              : false,
          isActive:
            typeof question.isActive === "boolean"
              ? question.isActive
              : true,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load question."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateOption(
    index: number,
    value: string
  ) {
    setForm((previous) => {
      const options = [...previous.options] as [
        string,
        string,
        string,
        string
      ];

      options[index] = value;

      return {
        ...previous,
        options,
      };
    });
  }

  function handleExamChange(examId: string) {
    const selectedExam = exams.find(
      (exam) => String(exam._id) === examId
    );

    const nextSubjects = selectedExam?.subjects || [];

    setSubjects(nextSubjects);

    setForm((previous) => ({
      ...previous,
      examId,
      subjectId: "",
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!id) {
      setError("Question ID is missing.");
      return;
    }

    if (!form.question.trim()) {
      setError("Please enter the question.");
      return;
    }

    if (form.options.length !== 4) {
      setError("A question must have exactly 4 options.");
      return;
    }

    if (form.options.some((option) => !option.trim())) {
      setError("Please fill all four options.");
      return;
    }

    if (
      !Number.isInteger(form.correctAnswer) ||
      form.correctAnswer < 0 ||
      form.correctAnswer > 3
    ) {
      setError(
        "Correct answer must be between A and D."
      );
      return;
    }

    if (!form.examId) {
      setError("Please select an exam.");
      return;
    }

    if (!form.subjectId) {
      setError("Please select a subject.");
      return;
    }

    if (!form.topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    const selectedExam = exams.find(
      (exam) => String(exam._id) === form.examId
    );

    if (!selectedExam) {
      setError("Selected exam was not found.");
      return;
    }

    const selectedSubject = selectedExam.subjects?.find(
      (subject) =>
        String(subject._id) === form.subjectId
    );

    if (!selectedSubject) {
      setError(
        "Selected subject does not belong to the selected exam."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/questions/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: form.question.trim(),

            options: form.options.map((option) =>
              option.trim()
            ),

            // Canonical mapping:
            // A = 0
            // B = 1
            // C = 2
            // D = 3
            correctAnswer: form.correctAnswer,

            explanation: form.explanation.trim(),

            examId: form.examId,
            subjectId: form.subjectId,

            // Legacy fields are intentionally also sent
            // for compatibility with older data.
            exam: selectedExam.name,
            subject: selectedSubject.name,

            topic: form.topic.trim(),
            difficulty: form.difficulty,

            isDailyQuiz: form.isDailyQuiz,
            isActive: form.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update question."
        );
      }

      setSuccess(
        "Question updated successfully."
      );

      setTimeout(() => {
        router.push("/admin/questions");
        router.refresh();
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update question."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this question? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/questions/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete question."
        );
      }

      router.push("/admin/questions");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete question."
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

  if (error && !form.question && !form.examId) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/admin/questions"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
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
              Update the question, answer, exam, subject,
              topic, and quiz settings.
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

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            <Check className="h-4 w-4" />
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Question */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Question
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter the question and exactly four answer
                choices.
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                Question Text
              </span>

              <textarea
                value={form.question}
                onChange={(event) =>
                  updateField(
                    "question",
                    event.target.value
                  )
                }
                rows={5}
                placeholder="Enter your question..."
                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>

            {/* Options */}
            <div className="mt-6">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Answer Options
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Exactly 4 options are required. Select
                  the radio button for the correct answer.
                </p>
              </div>

              <div className="space-y-3">
                {form.options.map(
                  (option, index) => (
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
                        checked={
                          form.correctAnswer === index
                        }
                        onChange={() =>
                          updateField(
                            "correctAnswer",
                            index
                          )
                        }
                        className="mt-3 h-4 w-4 accent-emerald-600"
                      />

                      <div className="flex-1">
                        <div className="mb-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                          Option{" "}
                          {String.fromCharCode(
                            65 + index
                          )}
                        </div>

                        <input
                          type="text"
                          value={option}
                          onChange={(event) =>
                            updateOption(
                              index,
                              event.target.value
                            )
                          }
                          placeholder={`Enter option ${String.fromCharCode(
                            65 + index
                          )}`}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-300">
                <strong>Answer mapping:</strong> A = 0,
                B = 1, C = 2, D = 3
              </div>
            </div>
          </section>

          {/* Explanation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Explanation
            </h2>

            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Optional explanation shown after the
              question is answered.
            </p>

            <textarea
              value={form.explanation}
              onChange={(event) =>
                updateField(
                  "explanation",
                  event.target.value
                )
              }
              rows={4}
              placeholder="Explain why the selected answer is correct..."
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </section>

          {/* Exam & Subject */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Exam & Subject
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select the MongoDB exam and its embedded
                subject.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Exam */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Exam
                </label>

                <select
                  value={form.examId}
                  onChange={(event) =>
                    handleExamChange(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">
                    Select exam
                  </option>

                  {exams.map((exam) => (
                    <option
                      key={exam._id}
                      value={exam._id}
                    >
                      {exam.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Subject
                </label>

                <select
                  value={form.subjectId}
                  onChange={(event) =>
                    updateField(
                      "subjectId",
                      event.target.value
                    )
                  }
                  disabled={!form.examId}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">
                    {form.examId
                      ? "Select subject"
                      : "Select exam first"}
                  </option>

                  {subjects.map((subject) => (
                    <option
                      key={subject._id}
                      value={subject._id}
                    >
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <Field
                label="Topic"
                value={form.topic}
                onChange={(value) =>
                  updateField("topic", value)
                }
                placeholder="e.g. Operating System"
              />

              {/* Difficulty */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Difficulty
                </label>

                <select
                  value={form.difficulty}
                  onChange={(event) =>
                    updateField(
                      "difficulty",
                      event.target
                        .value as Difficulty
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="Easy">
                    Easy
                  </option>
                  <option value="Medium">
                    Medium
                  </option>
                  <option value="Hard">
                    Hard
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* Settings */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Question Settings
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Control where this question appears.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Daily Quiz
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Include this question in daily quiz
                    questions.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.isDailyQuiz}
                  onChange={(event) =>
                    updateField(
                      "isDailyQuiz",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 rounded accent-indigo-600"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Active
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Active questions can be shown to
                    students.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField(
                      "isActive",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 rounded accent-indigo-600"
                />
              </label>
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
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </div>
  );
}

