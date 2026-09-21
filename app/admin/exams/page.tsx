"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  Check,
  Edit3,
  GraduationCap,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type Subject = {
  _id?: string;
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
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type ExamForm = {
  name: string;
  slug: string;
  description: string;
  subjects: Subject[];
  isActive: boolean;
};

const emptyForm: ExamForm = {
  name: "",
  slug: "",
  description: "",
  subjects: [],
  isActive: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingExam, setEditingExam] =
    useState<Exam | null>(null);

  const [form, setForm] = useState<ExamForm>(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadExams() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/exams", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      console.log("EXAMS API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load exams"
        );
      }

      /*
       * API response:
       *
       * {
       *   success: true,
       *   exams: [...]
       * }
       *
       * Older API versions may return the array directly,
       * so we support both formats.
       */
      const examList: Exam[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.exams)
          ? data.exams
          : [];

      setExams(examList);
    } catch (error) {
      console.error("Load exams error:", error);

      setExams([]);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load exams."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExams();
  }, []);

  function openAddModal() {
    setEditingExam(null);

    setForm({
      ...emptyForm,
      subjects: [],
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditModal(exam: Exam) {
    setEditingExam(exam);

    setForm({
      name: exam.name,
      slug: exam.slug,
      description: exam.description || "",
      subjects: exam.subjects || [],
      isActive: exam.isActive,
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingExam(null);

    setForm({
      ...emptyForm,
      subjects: [],
    });

    setError("");
  }

  function addSubject() {
    setForm((current) => ({
      ...current,
      subjects: [
        ...current.subjects,
        {
          name: "",
          slug: "",
          description: "",
        },
      ],
    }));
  }

  function removeSubject(index: number) {
    setForm((current) => ({
      ...current,
      subjects: current.subjects.filter(
        (_, i) => i !== index
      ),
    }));
  }

  function updateSubject(
    index: number,
    field: keyof Subject,
    value: string
  ) {
    setForm((current) => {
      const subjects = [...current.subjects];

      subjects[index] = {
        ...subjects[index],
        [field]: value,
      };

      /*
       * Automatically create a slug from subject name
       * if the slug hasn't been manually entered.
       */
      if (
        field === "name" &&
        !subjects[index].slug
      ) {
        subjects[index].slug = slugify(value);
      }

      return {
        ...current,
        subjects,
      };
    });
  }

  async function saveExam() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.name.trim()) {
        setError("Exam name is required.");
        return;
      }

      const finalSlug = slugify(
        form.slug || form.name
      );

      if (!finalSlug) {
        setError("A valid exam slug is required.");
        return;
      }

      const cleanedSubjects = form.subjects
        .filter((subject) => subject.name.trim())
        .map((subject) => ({
          name: subject.name.trim(),
          slug: slugify(
            subject.slug || subject.name
          ),
          description:
            subject.description?.trim() || "",
        }));

      /*
       * Check duplicate subject slugs on the client
       * before sending to the API.
       */
      const subjectSlugs = cleanedSubjects.map(
        (subject) => subject.slug
      );

      const duplicateSubjectSlug =
        subjectSlugs.find(
          (slug, index) =>
            subjectSlugs.indexOf(slug) !== index
        );

      if (duplicateSubjectSlug) {
        setError(
          `Duplicate subject slug: ${duplicateSubjectSlug}`
        );
        return;
      }

      const payload = {
        name: form.name.trim(),
        slug: finalSlug,
        description: form.description.trim(),
        subjects: cleanedSubjects,
        isActive: form.isActive,
      };

      const url = editingExam
        ? `/api/admin/exams/${editingExam._id}`
        : "/api/admin/exams";

      const method = editingExam ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("SAVE EXAM RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to save exam"
        );
      }

      setSuccess(
        editingExam
          ? "Exam updated successfully."
          : "Exam created successfully."
      );

      await loadExams();

      setTimeout(() => {
        closeModal();
      }, 500);
    } catch (error) {
      console.error("Save exam error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteExam(exam: Exam) {
    const confirmed = window.confirm(
      `Delete "${exam.name}"?\n\nThis will also delete ALL questions belonging to this exam. This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `/api/admin/exams/${exam._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to delete exam"
        );
      }

      setExams((current) =>
        current.filter(
          (item) => item._id !== exam._id
        )
      );

      setSuccess("Exam deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error("Delete exam error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete exam."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin Dashboard
        </Link>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            {success}
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black">
                  Manage Exams
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Create exams, manage subjects and
                  questions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Exam
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-60 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
            </div>
          ) : exams.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 text-lg font-black">
                No exams found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create your first exam to get started.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                Add Exam
              </button>
            </div>
          ) : (
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <BookOpen className="h-5 w-5" />
                    </div>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(exam)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        title="Edit exam"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteExam(exam)
                        }
                        className="rounded-lg p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Delete exam"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black">
                        {exam.name}
                      </h2>

                      {!exam.isActive && (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800">
                          Inactive
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      /{exam.slug}
                    </p>

                    {exam.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                        {exam.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Subjects
                      </p>

                      <p className="mt-1 text-lg font-black">
                        {exam.subjects?.length || 0}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Status
                      </p>

                      <p className="mt-1 text-sm font-black">
                        {exam.isActive
                          ? "Active"
                          : "Inactive"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/admin/exams/${exam._id}`}
                      className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-indigo-700"
                    >
                      Manage Questions
                    </Link>

                    <Link
                      href={`/exams/${exam.slug}`}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-black">
                  {editingExam
                    ? "Edit Exam"
                    : "Add Exam"}
                </h2>

                <p className="text-sm text-slate-500">
                  Configure exam details and subjects.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-5">
              {error && (
                <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-bold">
                    Exam Name
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                    placeholder="Computer Instructor"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold">
                    Slug
                  </label>

                  <input
                    value={form.slug}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        slug: event.target.value,
                      })
                    }
                    placeholder="computer-instructor"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-bold">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Exam description..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <div>
                  <p className="text-sm font-bold">
                    Exam Status
                  </p>

                  <p className="text-xs text-slate-500">
                    Allow users to access this exam.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      isActive: !form.isActive,
                    })
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    form.isActive
                      ? "bg-indigo-600"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      form.isActive
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black">
                      Subjects
                    </h3>

                    <p className="text-xs text-slate-500">
                      Add subjects belonging to this
                      exam.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addSubject}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Subject
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {form.subjects.map(
                    (subject, index) => (
                      <div
                        key={
                          subject._id ||
                          `subject-${index}`
                        }
                        className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                      >
                        <div className="flex gap-3">
                          <div className="grid flex-1 gap-3 sm:grid-cols-2">
                            <input
                              value={subject.name}
                              onChange={(event) =>
                                updateSubject(
                                  index,
                                  "name",
                                  event.target.value
                                )
                              }
                              placeholder="Subject name"
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                            />

                            <input
                              value={subject.slug}
                              onChange={(event) =>
                                updateSubject(
                                  index,
                                  "slug",
                                  event.target.value
                                )
                              }
                              placeholder="subject-slug"
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                            />

                            <input
                              value={
                                subject.description ||
                                ""
                              }
                              onChange={(event) =>
                                updateSubject(
                                  index,
                                  "description",
                                  event.target.value
                                )
                              }
                              placeholder="Subject description"
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 sm:col-span-2"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeSubject(index)
                            }
                            className="h-10 rounded-xl p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  )}

                  {form.subjects.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-500">
                        No subjects added yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold dark:border-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveExam}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {editingExam
                  ? "Update Exam"
                  : "Create Exam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}