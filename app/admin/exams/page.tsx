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
  AlertCircle,
  RefreshCw,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

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

type ApiResponse = {
  success?: boolean;
  message?: string;
  exams?: Exam[];
  exam?: Exam;
  details?: Array<{
    field?: string;
    message?: string;
  }>;
};

const emptyForm: ExamForm = {
  name: "",
  slug: "",
  description: "",
  subjects: [],
  isActive: true,
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSubject(
  subject: any
): Subject {
  return {
    _id: subject?._id
      ? String(subject._id)
      : undefined,

    name: clean(subject?.name),

    slug: clean(subject?.slug),

    description: clean(
      subject?.description
    ),
  };
}

function normalizeExam(
  exam: any
): Exam {
  return {
    _id: String(exam?._id ?? ""),

    name: clean(exam?.name),

    slug: clean(exam?.slug),

    description: clean(
      exam?.description
    ),

    durationMinutes:
      Number(exam?.durationMinutes) > 0
        ? Number(exam.durationMinutes)
        : 60,

    isActive:
      exam?.isActive !== false,

    subjects:
      Array.isArray(exam?.subjects)
        ? exam.subjects.map(
            normalizeSubject
          )
        : [],

    createdAt:
      exam?.createdAt,

    updatedAt:
      exam?.updatedAt,
  };
}

function getApiError(
  data: ApiResponse,
  fallback: string
): string {
  if (
    Array.isArray(data?.details) &&
    data.details.length > 0
  ) {
    const detailMessage =
      data.details
        .map((item) =>
          item.message
            ? String(item.message)
            : ""
        )
        .filter(Boolean)
        .join(" ");

    if (detailMessage) {
      return detailMessage;
    }
  }

  return (
    data?.message ||
    fallback
  );
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function AdminExamsPage() {
  const [exams, setExams] =
    useState<Exam[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingExam, setEditingExam] =
    useState<Exam | null>(null);

  const [form, setForm] =
    useState<ExamForm>(emptyForm);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Load exams
  |--------------------------------------------------------------------------
  */

  async function loadExams() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          "/api/admin/exams",
          {
            method: "GET",
            cache: "no-store",
          }
        );

      let data: ApiResponse;

      try {
        data =
          await response.json();
      } catch {
        throw new Error(
          "Invalid response from server."
        );
      }

      console.log(
        "EXAMS API RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          getApiError(
            data,
            "Failed to load exams."
          )
        );
      }

      if (data.success === false) {
        throw new Error(
          getApiError(
            data,
            "Failed to load exams."
          )
        );
      }

      const examList =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.exams)
            ? data.exams
            : [];

      setExams(
        examList.map(normalizeExam)
      );
    } catch (error) {
      console.error(
        "Load exams error:",
        error
      );

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

  /*
  |--------------------------------------------------------------------------
  | Modal
  |--------------------------------------------------------------------------
  */

  function openAddModal() {
    setEditingExam(null);

    setForm({
      name: "",
      slug: "",
      description: "",
      subjects: [],
      isActive: true,
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditModal(
    exam: Exam
  ) {
    setEditingExam(exam);

    /*
     * IMPORTANT:
     *
     * Preserve every subject _id.
     *
     * Questions use:
     *
     * question.examId    -> exam._id
     * question.subjectId -> exam.subjects._id
     *
     * Losing the subject _id while editing can
     * orphan existing questions.
     */
    setForm({
      name: exam.name,

      slug: exam.slug,

      description:
        exam.description || "",

      subjects:
        Array.isArray(exam.subjects)
          ? exam.subjects.map(
              normalizeSubject
            )
          : [],

      isActive:
        exam.isActive !== false,
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
      name: "",
      slug: "",
      description: "",
      subjects: [],
      isActive: true,
    });

    setError("");
    setSuccess("");
  }

  /*
  |--------------------------------------------------------------------------
  | Subjects
  |--------------------------------------------------------------------------
  */

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

  function removeSubject(
    index: number
  ) {
    setForm((current) => ({
      ...current,

      subjects:
        current.subjects.filter(
          (_, i) =>
            i !== index
        ),
    }));
  }

  function updateSubject(
    index: number,
    field: keyof Subject,
    value: string
  ) {
    setForm((current) => {
      const subjects =
        [...current.subjects];

      const previous =
        subjects[index];

      if (!previous) {
        return current;
      }

      subjects[index] = {
        ...previous,
        [field]: value,
      };

      /*
       * Generate slug when:
       *
       * - adding a new subject
       * - the slug is currently empty
       *
       * Existing subject slugs are not silently
       * overwritten because changing a subject slug
       * may affect public URLs.
       */
      if (
        field === "name" &&
        !previous.slug
      ) {
        subjects[index].slug =
          slugify(value);
      }

      return {
        ...current,
        subjects,
      };
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Save exam
  |--------------------------------------------------------------------------
  */

  async function saveExam() {
    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      /*
      |--------------------------------------------------------------------------
      | Validate exam name
      |--------------------------------------------------------------------------
      */

      const finalName =
        clean(form.name);

      if (!finalName) {
        setError(
          "Exam name is required."
        );
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Validate exam slug
      |--------------------------------------------------------------------------
      */

      const finalSlug =
        slugify(
          form.slug ||
            finalName
        );

      if (!finalSlug) {
        setError(
          "A valid exam slug is required."
        );
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Validate subjects
      |--------------------------------------------------------------------------
      */

      const cleanedSubjects: Subject[] =
        [];

      for (
        let index = 0;
        index < form.subjects.length;
        index++
      ) {
        const subject =
          form.subjects[index];

        const subjectName =
          clean(subject.name);

        /*
         * Do not silently ignore a subject row
         * with an empty name.
         */
        if (!subjectName) {
          setError(
            `Subject ${
              index + 1
            } must have a name.`
          );
          return;
        }

        const subjectSlug =
          slugify(
            subject.slug ||
              subjectName
          );

        if (!subjectSlug) {
          setError(
            `Subject ${
              index + 1
            } must have a valid slug.`
          );
          return;
        }

        cleanedSubjects.push({
          /*
           * CRITICAL:
           *
           * Preserve existing _id when editing.
           */
          ...(subject._id
            ? {
                _id: subject._id,
              }
            : {}),

          name: subjectName,

          slug: subjectSlug,

          description:
            clean(
              subject.description
            ),
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Duplicate subject slug
      |--------------------------------------------------------------------------
      */

      const subjectSlugs =
        cleanedSubjects.map(
          (subject) =>
            subject.slug
        );

      const duplicateSubjectSlug =
        subjectSlugs.find(
          (slug, index) =>
            subjectSlugs.indexOf(
              slug
            ) !== index
        );

      if (duplicateSubjectSlug) {
        setError(
          `Duplicate subject slug: ${duplicateSubjectSlug}`
        );
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Duplicate subject names
      |--------------------------------------------------------------------------
      */

      const subjectNames =
        cleanedSubjects.map(
          (subject) =>
            subject.name.toLowerCase()
        );

      const duplicateSubjectName =
        subjectNames.find(
          (name, index) =>
            subjectNames.indexOf(
              name
            ) !== index
        );

      if (duplicateSubjectName) {
        setError(
          `Duplicate subject name: ${duplicateSubjectName}`
        );
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Prepare payload
      |--------------------------------------------------------------------------
      */

      const payload = {
        name: finalName,

        slug: finalSlug,

        description:
          clean(
            form.description
          ),

        /*
         * _id is intentionally included for existing
         * subjects so the API can preserve the same
         * MongoDB embedded subject ID.
         */
        subjects:
          cleanedSubjects,

        isActive:
          form.isActive,
      };

      /*
      |--------------------------------------------------------------------------
      | API URL
      |--------------------------------------------------------------------------
      */

      const url = editingExam
        ? `/api/admin/exams/${encodeURIComponent(
            editingExam._id
          )}`
        : "/api/admin/exams";

      const method =
        editingExam
          ? "PUT"
          : "POST";

      /*
      |--------------------------------------------------------------------------
      | Save
      |--------------------------------------------------------------------------
      */

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        });

      let data: ApiResponse;

      try {
        data =
          await response.json();
      } catch {
        throw new Error(
          "Invalid response from server."
        );
      }

      console.log(
        "SAVE EXAM RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          getApiError(
            data,
            "Failed to save exam."
          )
        );
      }

      if (data.success === false) {
        throw new Error(
          getApiError(
            data,
            "Failed to save exam."
          )
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Success
      |--------------------------------------------------------------------------
      */

      setSuccess(
        editingExam
          ? "Exam updated successfully."
          : "Exam created successfully."
      );

      /*
      |--------------------------------------------------------------------------
      | Reload list
      |--------------------------------------------------------------------------
      */

      await loadExams();

      /*
      |--------------------------------------------------------------------------
      | Close modal
      |--------------------------------------------------------------------------
      */

      window.setTimeout(() => {
        setModalOpen(false);
        setEditingExam(null);

        setForm({
          name: "",
          slug: "",
          description: "",
          subjects: [],
          isActive: true,
        });

        setSuccess("");
      }, 500);
    } catch (error) {
      console.error(
        "Save exam error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete exam
  |--------------------------------------------------------------------------
  */

  async function deleteExam(
    exam: Exam
  ) {
    if (deletingId) return;

    const confirmed =
      window.confirm(
        `Delete "${exam.name}"?\n\nThis will also delete ALL questions belonging to this exam.\n\nThis action cannot be undone.`
      );

    if (!confirmed) return;

    try {
      setDeletingId(
        exam._id
      );

      setError("");
      setSuccess("");

      const response =
        await fetch(
          `/api/admin/exams/${encodeURIComponent(
            exam._id
          )}`,
          {
            method: "DELETE",
          }
        );

      let data: ApiResponse;

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          getApiError(
            data,
            "Failed to delete exam."
          )
        );
      }

      if (data.success === false) {
        throw new Error(
          getApiError(
            data,
            "Failed to delete exam."
          )
        );
      }

      setExams(
        (current) =>
          current.filter(
            (item) =>
              item._id !==
              exam._id
          )
      );

      setSuccess(
        "Exam deleted successfully."
      );

      window.setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error(
        "Delete exam error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete exam."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin Dashboard
        </Link>

        {/* Global error */}
        {error && !modalOpen && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* Global success */}
        {success && !modalOpen && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Check className="h-4 w-4" />

            {success}
          </div>
        )}

        {/* Main card */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="flex flex-col gap-5 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  Manage Exams
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Create exams, manage subjects and questions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                openAddModal
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Exam
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex min-h-60 flex-col items-center justify-center gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />

              <p className="text-sm font-semibold text-slate-500">
                Loading exams...
              </p>
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
                onClick={
                  openAddModal
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Exam
              </button>
            </div>
          ) : (
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map(
                (exam) => (
                  <div
                    key={
                      exam._id
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                  >
                    {/* Card top */}
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <BookOpen className="h-5 w-5" />
                      </div>

                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              exam
                            )
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                          title="Edit exam"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            exam._id
                          }
                          onClick={() =>
                            deleteExam(
                              exam
                            )
                          }
                          className="rounded-lg p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30"
                          title="Delete exam"
                        >
                          {deletingId ===
                          exam._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Card title */}
                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <h2 className="line-clamp-1 text-lg font-black text-slate-900 dark:text-white">
                          {exam.name}
                        </h2>

                        {!exam.isActive && (
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800">
                            Inactive
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        /{exam.slug}
                      </p>

                      {exam.description && (
                        <p className="mt-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                          {
                            exam.description
                          }
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                        <p className="text-[11px] font-semibold text-slate-500">
                          Subjects
                        </p>

                        <p className="mt-1 text-lg font-black">
                          {
                            exam
                              .subjects
                              ?.length ||
                            0
                          }
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

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/admin/exams/${exam._id}`}
                        className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-indigo-700"
                      >
                        Manage Questions
                      </Link>

                      <Link
                        href={`/exams/${exam.slug}`}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>

      {/* ================================================================== */}
      {/* MODAL                                                              */}
      {/* ================================================================== */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {editingExam
                    ? "Edit Exam"
                    : "Add Exam"}
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Configure exam details and subjects.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={saving}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-5">
              {error && (
                <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <Check className="h-4 w-4" />

                  {success}
                </div>
              )}

              {/* Exam details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-slate-900 dark:text-white">
                    Exam Name
                  </label>

                  <input
                    value={
                      form.name
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          name: event
                            .target
                            .value,
                        })
                      )
                    }
                    placeholder="Computer Instructor"
                    disabled={
                      saving
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-900 dark:text-white">
                    Slug
                  </label>

                  <input
                    value={
                      form.slug
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          slug: event
                            .target
                            .value,
                        })
                      )
                    }
                    placeholder="computer-instructor"
                    disabled={
                      saving
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="text-sm font-bold text-slate-900 dark:text-white">
                  Description
                </label>

                <textarea
                  value={
                    form.description
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,
                        description:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  rows={3}
                  disabled={
                    saving
                  }
                  placeholder="Exam description..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Status */}
              <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Exam Status
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Allow users to access this exam.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    saving
                  }
                  onClick={() =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,
                        isActive:
                          !current.isActive,
                      })
                    )
                  }
                  aria-label="Toggle exam status"
                  className={`relative h-7 w-12 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    form.isActive
                      ? "bg-indigo-600"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      form.isActive
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Subjects */}
              <div className="mt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white">
                      Subjects
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Add subjects belonging to this exam.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      addSubject
                    }
                    disabled={
                      saving
                    }
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add Subject
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {form.subjects.map(
                    (
                      subject,
                      index
                    ) => (
                      <div
                        key={
                          subject._id ||
                          `subject-${index}`
                        }
                        className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                      >
                        <div className="flex gap-3">
                          <div className="grid flex-1 gap-3 sm:grid-cols-2">
                            {/* Subject name */}
                            <div>
                              <label className="mb-1 block text-xs font-bold text-slate-500">
                                Subject Name
                              </label>

                              <input
                                value={
                                  subject.name
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateSubject(
                                    index,
                                    "name",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                disabled={
                                  saving
                                }
                                placeholder="Cyber Forensics"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                              />
                            </div>

                            {/* Subject slug */}
                            <div>
                              <label className="mb-1 block text-xs font-bold text-slate-500">
                                Subject Slug
                              </label>

                              <input
                                value={
                                  subject.slug
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateSubject(
                                    index,
                                    "slug",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                disabled={
                                  saving
                                }
                                placeholder="cyber-forensics"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                              />
                            </div>

                            {/* Description */}
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-xs font-bold text-slate-500">
                                Description
                              </label>

                              <input
                                value={
                                  subject.description ||
                                  ""
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateSubject(
                                    index,
                                    "description",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                disabled={
                                  saving
                                }
                                placeholder="Subject description"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                              />
                            </div>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            disabled={
                              saving
                            }
                            onClick={() =>
                              removeSubject(
                                index
                              )
                            }
                            title="Remove subject"
                            className="h-10 shrink-0 rounded-xl p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Existing subject indicator */}
                        {subject._id && (
                          <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                            <Check className="h-3 w-3" />
                            Existing subject — ID preserved
                          </div>
                        )}
                      </div>
                    )
                  )}

                  {form.subjects.length ===
                    0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                      <BookOpen className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600" />

                      <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                        No subjects added yet.
                      </p>

                      <button
                        type="button"
                        onClick={
                          addSubject
                        }
                        disabled={
                          saving
                        }
                        className="mt-3 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        + Add your first subject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  saving
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  saveExam
                }
                disabled={
                  saving
                }
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingExam ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}

                {saving
                  ? editingExam
                    ? "Updating..."
                    : "Creating..."
                  : editingExam
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