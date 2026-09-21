"use client";

import Link from "next/link";
import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
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

function NewQuestionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const examIdFromUrl = searchParams.get("examId");

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");

  const [exams, setExams] = useState<Exam[]>([]);
  const [examData, setExamData] = useState<Exam | null>(null);

  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [isDailyQuiz, setIsDailyQuiz] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * Load all exams
   */
  useEffect(() => {
    const loadExams = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/exams", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load exams."
          );
        }

        const loadedExams: Exam[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.exams)
            ? data.exams
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setExams(loadedExams);

        /*
         * Preserve examId from URL when editing/adding
         * from a particular exam.
         */
        if (examIdFromUrl) {
          const matchingExam = loadedExams.find(
            (exam) => exam._id === examIdFromUrl
          );

          if (matchingExam) {
            setSelectedExamId(matchingExam._id);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load exams."
        );
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [examIdFromUrl]);

  /*
   * Load selected exam details
   */
  useEffect(() => {
    if (!selectedExamId) {
      setExamData(null);
      setSelectedSubjectId("");
      return;
    }

    const loadExam = async () => {
      try {
        setError("");

        const response = await fetch(
          `/api/admin/exams/${selectedExamId}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load exam details."
          );
        }

        const loadedExam: Exam =
          data?.exam ||
          data?.data ||
          data;

        setExamData(loadedExam);

        /*
         * Automatically select first subject if available.
         */
        if (loadedExam?.subjects?.length) {
          setSelectedSubjectId(
            loadedExam.subjects[0]._id
          );
        } else {
          setSelectedSubjectId("");
        }
      } catch (err) {
        setExamData(null);
        setSelectedSubjectId("");

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load exam details."
        );
      }
    };

    loadExam();
  }, [selectedExamId]);

  /*
   * Update option
   */
  const handleOptionChange = (
    index: number,
    value: string
  ) => {
    setOptions((currentOptions) => {
      const updatedOptions = [...currentOptions];
      updatedOptions[index] = value;
      return updatedOptions;
    });
  };

  /*
   * Exam change
   */
  const handleExamChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const examId = event.target.value;

    setSelectedExamId(examId);
    setSelectedSubjectId("");
    setExamData(null);
    setError("");

    if (examId) {
      router.replace(
        `/admin/questions/new?examId=${encodeURIComponent(
          examId
        )}`
      );
    } else {
      router.replace("/admin/questions/new");
    }
  };

  /*
   * Submit question
   */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
     * Validation
     */
    if (!selectedExamId) {
      setError("Please select an exam.");
      return;
    }

    if (!selectedSubjectId) {
      setError("Please select a subject.");
      return;
    }

    if (!question.trim()) {
      setError("Please enter the question.");
      return;
    }

    const cleanedOptions = options
      .map((option) => option.trim())
      .filter(Boolean);

    if (cleanedOptions.length < 2) {
      setError("Please enter at least two options.");
      return;
    }

    if (!correctAnswer.trim()) {
      setError("Please select the correct answer.");
      return;
    }

    if (!cleanedOptions.includes(correctAnswer.trim())) {
      setError(
        "Correct answer must match one of the options."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/admin/questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.trim(),

            options: cleanedOptions,

            correctAnswer: correctAnswer.trim(),

            explanation: explanation.trim(),

            examId: selectedExamId,

            subjectId: selectedSubjectId,

            topic: topic.trim(),

            difficulty,

            isDailyQuiz,

            isActive: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to create question."
        );
      }

      setSuccess("Question added successfully.");

      /*
       * Reset form
       */
      setQuestion("");
      setOptions([...initialOptions]);
      setCorrectAnswer("");
      setExplanation("");
      setTopic("");
      setDifficulty("Medium");
      setIsDailyQuiz(false);

      /*
       * Return to questions list
       */
      setTimeout(() => {
        router.push("/admin/questions");
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create question."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/questions"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              <ArrowLeft size={16} />
              Back to Questions
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <BookOpen size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Add Question
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Create a new question for your exam.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Check size={18} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Exam & Subject */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Exam & Subject
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Select where this question belongs.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Exam */}
                <div>
                  <label
                    htmlFor="exam"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Exam
                  </label>

                  <select
                    id="exam"
                    value={selectedExamId}
                    onChange={handleExamChange}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="">
                      {loading
                        ? "Loading exams..."
                        : "Select an exam"}
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
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Subject
                  </label>

                  <select
                    id="subject"
                    value={selectedSubjectId}
                    onChange={(event) =>
                      setSelectedSubjectId(
                        event.target.value
                      )
                    }
                    disabled={
                      !selectedExamId ||
                      !examData?.subjects?.length
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="">
                      {!selectedExamId
                        ? "Select an exam first"
                        : !examData?.subjects?.length
                          ? "No subjects available"
                          : "Select a subject"}
                    </option>

                    {examData?.subjects?.map(
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
            </div>

            {/* Question */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Question
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter the question and its answer options.
                </p>
              </div>

              <div className="space-y-6">
                {/* Question */}
                <div>
                  <label
                    htmlFor="question"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Question
                  </label>

                  <textarea
                    id="question"
                    value={question}
                    onChange={(event) =>
                      setQuestion(event.target.value)
                    }
                    rows={5}
                    placeholder="Enter your question..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Options
                  </label>

                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {String.fromCharCode(
                            65 + index
                          )}
                        </div>

                        <input
                          type="text"
                          value={option}
                          onChange={(event) =>
                            handleOptionChange(
                              index,
                              event.target.value
                            )
                          }
                          placeholder={`Option ${String.fromCharCode(
                            65 + index
                          )}`}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <label
                    htmlFor="correctAnswer"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Correct Answer
                  </label>

                  <select
                    id="correctAnswer"
                    value={correctAnswer}
                    onChange={(event) =>
                      setCorrectAnswer(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="">
                      Select correct answer
                    </option>

                    {options
                      .filter((option) => option.trim())
                      .map((option, index) => (
                        <option
                          key={`${option}-${index}`}
                          value={option}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}{" "}
                          — {option}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Details
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add additional information about the question.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Topic */}
                <div>
                  <label
                    htmlFor="topic"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Topic
                  </label>

                  <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(event) =>
                      setTopic(event.target.value)
                    }
                    placeholder="e.g. Operating Systems"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label
                    htmlFor="difficulty"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Difficulty
                  </label>

                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(event) =>
                      setDifficulty(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {/* Explanation */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="explanation"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Explanation
                  </label>

                  <textarea
                    id="explanation"
                    value={explanation}
                    onChange={(event) =>
                      setExplanation(
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="Explain why this answer is correct..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Daily Quiz */}
                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isDailyQuiz}
                      onChange={(event) =>
                        setIsDailyQuiz(
                          event.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                    />

                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Include this question in Daily Quiz
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/admin/questions"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Question
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/*
 * Suspense boundary is required because this page uses
 * useSearchParams() during production prerendering.
 */
export default function NewQuestionPage() {
  return (
    <Suspense fallback={null}>
      <NewQuestionForm />
    </Suspense>
  );
}