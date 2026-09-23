
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
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

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

const EMPTY_OPTIONS: [
  string,
  string,
  string,
  string
] = ["", "", "", ""];

function NewQuestionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const examIdFromUrl =
    searchParams.get("examId") || "";

  const [question, setQuestion] = useState("");

  const [options, setOptions] = useState<
    [string, string, string, string]
  >([...EMPTY_OPTIONS]);

  /*
   * Canonical answer mapping:
   *
   * A = 0
   * B = 1
   * C = 2
   * D = 3
   *
   * -1 means no answer selected.
   */
  const [correctAnswer, setCorrectAnswer] =
    useState<number>(-1);

  const [explanation, setExplanation] =
    useState("");

  const [exams, setExams] = useState<Exam[]>([]);

  const [selectedExamId, setSelectedExamId] =
    useState("");

  const [selectedSubjectId, setSelectedSubjectId] =
    useState("");

  const [topic, setTopic] = useState("");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("Medium");

  const [isDailyQuiz, setIsDailyQuiz] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * Load exams.
   *
   * The /api/admin/exams endpoint already returns
   * embedded subjects, so there is no need to
   * make another request just to load subjects.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadExams() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/exams",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load exams."
          );
        }

        const loadedExams: Exam[] =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.exams)
              ? data.exams
              : Array.isArray(data?.data)
                ? data.data
                : [];

        if (cancelled) return;

        setExams(loadedExams);

        /*
         * If examId was supplied in the URL,
         * automatically select it.
         */
        if (examIdFromUrl) {
          const matchingExam =
            loadedExams.find(
              (exam) =>
                String(exam._id) ===
                String(examIdFromUrl)
            );

          if (matchingExam) {
            setSelectedExamId(
              String(matchingExam._id)
            );

            /*
             * Automatically select the first
             * subject when one exists.
             */
            if (
              Array.isArray(
                matchingExam.subjects
              ) &&
              matchingExam.subjects.length > 0
            ) {
              setSelectedSubjectId(
                String(
                  matchingExam.subjects[0]._id
                )
              );
            }
          } else {
            setError(
              "The selected exam was not found."
            );
          }
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load exams."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadExams();

    return () => {
      cancelled = true;
    };
  }, [examIdFromUrl]);

  /*
   * Get currently selected exam.
   */
  const selectedExam =
    exams.find(
      (exam) =>
        String(exam._id) ===
        String(selectedExamId)
    ) || null;

  /*
   * Get subjects belonging to the selected exam.
   */
  const subjects: Subject[] =
    selectedExam?.subjects || [];

  /*
   * Change an option.
   */
  function handleOptionChange(
    index: number,
    value: string
  ) {
    setOptions((currentOptions) => {
      const updatedOptions = [
        ...currentOptions,
      ] as [
        string,
        string,
        string,
        string
      ];

      updatedOptions[index] = value;

      return updatedOptions;
    });
  }

  /*
   * Change exam.
   *
   * When the exam changes, reset the subject because
   * subject IDs belong to the selected exam.
   */
  function handleExamChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const examId = event.target.value;

    setSelectedExamId(examId);
    setSelectedSubjectId("");
    setError("");
    setSuccess("");

    /*
     * Reset answer selection when changing
     * the exam.
     */
    setCorrectAnswer(-1);

    /*
     * Automatically select the first subject
     * for the new exam.
     */
    if (examId) {
      const exam = exams.find(
        (item) =>
          String(item._id) ===
          String(examId)
      );

      if (
        exam?.subjects &&
        exam.subjects.length > 0
      ) {
        setSelectedSubjectId(
          String(exam.subjects[0]._id)
        );
      }

      router.replace(
        `/admin/questions/new?examId=${encodeURIComponent(
          examId
        )}`
      );
    } else {
      router.replace(
        "/admin/questions/new"
      );
    }
  }

  /*
   * Submit question.
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
     * Validate exam.
     */
    if (!selectedExamId) {
      setError("Please select an exam.");
      return;
    }

    /*
     * Validate subject.
     */
    if (!selectedSubjectId) {
      setError("Please select a subject.");
      return;
    }

    /*
     * Make sure the exam actually exists.
     */
    const exam = exams.find(
      (item) =>
        String(item._id) ===
        String(selectedExamId)
    );

    if (!exam) {
      setError(
        "Selected exam could not be found."
      );
      return;
    }

    /*
     * Make sure the subject belongs to
     * the selected exam.
     */
    const subject = exam.subjects?.find(
      (item) =>
        String(item._id) ===
        String(selectedSubjectId)
    );

    if (!subject) {
      setError(
        "Selected subject does not belong to the selected exam."
      );
      return;
    }

    /*
     * Validate question.
     */
    if (!question.trim()) {
      setError(
        "Please enter the question."
      );
      return;
    }

    /*
     * Exactly four options are required.
     */
    if (options.length !== 4) {
      setError(
        "A question must have exactly four options."
      );
      return;
    }

    const cleanedOptions = options.map(
      (option) => option.trim()
    ) as [
      string,
      string,
      string,
      string
    ];

    /*
     * Validate every option.
     */
    if (
      cleanedOptions.some(
        (option) => !option
      )
    ) {
      setError(
        "Please enter all four options (A, B, C and D)."
      );
      return;
    }

    /*
     * Validate canonical answer index.
     */
    if (
      !Number.isInteger(correctAnswer) ||
      correctAnswer < 0 ||
      correctAnswer > 3
    ) {
      setError(
        "Please select a correct answer from A, B, C or D."
      );
      return;
    }

    /*
     * Validate topic.
     */
    if (!topic.trim()) {
      setError(
        "Please enter a topic."
      );
      return;
    }

    /*
     * Validate difficulty.
     */
    if (
      difficulty !== "Easy" &&
      difficulty !== "Medium" &&
      difficulty !== "Hard"
    ) {
      setError(
        "Please select a valid difficulty."
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * MongoDB relationship fields:
       *
       * examId    -> Exam._id
       * subjectId -> Exam.subjects._id
       *
       * Legacy exam/subject names are also sent
       * for compatibility with older records.
       */
      const payload = {
        question: question.trim(),

        options: cleanedOptions,

        /*
         * Canonical mapping:
         *
         * A = 0
         * B = 1
         * C = 2
         * D = 3
         */
        correctAnswer,

        explanation: explanation.trim(),

        examId: String(exam._id),

        subjectId: String(subject._id),

        /*
         * Legacy compatibility fields.
         */
        exam: exam.name,
        subject: subject.name,

        topic: topic.trim(),

        difficulty,

        isDailyQuiz,

        isActive: true,
      };

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

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to create question."
        );
      }

      setSuccess(
        "Question added successfully."
      );

      /*
       * Reset only question-specific fields.
       *
       * Keep the selected exam and subject so the
       * admin can quickly add another question to
       * the same subject.
       */
      setQuestion("");
      setOptions([...EMPTY_OPTIONS]);
      setCorrectAnswer(-1);
      setExplanation("");
      setTopic("");
      setDifficulty("Medium");
      setIsDailyQuiz(false);

      /*
       * Return to question list.
       */
      setTimeout(() => {
        router.push(
          "/admin/questions"
        );
        router.refresh();
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
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/questions"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
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
                Create a new question for your
                exam.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Check size={18} />
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Exam & Subject */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                  disabled={loading || saving}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">
                    {loading
                      ? "Loading exams..."
                      : exams.length === 0
                        ? "No exams found"
                        : "Select an exam"}
                  </option>

                  {exams.map((exam) => (
                    <option
                      key={String(exam._id)}
                      value={String(exam._id)}
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
                    subjects.length === 0 ||
                    saving
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">
                    {!selectedExamId
                      ? "Select an exam first"
                      : subjects.length === 0
                        ? "No subjects available"
                        : "Select a subject"}
                  </option>

                  {subjects.map(
                    (subject) => (
                      <option
                        key={String(
                          subject._id
                        )}
                        value={String(
                          subject._id
                        )}
                      >
                        {subject.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Selected location */}
            {selectedExam &&
              selectedSubjectId && (
                <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-300">
                  <span className="font-semibold">
                    Exam:
                  </span>{" "}
                  {selectedExam.name}
                  {" · "}
                  <span className="font-semibold">
                    Subject:
                  </span>{" "}
                  {subjects.find(
                    (subject) =>
                      String(
                        subject._id
                      ) ===
                      String(
                        selectedSubjectId
                      )
                  )?.name ||
                    "Unknown"}
                </div>
              )}
          </section>

          {/* Question */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Question
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Enter the question and exactly four
                answer options.
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
                    setQuestion(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Enter your question..."
                  disabled={saving}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {/* Options */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Options
                </label>

                <div className="space-y-3">
                  {options.map(
                    (option, index) => (
                      <div
                        key={index}
                        className={`rounded-xl border p-3 transition ${
                          correctAnswer ===
                          index
                            ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20"
                            : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Correct answer radio */}
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={
                              correctAnswer ===
                              index
                            }
                            onChange={() =>
                              setCorrectAnswer(
                                index
                              )
                            }
                            disabled={saving}
                            className="h-4 w-4 shrink-0 accent-emerald-600"
                          />

                          {/* Letter */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                            {String.fromCharCode(
                              65 + index
                            )}
                          </div>

                          {/* Input */}
                          <input
                            type="text"
                            value={option}
                            onChange={(
                              event
                            ) =>
                              handleOptionChange(
                                index,
                                event.target
                                  .value
                              )
                            }
                            placeholder={`Option ${String.fromCharCode(
                              65 + index
                            )}`}
                            disabled={saving}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                          />
                        </div>

                        {correctAnswer ===
                          index && (
                          <p className="mt-2 pl-[5.25rem] text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Correct answer
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>

                <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-300">
                  <strong>
                    Answer mapping:
                  </strong>{" "}
                  A = 0, B = 1, C = 2, D = 3
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
                  value={
                    correctAnswer === -1
                      ? ""
                      : String(
                          correctAnswer
                        )
                  }
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    setCorrectAnswer(
                      value === ""
                        ? -1
                        : Number(value)
                    );
                  }}
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">
                    Select correct answer
                  </option>

                  {options.map(
                    (option, index) => (
                      <option
                        key={index}
                        value={index}
                        disabled={
                          !option.trim()
                        }
                      >
                        {String.fromCharCode(
                          65 + index
                        )}{" "}
                        —{" "}
                        {option ||
                          "Empty option"}
                      </option>
                    )
                  )}
                </select>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  A = 0, B = 1, C = 2, D = 3
                </p>
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Details
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add additional information about
                the question.
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
                    setTopic(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Operating Systems"
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
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
                    setDifficulty(
                      event.target
                        .value as Difficulty
                    )
                  }
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
                  disabled={saving}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {/* Daily Quiz */}
              <div className="md:col-span-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <input
                    type="checkbox"
                    checked={isDailyQuiz}
                    onChange={(event) =>
                      setIsDailyQuiz(
                        event.target.checked
                      )
                    }
                    disabled={saving}
                    className="h-4 w-4 rounded border-slate-300 accent-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Include in Daily Quiz
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      This question can be selected
                      for the daily quiz.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </section>

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
              disabled={saving || loading}
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
        </form>
      </div>
    </div>
  );
}

/*
 * useSearchParams() requires a Suspense boundary
 * during Next.js production prerendering.
 */
export default function NewQuestionPage() {
  return (
    <Suspense fallback={null}>
      <NewQuestionForm />
    </Suspense>
  );
}

