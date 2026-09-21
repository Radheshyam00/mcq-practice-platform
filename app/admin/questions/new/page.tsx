"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Loader2,
  Save,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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
  durationMinutes: number;
  isActive: boolean;
};

const initialOptions = ["", "", "", ""];

export default function NewQuestionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const examIdFromUrl = searchParams.get("examId");

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");

  const [exams, setExams] = useState<Exam[]>([]);
  const [examData, setExamData] = useState<Exam | null>(null);

  const [selectedExamId, setSelectedExamId] = useState(
    examIdFromUrl || ""
  );

  const [selectedSubjectId, setSelectedSubjectId] =
    useState("");

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] =
    useState<"Easy" | "Medium" | "Hard">("Medium");

  const [isDailyQuiz, setIsDailyQuiz] = useState(false);

  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingExam, setLoadingExam] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load all exams
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadExams() {
      try {
        setLoadingExams(true);
        setError("");

        const response = await fetch(
          "/api/admin/exams"
        );

        const data = await response.json();

        console.log("EXAMS API RESPONSE:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load exams."
          );
        }

        const examList = Array.isArray(data)
          ? data
          : Array.isArray(data.exams)
          ? data.exams
          : [];

        setExams(examList);

        /*
         * If examId exists in URL, load that exam.
         */
        if (examIdFromUrl) {
          setSelectedExamId(examIdFromUrl);
        }
      } catch (err) {
        console.error("LOAD EXAMS ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load exams."
        );
      } finally {
        setLoadingExams(false);
      }
    }

    loadExams();
  }, [examIdFromUrl]);

  /*
  |--------------------------------------------------------------------------
  | Load selected exam
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!selectedExamId) {
      setExamData(null);
      setSelectedSubjectId("");
      return;
    }

    async function loadExam() {
      try {
        setLoadingExam(true);
        setError("");

        const response = await fetch(
          `/api/admin/exams/${selectedExamId}`
        );

        const data = await response.json();

        console.log("SELECTED EXAM API RESPONSE:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load exam."
          );
        }

        const exam: Exam | null =
          data.exam || data;

        if (!exam || !exam._id) {
          console.error(
            "Invalid exam response:",
            data
          );

          throw new Error(
            "Invalid exam data returned."
          );
        }

        const formattedExam: Exam = {
          _id: exam._id.toString(),
          name: exam.name,
          slug: exam.slug,
          description: exam.description || "",

          subjects: Array.isArray(exam.subjects)
            ? exam.subjects.map((subject: any) => ({
                _id: subject._id.toString(),
                name: subject.name,
                slug: subject.slug,
                description:
                  subject.description || "",
              }))
            : [],

          durationMinutes:
            exam.durationMinutes || 60,

          isActive:
            exam.isActive !== false,
        };

        setExamData(formattedExam);

        /*
         * Preserve currently selected subject
         * if it exists in the new exam.
         */
        const existingSubject =
          formattedExam.subjects.find(
            (subject) =>
              subject._id === selectedSubjectId
          );

        if (!existingSubject) {
          setSelectedSubjectId(
            formattedExam.subjects.length > 0
              ? formattedExam.subjects[0]._id
              : ""
          );
        }
      } catch (err) {
        console.error("LOAD EXAM ERROR:", err);

        setExamData(null);
        setSelectedSubjectId("");

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load exam."
        );
      } finally {
        setLoadingExam(false);
      }
    }

    loadExam();
  }, [selectedExamId]);

  /*
  |--------------------------------------------------------------------------
  | Update option
  |--------------------------------------------------------------------------
  */

  function updateOption(
    index: number,
    value: string
  ) {
    setOptions((current) => {
      const updated = [...current];
      updated[index] = value;
      return updated;
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Exam selection
  |--------------------------------------------------------------------------
  */

  function handleExamChange(
    value: string
  ) {
    setSelectedExamId(value);
    setSelectedSubjectId("");
    setError("");
    setSuccess("");

    /*
     * Update URL so refreshing the page keeps
     * the selected exam.
     */
    if (value) {
      router.replace(
        `/admin/questions/new?examId=${value}`
      );
    } else {
      router.replace(
        "/admin/questions/new"
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!question.trim()) {
      setError("Question is required.");
      return;
    }

    if (
      options.some(
        (option) => !option.trim()
      )
    ) {
      setError(
        "All 4 options are required."
      );
      return;
    }

    if (!selectedExamId) {
      setError("Please select an exam.");
      return;
    }

    if (!selectedSubjectId) {
      setError("Please select a subject.");
      return;
    }

    if (!topic.trim()) {
      setError("Topic is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        question: question.trim(),

        options: options.map((option) =>
          option.trim()
        ),

        correctAnswer:
          Number(correctAnswer),

        explanation:
          explanation.trim(),

        examId:
          selectedExamId,

        subjectId:
          selectedSubjectId,

        topic:
          topic.trim(),

        difficulty,

        isDailyQuiz,

        isActive: true,
      };

      console.log(
        "SUBMIT QUESTION PAYLOAD:",
        payload
      );

      const response = await fetch(
        "/api/admin/questions",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log(
        "CREATE QUESTION RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create question."
        );
      }

      setSuccess(
        "Question created successfully."
      );

      /*
       * Reset question fields but keep
       * selected exam and subject.
       */
      setQuestion("");
      setOptions([...initialOptions]);
      setCorrectAnswer(0);
      setExplanation("");
      setTopic("");
      setDifficulty("Medium");
      setIsDailyQuiz(false);

      /*
       * Redirect to question list after
       * a short delay.
       */
      setTimeout(() => {
        router.push(
          "/admin/questions"
        );
      }, 800);
    } catch (err) {
      console.error(
        "CREATE QUESTION ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create question."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/questions"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Back to Questions
            </Link>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Add Question
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create a new multiple-choice question.
            </p>
          </div>

          <div className="hidden rounded-xl border border-indigo-100 bg-indigo-50 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/30 sm:block">
            <BookOpen
              className="text-indigo-600 dark:text-indigo-400"
              size={24}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-400">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Exam / Subject */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
              Exam & Subject
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Exam */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Exam
                </label>

                <select
                  value={selectedExamId}
                  onChange={(event) =>
                    handleExamChange(
                      event.target.value
                    )
                  }
                  disabled={loadingExams}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">
                    {loadingExams
                      ? "Loading exams..."
                      : "Select exam"}
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
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Subject
                </label>

                <select
                  value={selectedSubjectId}
                  onChange={(event) =>
                    setSelectedSubjectId(
                      event.target.value
                    )
                  }
                  disabled={
                    !examData ||
                    loadingExam
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">
                    {loadingExam
                      ? "Loading subjects..."
                      : !examData
                      ? "Select an exam first"
                      : examData.subjects.length === 0
                      ? "No subjects available"
                      : "Select subject"}
                  </option>

                  {examData?.subjects.map(
                    (subject) => (
                      <option
                        key={subject._id}
                        value={subject._id}
                      >
                        {subject.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {examData && (
              <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {examData.name}
                </span>

                {" • "}

                {examData.subjects.length} subject
                {examData.subjects.length !== 1
                  ? "s"
                  : ""}

                {" • "}

                {examData.durationMinutes} minutes
              </div>
            )}
          </section>

          {/* Question */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
              Question
            </h2>

            <textarea
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              placeholder="Enter your question..."
              rows={5}
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </section>

          {/* Options */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
              Options
            </h2>

            <div className="space-y-4">
              {options.map(
                (option, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setCorrectAnswer(
                          index
                        )
                      }
                      title={
                        correctAnswer === index
                          ? "Correct answer"
                          : "Mark as correct"
                      }
                      className={`mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition ${
                        correctAnswer === index
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-slate-300 text-slate-400 hover:border-green-400 dark:border-slate-700"
                      }`}
                    >
                      {correctAnswer ===
                      index ? (
                        <Check size={16} />
                      ) : (
                        String.fromCharCode(
                          65 + index
                        )
                      )}
                    </button>

                    <input
                      value={option}
                      onChange={(event) =>
                        updateOption(
                          index,
                          event.target.value
                        )
                      }
                      placeholder={`Option ${
                        String.fromCharCode(
                          65 + index
                        )
                      }`}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                )
              )}
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Click the circle beside an option to mark it as the correct answer.
            </p>
          </section>

          {/* Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
              Question Details
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Topic */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Topic
                </label>

                <input
                  value={topic}
                  onChange={(event) =>
                    setTopic(event.target.value)
                  }
                  placeholder="e.g. CPU, Networking, Operating System"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Difficulty
                </label>

                <select
                  value={difficulty}
                  onChange={(event) =>
                    setDifficulty(
                      event.target.value as
                        | "Easy"
                        | "Medium"
                        | "Hard"
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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

            {/* Explanation */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Explanation
              </label>

              <textarea
                value={explanation}
                onChange={(event) =>
                  setExplanation(
                    event.target.value
                  )
                }
                placeholder="Explain why the selected answer is correct..."
                rows={4}
                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            {/* Daily Quiz */}
            <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <input
                type="checkbox"
                checked={isDailyQuiz}
                onChange={(event) =>
                  setIsDailyQuiz(
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Include in Daily Quiz
                </p>

                <p className="text-xs text-slate-500">
                  Make this question available for the daily quiz.
                </p>
              </div>
            </label>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/admin/questions"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                saving ||
                loadingExam ||
                loadingExams
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Question
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}