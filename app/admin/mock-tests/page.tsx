"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ClipboardCheck,
  Edit3,
  FileQuestion,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

type Difficulty =
  | "Easy"
  | "Medium"
  | "Hard"
  | "Mixed";

type MockTest = {
  id: string;
  title: string;
  slug: string;
  description: string;
  examId: string;
  examName: string;
  examSlug: string;
  questions: number;
  duration: number;
  difficulty: Difficulty;
  isActive: boolean;
};

type Exam = {
  _id: string;
  name: string;
  slug: string;
};

type FormData = {
  title: string;
  slug: string;
  examId: string;
  description: string;
  questionCount: string;
  durationMinutes: string;
  difficulty: Difficulty;
  isActive: boolean;
};

const emptyForm: FormData = {
  title: "",
  slug: "",
  examId: "",
  description: "",
  questionCount: "50",
  durationMinutes: "60",
  difficulty: "Mixed",
  isActive: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminMockTestsPage() {
  const [mockTests, setMockTests] = useState<MockTest[]>(
    []
  );

  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<FormData>(emptyForm);

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [
        mockResponse,
        examResponse,
      ] = await Promise.all([
        fetch("/api/admin/mock-tests", {
          method: "GET",
          cache: "no-store",
        }),

        fetch("/api/admin/exams", {
          method: "GET",
          cache: "no-store",
        }),
      ]);

      const mockData =
        await mockResponse.json();

      const examData =
        await examResponse.json();

      console.log(
        "MOCK TEST API:",
        mockData
      );

      console.log(
        "EXAM API:",
        examData
      );

      // ----------------------------------------------
      // MOCK TEST API
      // ----------------------------------------------

      if (
        !mockResponse.ok ||
        !mockData.success
      ) {
        throw new Error(
          mockData.message ||
            "Failed to load mock tests."
        );
      }

      // ----------------------------------------------
      // EXAM API
      // ----------------------------------------------

      if (
        !examResponse.ok ||
        !examData.success
      ) {
        throw new Error(
          examData.message ||
            "Failed to load exams."
        );
      }

      // ----------------------------------------------
      // SET MOCK TESTS
      // ----------------------------------------------

      setMockTests(
        Array.isArray(mockData.mockTests)
          ? mockData.mockTests
          : []
      );

      // ----------------------------------------------
      // SET EXAMS
      // ----------------------------------------------

      const formattedExams: Exam[] =
        Array.isArray(examData.exams)
          ? examData.exams
              .map((exam: any) => ({
                _id: String(
                  exam._id ??
                    exam.id ??
                    ""
                ),

                name:
                  exam.name || "",

                slug:
                  exam.slug || "",
              }))
              .filter(
                (exam: Exam) =>
                  exam._id &&
                  exam.name
              )
          : [];

      setExams(formattedExams);
    } catch (err) {
      console.error(
        "LOAD MOCK TEST DATA ERROR:",
        err
      );

      setMockTests([]);
      setExams([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------
  // CREATE
  // --------------------------------------------------

  function openCreate() {
    setEditingId(null);

    setForm({
      ...emptyForm,

      // Automatically select first exam
      examId:
        exams.length > 0
          ? exams[0]._id
          : "",
    });

    setError("");
    setModalOpen(true);
  }

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function openEdit(
    mockTest: MockTest
  ) {
    setEditingId(mockTest.id);

    setForm({
      title: mockTest.title,

      slug: mockTest.slug,

      examId: mockTest.examId,

      description:
        mockTest.description || "",

      questionCount:
        String(mockTest.questions),

      durationMinutes:
        String(mockTest.duration),

      difficulty:
        mockTest.difficulty,

      isActive:
        mockTest.isActive,
    });

    setError("");
    setModalOpen(true);
  }

  // --------------------------------------------------
  // CLOSE MODAL
  // --------------------------------------------------

  function closeModal() {
    if (saving) return;

    setModalOpen(false);

    setEditingId(null);

    setForm({
      ...emptyForm,
      examId: "",
    });
  }

  // --------------------------------------------------
  // SAVE MOCK TEST
  // --------------------------------------------------

  async function saveMockTest(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      // --------------------------------------------
      // Validate title
      // --------------------------------------------

      if (!form.title.trim()) {
        throw new Error(
          "Mock test title is required."
        );
      }

      // --------------------------------------------
      // Validate exam
      // --------------------------------------------

      if (!form.examId) {
        throw new Error(
          "Please select an exam."
        );
      }

      // --------------------------------------------
      // Validate question count
      // --------------------------------------------

      const questionCount = Number(
        form.questionCount
      );

      if (
        !Number.isInteger(questionCount) ||
        questionCount < 1
      ) {
        throw new Error(
          "Question count must be at least 1."
        );
      }

      // --------------------------------------------
      // Validate duration
      // --------------------------------------------

      const durationMinutes = Number(
        form.durationMinutes
      );

      if (
        !Number.isInteger(
          durationMinutes
        ) ||
        durationMinutes < 1
      ) {
        throw new Error(
          "Duration must be at least 1 minute."
        );
      }

      // --------------------------------------------
      // Generate slug
      // --------------------------------------------

      const finalSlug =
        slugify(form.slug) ||
        slugify(form.title);

      // --------------------------------------------
      // Payload
      // --------------------------------------------

      const payload = {
        title: form.title.trim(),

        slug: finalSlug,

        examId: form.examId,

        description:
          form.description.trim(),

        questionCount,

        durationMinutes,

        difficulty:
          form.difficulty,

        isActive:
          form.isActive,
      };

      console.log(
        "SAVE MOCK TEST PAYLOAD:",
        payload
      );

      // --------------------------------------------
      // Request
      // --------------------------------------------

      const response = await fetch(
        editingId
          ? `/api/admin/mock-tests/${editingId}`
          : "/api/admin/mock-tests",
        {
          method: editingId
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await response.json();

      console.log(
        "SAVE MOCK TEST RESPONSE:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to save mock test."
        );
      }

      // --------------------------------------------
      // Close
      // --------------------------------------------

      setModalOpen(false);

      setEditingId(null);

      setForm({
        ...emptyForm,
        examId: "",
      });

      // --------------------------------------------
      // Reload
      // --------------------------------------------

      await loadData();
    } catch (err) {
      console.error(
        "SAVE MOCK TEST ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save mock test."
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function deleteMockTest(
    mockTest: MockTest
  ) {
    const confirmed =
      window.confirm(
        `Delete "${mockTest.title}"?`
      );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `/api/admin/mock-tests/${mockTest.id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete mock test."
        );
      }

      setMockTests((current) =>
        current.filter(
          (item) =>
            item.id !== mockTest.id
        )
      );
    } catch (err) {
      console.error(
        "DELETE MOCK TEST ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete mock test."
      );
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Top Navigation */}
        <div className="flex items-center justify-between">

          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />

            Admin Dashboard
          </Link>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>
        </div>

        {/* Main Section */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          {/* Header */}
          <div className="flex flex-col gap-5 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <ClipboardCheck className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-950 dark:text-white">
                  Mock Tests
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Create and manage mock test collections.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={openCreate}
              disabled={
                exams.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />

              Create Mock Test
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-5 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid gap-4 p-5 md:grid-cols-2">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
                  />
                )
              )}

            </div>
          ) : (
            <div className="grid gap-4 p-5 md:grid-cols-2">

              {mockTests.map(
                (test) => (
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
                          onClick={() =>
                            openEdit(
                              test
                            )
                          }
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                          aria-label="Edit mock test"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteMockTest(
                              test
                            )
                          }
                          className="rounded-lg p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                          aria-label="Delete mock test"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-3">

                      <div>

                        <h2 className="text-lg font-black text-slate-950 dark:text-white">
                          {test.title}
                        </h2>

                        <p className="mt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {test.examName}
                        </p>

                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                          test.isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {test.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    {test.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {test.description}
                      </p>
                    )}

                    <div className="mt-4 grid grid-cols-3 gap-2">

                      <Info
                        label="Questions"
                        value={String(
                          test.questions
                        )}
                      />

                      <Info
                        label="Minutes"
                        value={String(
                          test.duration
                        )}
                      />

                      <Info
                        label="Level"
                        value={
                          test.difficulty
                        }
                      />

                    </div>
                  </div>
                )
              )}

              {/* Empty */}
              {mockTests.length ===
                0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">

                  <ClipboardCheck className="mx-auto h-10 w-10 text-slate-400" />

                  <h2 className="mt-4 font-bold text-slate-900 dark:text-white">
                    No mock tests
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Create your first mock test.
                  </p>

                  <button
                    type="button"
                    onClick={openCreate}
                    disabled={
                      exams.length === 0
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />

                    Create Mock Test
                  </button>

                </div>
              )}

            </div>
          )}
        </section>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">

              <div>

                <h2 className="text-lg font-black text-slate-950 dark:text-white">
                  {editingId
                    ? "Edit Mock Test"
                    : "Create Mock Test"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Configure the mock test settings.
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

            {/* Form */}
            <form
              onSubmit={saveMockTest}
              className="space-y-5 p-5"
            >

              {/* Title / Slug */}
              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Mock Test Title"
                  value={form.title}
                  onChange={(value) =>
                    setForm(
                      (current) => ({
                        ...current,
                        title: value,
                      })
                    )
                  }
                  placeholder="DSSSB Computer Science Mock Test 1"
                  required
                />

                <Field
                  label="Slug"
                  value={form.slug}
                  onChange={(value) =>
                    setForm(
                      (current) => ({
                        ...current,
                        slug: value,
                      })
                    )
                  }
                  placeholder="dsssb-cs-mock-test-1"
                />

              </div>

              {/* Exam */}
              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Exam
                </label>

                <select
                  value={form.examId}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        examId:
                          event.target
                            .value,
                      })
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >

                  <option value="">
                    Select Exam
                  </option>

                  {exams.map(
                    (exam) => (
                      <option
                        key={exam._id}
                        value={exam._id}
                      >
                        {exam.name}
                      </option>
                    )
                  )}

                </select>

                {exams.length ===
                  0 && (
                  <p className="mt-2 text-xs text-red-500">
                    No exams available. Create an exam first.
                  </p>
                )}

              </div>

              {/* Description */}
              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        description:
                          event.target
                            .value,
                      })
                    )
                  }
                  rows={3}
                  placeholder="Describe this mock test..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />

              </div>

              {/* Settings */}
              <div className="grid gap-5 sm:grid-cols-3">

                <Field
                  label="Questions"
                  type="number"
                  min="1"
                  value={
                    form.questionCount
                  }
                  onChange={(value) =>
                    setForm(
                      (current) => ({
                        ...current,
                        questionCount:
                          value,
                      })
                    )
                  }
                  required
                />

                <Field
                  label="Minutes"
                  type="number"
                  min="1"
                  value={
                    form.durationMinutes
                  }
                  onChange={(value) =>
                    setForm(
                      (current) => ({
                        ...current,
                        durationMinutes:
                          value,
                      })
                    )
                  }
                  required
                />

                <div>

                  <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Difficulty
                  </label>

                  <select
                    value={
                      form.difficulty
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          difficulty:
                            event.target
                              .value as Difficulty,
                        })
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >

                    <option value="Mixed">
                      Mixed
                    </option>

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

              {/* Active */}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">

                <input
                  type="checkbox"
                  checked={
                    form.isActive
                  }
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        isActive:
                          event.target
                            .checked,
                      })
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />

                <span>

                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                    Active
                  </span>

                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Make this mock test available to users.
                  </span>

                </span>

              </label>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    exams.length === 0
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Mock Test"
                      : "Create Mock Test"}

                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </main>
  );
}

// --------------------------------------------------
// FIELD
// --------------------------------------------------

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  required?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        type={type}
        min={min}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
      />

    </div>
  );
}

// --------------------------------------------------
// INFO
// --------------------------------------------------

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

      <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}