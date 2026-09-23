
"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  FileJson,
  FileSpreadsheet,
  FileUp,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  useMemo,
  useState,
} from "react";

import {
  ImportError,
  ImportQuestion,
  validateImportRows,
} from "@/lib/question-import";

type RawRow = Record<string, unknown>;

type ImportResult = {
  insertedCount: number;
  skippedCount: number;
};

type QuickFixSuggestion = {
  type: "quick-fix";
  title: string;
  description: string;
  options: string[];
  recommended?: string | null;
};

type TextSuggestion = {
  type: "text";
  title: string;
  description: string;
};

type Suggestion =
  | QuickFixSuggestion
  | TextSuggestion;

const FIELD_LABELS: Record<string, string> = {
  question: "Question",
  option1: "Option 1",
  option2: "Option 2",
  option3: "Option 3",
  option4: "Option 4",
  options: "Options",
  correctAnswer: "Correct Answer",
  explanation: "Explanation",
  exam: "Exam",
  subject: "Subject",
  topic: "Topic",
  difficulty: "Difficulty",
  isDailyQuiz: "Daily Quiz",
  isActive: "Active",
};

function parseCSV(text: string): RawRow[] {
  const rows: string[][] = [];

  let row: string[] = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      value += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if (
      (char === "\n" || char === "\r") &&
      !insideQuotes
    ) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(value);
      value = "";

      if (
        row.some(
          (cell) => cell.trim() !== ""
        )
      ) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    value += char;
  }

  if (value !== "" || row.length > 0) {
    row.push(value);

    if (
      row.some(
        (cell) => cell.trim() !== ""
      )
    ) {
      rows.push(row);
    }
  }

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) =>
    String(header).trim()
  );

  return rows.slice(1).map((values) => {
    const object: RawRow = {};

    headers.forEach((header, index) => {
      object[header] = values[index] ?? "";
    });

    return object;
  });
}

async function parseFile(file: File): Promise<RawRow[]> {
  const text = await file.text();

  if (
    file.name
      .toLowerCase()
      .endsWith(".json")
  ) {
    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(
        "Invalid JSON file. Please upload valid JSON."
      );
    }

    if (Array.isArray(parsed)) {
      return parsed as RawRow[];
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray(
        (parsed as { questions?: unknown }).questions
      )
    ) {
      return (
        (parsed as { questions: RawRow[] })
          .questions
      );
    }

    throw new Error(
      "JSON must contain an array of questions or an object with a questions array."
    );
  }

  return parseCSV(text);
}

function getValue(
  row: RawRow,
  field: string
): string {
  const value = row[field];

  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }

  return String(value);
}

function getRowIndex(rowNumber: number): number {
  /*
   * CSV/validator numbering:
   *
   * Header = row 1
   * First data row = row 2
   *
   * Therefore:
   * row 2 -> rows[0]
   * row 3 -> rows[1]
   */
  return Number(rowNumber) - 2;
}

function updateRowFieldValue(
  row: RawRow,
  field: string,
  value: string
): RawRow {
  const updated: RawRow = {
    ...row,
    [field]: value,
  };

  /*
   * Keep option1-option4 and options
   * synchronized.
   */
  if (
    [
      "option1",
      "option2",
      "option3",
      "option4",
    ].includes(field)
  ) {
    const index =
      Number(
        field.replace("option", "")
      ) - 1;

    const currentOptions = Array.isArray(
      updated.options
    )
      ? [
          ...updated.options,
        ]
      : [
          getValue(updated, "option1"),
          getValue(updated, "option2"),
          getValue(updated, "option3"),
          getValue(updated, "option4"),
        ];

    while (currentOptions.length < 4) {
      currentOptions.push("");
    }

    currentOptions[index] = value;

    updated.options = currentOptions.slice(0, 4);
  }

  /*
   * Allow editing a pipe-separated
   * options field if validator reports
   * an "options" error.
   *
   * Example:
   * A|B|C|D
   */
  if (field === "options") {
    const parts = value
      .split("|")
      .map((item) => item.trim());

    if (parts.length === 4) {
      updated.option1 = parts[0];
      updated.option2 = parts[1];
      updated.option3 = parts[2];
      updated.option4 = parts[3];
      updated.options = parts;
    }
  }

  return updated;
}

function getCorrectAnswerSuggestion(
  row: RawRow
): string | null {
  const options = [
    getValue(row, "option1"),
    getValue(row, "option2"),
    getValue(row, "option3"),
    getValue(row, "option4"),
  ];

  const answer = getValue(
    row,
    "correctAnswer"
  ).trim();

  if (!answer) {
    return null;
  }

  /*
   * Exact option text match.
   */
  const index = options.findIndex(
    (option) =>
      option.trim() !== "" &&
      option.trim().toLowerCase() ===
        answer.toLowerCase()
  );

  if (index !== -1) {
    return String.fromCharCode(65 + index);
  }

  /*
   * Numeric canonical mapping.
   *
   * 0 = A
   * 1 = B
   * 2 = C
   * 3 = D
   */
  if (/^[0-3]$/.test(answer)) {
    return String.fromCharCode(
      65 + Number(answer)
    );
  }

  /*
   * Also recognize A/B/C/D.
   */
  if (/^[ABCD]$/i.test(answer)) {
    return answer.toUpperCase();
  }

  return null;
}

function getErrorSuggestion(
  error: ImportError,
  row: RawRow
): Suggestion {
  const field = String(
    error.field || ""
  );

  if (field === "correctAnswer") {
    const exactMatch =
      getCorrectAnswerSuggestion(row);

    return {
      type: "quick-fix",
      title: "Fix correct answer",
      description:
        exactMatch
          ? `Suggested answer: ${exactMatch}. The current value can be mapped to that option.`
          : "Use A, B, C or D. Numeric values 0-3 are also supported by the importer.",
      options: [
        "A",
        "B",
        "C",
        "D",
      ],
      recommended: exactMatch,
    };
  }

  if (
    [
      "option1",
      "option2",
      "option3",
      "option4",
      "options",
    ].includes(field)
  ) {
    return {
      type: "text",
      title: "Fix answer options",
      description:
        field === "options"
          ? "Exactly four non-empty options are required. Edit Option 1-4 below."
          : "Enter a non-empty answer option.",
    };
  }

  if (field === "question") {
    return {
      type: "text",
      title: "Fix question",
      description:
        "Enter the complete question text.",
    };
  }

  if (field === "explanation") {
    return {
      type: "text",
      title: "Fix explanation",
      description:
        "Enter a short explanation for the correct answer.",
    };
  }

  if (field === "difficulty") {
    return {
      type: "quick-fix",
      title: "Fix difficulty",
      description:
        "Choose Easy, Medium, or Hard.",
      options: [
        "Easy",
        "Medium",
        "Hard",
      ],
    };
  }

  if (field === "isDailyQuiz") {
    return {
      type: "quick-fix",
      title: "Fix Daily Quiz",
      description:
        "Choose true or false.",
      options: [
        "true",
        "false",
      ],
    };
  }

  if (field === "isActive") {
    return {
      type: "quick-fix",
      title: "Fix Active status",
      description:
        "Choose true or false.",
      options: [
        "true",
        "false",
      ],
    };
  }

  if (field === "exam") {
    return {
      type: "text",
      title: "Fix exam",
      description:
        "Enter the exact exam name configured in your database.",
    };
  }

  if (field === "subject") {
    return {
      type: "text",
      title: "Fix subject",
      description:
        "Enter the exact subject name configured inside the selected exam.",
    };
  }

  if (field === "topic") {
    return {
      type: "text",
      title: "Fix topic",
      description:
        "Enter the topic name.",
    };
  }

  return {
    type: "text",
    title: "Fix this field",
    description:
      error.message,
  };
}

export default function ImportQuestionsPage() {
  const [file, setFile] =
    useState<File | null>(null);

  const [rows, setRows] =
    useState<RawRow[]>([]);

  const [questions, setQuestions] =
    useState<ImportQuestion[]>([]);

  const [errors, setErrors] =
    useState<ImportError[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [importing, setImporting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [importResult, setImportResult] =
    useState<ImportResult | null>(null);

  const [
    editingErrorKey,
    setEditingErrorKey,
  ] = useState<string | null>(null);

  const [showEditor, setShowEditor] =
    useState(true);

  const currentStep = useMemo(() => {
    if (!file) {
      return 1;
    }

    if (errors.length > 0) {
      return 2;
    }

    if (questions.length > 0) {
      return 3;
    }

    return 2;
  }, [
    file,
    errors.length,
    questions.length,
  ]);

  const updateRowField = (
    rowNumber: number,
    field: string,
    value: string
  ) => {
    const rowIndex =
      getRowIndex(rowNumber);

    setRows((currentRows) => {
      if (
        rowIndex < 0 ||
        rowIndex >= currentRows.length
      ) {
        return currentRows;
      }

      const updatedRows = [
        ...currentRows,
      ];

      updatedRows[rowIndex] =
        updateRowFieldValue(
          updatedRows[rowIndex],
          field,
          value
        );

      return updatedRows;
    });

    /*
     * Do not remove validation errors
     * until the user re-validates.
     */
    setMessage("");
    setErrorMessage("");
    setImportResult(null);
  };

  const applyQuickFix = (
    rowNumber: number,
    field: string,
    value: string
  ) => {
    updateRowField(
      rowNumber,
      field,
      value
    );
  };

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const lowerName =
      selectedFile.name.toLowerCase();

    if (
      !lowerName.endsWith(".csv") &&
      !lowerName.endsWith(".json")
    ) {
      setErrorMessage(
        "Only CSV and JSON files are supported."
      );
      return;
    }

    setFile(selectedFile);
    setRows([]);
    setQuestions([]);
    setErrors([]);
    setMessage("");
    setErrorMessage("");
    setImportResult(null);
    setEditingErrorKey(null);
    setShowEditor(true);

    try {
      const parsedRows =
        await parseFile(selectedFile);

      if (!parsedRows.length) {
        setErrorMessage(
          "No question rows were found in the selected file."
        );
        return;
      }

      setRows(parsedRows);

      setMessage(
        `${parsedRows.length} question ${
          parsedRows.length === 1
            ? "row"
            : "rows"
        } loaded successfully.`
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to read the selected file."
      );
    }
  };

  const validateQuestions =
    async () => {
      if (!rows.length) {
        setErrorMessage(
          "Please upload a CSV or JSON file first."
        );
        return;
      }

      setLoading(true);
      setMessage("");
      setErrorMessage("");
      setImportResult(null);

      try {
        /*
         * First run the same local
         * validation used by the importer.
         */
        const localResult =
          validateImportRows(rows);

        /*
         * Then validate against MongoDB.
         *
         * This catches relationship
         * errors such as:
         *
         * Subject "X" was not found
         * inside exam "Y".
         */
        const response = await fetch(
          "/api/admin/questions/import",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action: "validate",
              questions: rows,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Server validation failed."
          );
        }

        const serverErrors =
          Array.isArray(data?.errors)
            ? data.errors
            : [];

        /*
         * Server errors have priority because
         * they include database relationship
         * validation.
         */
        const finalErrors =
          serverErrors.length > 0
            ? serverErrors
            : localResult.errors;

        setErrors(finalErrors);

        if (finalErrors.length === 0) {
          setQuestions(
            Array.isArray(
              data?.questions
            )
              ? data.questions
              : localResult.questions
          );

          setMessage(
            "All questions passed validation successfully."
          );

          setErrorMessage("");
          setEditingErrorKey(null);
          setShowEditor(false);
        } else {
          setQuestions([]);

          setErrorMessage(
            `${finalErrors.length} validation ${
              finalErrors.length === 1
                ? "error"
                : "errors"
            } found. Fix the errors below and click Re-validate.`
          );

          setShowEditor(true);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Validation failed."
        );
      } finally {
        setLoading(false);
      }
    };

  const importQuestions =
    async () => {
      if (!rows.length) {
        setErrorMessage(
          "No questions are available to import."
        );
        return;
      }

      if (errors.length > 0) {
        setErrorMessage(
          "Please fix all validation errors before importing."
        );
        return;
      }

      if (questions.length === 0) {
        setErrorMessage(
          "Please validate the questions before importing."
        );
        return;
      }

      setImporting(true);
      setMessage("");
      setErrorMessage("");

      try {
        const response = await fetch(
          "/api/admin/questions/import",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action: "import",
              questions: rows,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Question import failed."
          );
        }

        setImportResult({
          insertedCount:
            Number(
              data?.insertedCount || 0
            ),
          skippedCount:
            Number(
              data?.skippedCount || 0
            ),
        });

        setMessage(
          "Questions imported successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Question import failed."
        );
      } finally {
        setImporting(false);
      }
    };

  const removeFile = () => {
    setFile(null);
    setRows([]);
    setQuestions([]);
    setErrors([]);
    setMessage("");
    setErrorMessage("");
    setImportResult(null);
    setEditingErrorKey(null);
    setShowEditor(true);
  };

  const getErrorKey = (
    error: ImportError,
    index: number
  ) =>
    `${error.row}-${error.field}-${index}`;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/questions"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              <ArrowLeft size={16} />
              Back to Questions
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Import Questions
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Upload CSV or JSON questions,
              validate them, fix errors, preview
              them, and import them into MongoDB.
            </p>
          </div>
        </div>

        {/* STEPS */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                number: 1,
                title: "Upload",
                description:
                  "Upload CSV / JSON",
              },
              {
                number: 2,
                title: "Validate",
                description:
                  "Check question data",
              },
              {
                number: 3,
                title: "Preview",
                description:
                  "Review questions",
              },
              {
                number: 4,
                title: "Import",
                description:
                  "Save to MongoDB",
              },
            ].map((step) => {
              const active =
                currentStep >=
                step.number;

              const completed =
                step.number < currentStep;

              return (
                <div
                  key={step.number}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {completed ? (
                      <Check size={17} />
                    ) : (
                      step.number
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        active
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {step.title}
                    </p>

                    <p className="text-xs text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* UPLOAD */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Upload CSV / JSON
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Supported formats: CSV and JSON
            </p>
          </div>

          {!file ? (
            <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-12 text-center transition hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <FileUp size={28} />
              </div>

              <p className="font-semibold text-slate-800 dark:text-white">
                Click to upload a file
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                CSV or JSON
              </p>

              <input
                type="file"
                accept=".csv,.json,application/json,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
                  {file.name
                    .toLowerCase()
                    .endsWith(".json") ? (
                    <FileJson size={23} />
                  ) : (
                    <FileSpreadsheet size={23} />
                  )}
                </div>

                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {file.name}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {rows.length} question
                    {rows.length === 1
                      ? ""
                      : "s"} loaded
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={removeFile}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <X size={16} />
                Remove
              </button>
            </div>
          )}

          {rows.length > 0 && (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={validateQuestions}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Validating...
                  </>
                ) : (
                  <>
                    <Check size={17} />
                    {errors.length > 0
                      ? "Re-validate"
                      : "Validate Questions"}
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{message}</span>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{errorMessage}</span>
          </div>
        )}

        {/* ERROR EDITOR */}
        {errors.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-900/50 dark:bg-slate-900">
            <div className="border-b border-red-200 bg-red-50 px-6 py-5 dark:border-red-900/50 dark:bg-red-950/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                    <AlertCircle size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-red-900 dark:text-red-300">
                      Validation Errors
                    </h2>

                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                      Fix the errors below and
                      click Re-validate.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowEditor(
                      (current) => !current
                    )
                  }
                  className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-800 dark:bg-slate-900 dark:text-red-400"
                >
                  {showEditor
                    ? "Hide Editor"
                    : "Show Editor"}
                </button>
              </div>
            </div>

            {showEditor && (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {errors.map(
                  (error, errorIndex) => {
                    const rowIndex =
                      getRowIndex(
                        Number(error.row)
                      );

                    const row =
                      rows[rowIndex] || {};

                    const field =
                      String(
                        error.field || ""
                      );

                    const errorKey =
                      getErrorKey(
                        error,
                        errorIndex
                      );

                    const suggestion =
                      getErrorSuggestion(
                        error,
                        row
                      );

                    const currentValue =
                      getValue(
                        row,
                        field
                      );

                    const isEditing =
                      editingErrorKey ===
                      errorKey;

                    return (
                      <div
                        key={errorKey}
                        className="p-6"
                      >
                        <div className="flex flex-col gap-5">
                          {/* ERROR INFO */}
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-950/50 dark:text-red-400">
                                  Row {error.row}
                                </span>

                                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                  {FIELD_LABELS[
                                    field
                                  ] || field}
                                </span>
                              </div>

                              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                                {error.message}
                              </p>

                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Current value:{" "}
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                  {currentValue ||
                                    "(empty)"}
                                </span>
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setEditingErrorKey(
                                  isEditing
                                    ? null
                                    : errorKey
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                            >
                              {isEditing
                                ? "Close Editor"
                                : "Edit Row"}
                            </button>
                          </div>

                          {/* SUGGESTED FIX */}
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                            <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
                              Suggested Fix
                            </p>

                            <p className="mt-1 text-sm font-medium text-amber-800 dark:text-amber-400">
                              {suggestion.title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-500">
                              {suggestion.description}
                            </p>

                            {suggestion.type ===
                              "quick-fix" && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {suggestion.options.map(
                                  (option) => {
                                    const selected =
                                      currentValue
                                        .trim()
                                        .toLowerCase() ===
                                      option.toLowerCase();

                                    const recommended =
                                      suggestion.recommended ===
                                      option;

                                    return (
                                      <button
                                        key={
                                          option
                                        }
                                        type="button"
                                        onClick={() =>
                                          applyQuickFix(
                                            Number(
                                              error.row
                                            ),
                                            field,
                                            option
                                          )
                                        }
                                        className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                                          selected
                                            ? "border-indigo-600 bg-indigo-600 text-white"
                                            : recommended
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                                            : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                                        }`}
                                      >
                                        {option}

                                        {recommended &&
                                          !selected && (
                                            <span className="ml-1 text-xs">
                                              Recommended
                                            </span>
                                          )}
                                      </button>
                                    );
                                  }
                                )}
                              </div>
                            )}
                          </div>

                          {/* EDITOR */}
                          {isEditing && (
                            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/10">
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Edit Row {error.row}
                              </h3>

                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Make your changes, then
                                click Re-validate.
                              </p>

                              <div className="mt-5 grid gap-4 md:grid-cols-2">
                                {/* QUESTION */}
                                <div className="md:col-span-2">
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Question
                                  </label>

                                  <textarea
                                    value={getValue(
                                      row,
                                      "question"
                                    )}
                                    onChange={(event) =>
                                      updateRowField(
                                        Number(
                                          error.row
                                        ),
                                        "question",
                                        event.target.value
                                      )
                                    }
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                  />
                                </div>

                                {/* OPTIONS */}
                                {[
                                  "option1",
                                  "option2",
                                  "option3",
                                  "option4",
                                ].map(
                                  (optionField) => (
                                    <div
                                      key={
                                        optionField
                                      }
                                    >
                                      <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                        {
                                          FIELD_LABELS[
                                            optionField
                                          ]
                                        }
                                      </label>

                                      <input
                                        type="text"
                                        value={getValue(
                                          row,
                                          optionField
                                        )}
                                        onChange={(
                                          event
                                        ) =>
                                          updateRowField(
                                            Number(
                                              error.row
                                            ),
                                            optionField,
                                            event.target
                                              .value
                                          )
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                      />
                                    </div>
                                  )
                                )}

                                {/* CORRECT ANSWER */}
                                <div>
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Correct Answer
                                  </label>

                                  <select
                                    value={getValue(
                                      row,
                                      "correctAnswer"
                                    )}
                                    onChange={(event) =>
                                      updateRowField(
                                        Number(
                                          error.row
                                        ),
                                        "correctAnswer",
                                        event.target.value
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                  >
                                    <option value="">
                                      Select
                                    </option>

                                    <option value="A">
                                      A — Option 1
                                    </option>

                                    <option value="B">
                                      B — Option 2
                                    </option>

                                    <option value="C">
                                      C — Option 3
                                    </option>

                                    <option value="D">
                                      D — Option 4
                                    </option>
                                  </select>

                                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                    A=0, B=1, C=2, D=3
                                  </p>
                                </div>

                                {/* DIFFICULTY */}
                                <div>
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Difficulty
                                  </label>

                                  <select
                                    value={getValue(
                                      row,
                                      "difficulty"
                                    )}
                                    onChange={(event) =>
                                      updateRowField(
                                        Number(
                                          error.row
                                        ),
                                        "difficulty",
                                        event.target.value
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                  >
                                    <option value="">
                                      Select
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

                                {/* EXPLANATION */}
                                <div className="md:col-span-2">
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Explanation
                                  </label>

                                  <textarea
                                    value={getValue(
                                      row,
                                      "explanation"
                                    )}
                                    onChange={(event) =>
                                      updateRowField(
                                        Number(
                                          error.row
                                        ),
                                        "explanation",
                                        event.target.value
                                      )
                                    }
                                    rows={4}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                  />
                                </div>

                                {/* EXAM */}
                                <div>
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Exam
                                  </label>

                                  <input
                                    type="text"
                                    value={getValue(
                                      row,
                                      "exam"
                                    )}
                                    onChange={(event) =>
                                      updateRowField(
                                        Number(
                                          error.row
                                        ),
                                        "exam",
                                        event.target.value
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                  />
                                </div>

                                {/* SUBJECT */}
                                <div>
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Subject
                                  </label>

                                  <input
                                    type="text"
                                    value={getValue(
                                      row,
                                      "subject"
                                    )}
                                    onChange={(event) =>
                                      updateRowField(
                                        Number(
                                          error.row
                                        ),
                                        "subject",
                                        event.target.value
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                  />
                                </div>

                                {/* TOPIC */}
                                <div>
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Topic
                                  </label>

                                  <input
                                    type="text"
                                    value={getValue(
                                      row,
                                      "topic"
                                    )}
                                    onChange={(event) =>
                                      updateRowField(
                                        Number(
                                          error.row
                                        ),
                                        "topic",
                                        event.target.value
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                  />
                                </div>

                                {/* DAILY QUIZ */}
                                <div>
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Daily Quiz
                                  </label>

                                  <select
                                    value={getValue(
                                      row,
                                      "isDailyQuiz"
                                    )}
                                    onChange={(event) =>
                                      updateRowField(
                                        Number(
                                          error.row
                                        ),
                                        "isDailyQuiz",
                                        event.target.value
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                  >
                                    <option value="">
                                      Select
                                    </option>

                                    <option value="true">
                                      true
                                    </option>

                                    <option value="false">
                                      false
                                    </option>
                                  </select>
                                </div>

                                {/* ACTIVE */}
                                <div>
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Active
                                  </label>

                                  <select
                                    value={getValue(
                                      row,
                                      "isActive"
                                    )}
                                    onChange={(event) =>
                                      updateRowField(
                                        Number(
                                          error.row
                                        ),
                                        "isActive",
                                        event.target.value
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                  >
                                    <option value="">
                                      Select
                                    </option>

                                    <option value="true">
                                      true
                                    </option>

                                    <option value="false">
                                      false
                                    </option>
                                  </select>
                                </div>
                              </div>

                              {/* REVALIDATE */}
                              <div className="mt-6 flex flex-col gap-3 border-t border-indigo-200 pt-5 dark:border-indigo-900/50 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                  Changes are not
                                  considered valid
                                  until you
                                  re-validate.
                                </p>

                                <button
                                  type="button"
                                  onClick={
                                    validateQuestions
                                  }
                                  disabled={loading}
                                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {loading ? (
                                    <>
                                      <Loader2
                                        size={16}
                                        className="animate-spin"
                                      />
                                      Re-validating...
                                    </>
                                  ) : (
                                    <>
                                      <Check
                                        size={16}
                                      />
                                      Re-validate
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>
        )}

        {/* PREVIEW */}
        {errors.length === 0 &&
          questions.length > 0 && (
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Question Preview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Showing up to the first
                    20 validated questions.
                  </p>
                </div>

                <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  {questions.length} valid
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                        #
                      </th>

                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                        Question
                      </th>

                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                        Options
                      </th>

                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                        Answer
                      </th>

                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                        Exam
                      </th>

                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                        Subject
                      </th>

                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                        Difficulty
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {questions
                      .slice(0, 20)
                      .map(
                        (
                          question,
                          index
                        ) => (
                          <tr
                            key={`${question.question}-${index}`}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/30"
                          >
                            <td className="px-4 py-4 align-top font-medium text-slate-500">
                              {index + 1}
                            </td>

                            <td className="max-w-[360px] px-4 py-4 align-top font-medium text-slate-900 dark:text-white">
                              {
                                question.question
                              }
                            </td>

                            <td className="px-4 py-4 align-top">
                              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                {question.options.map(
                                  (
                                    option,
                                    optionIndex
                                  ) => (
                                    <div
                                      key={
                                        optionIndex
                                      }
                                    >
                                      <span className="font-semibold">
                                        {String.fromCharCode(
                                          65 +
                                            optionIndex
                                        )}
                                        .
                                      </span>{" "}
                                      {option}
                                    </div>
                                  )
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-4 align-top font-semibold text-emerald-600 dark:text-emerald-400">
                              {Number.isInteger(
                                question.correctAnswer
                              ) &&
                              question.correctAnswer >=
                                0 &&
                              question.correctAnswer <=
                                3
                                ? String.fromCharCode(
                                    65 +
                                      question.correctAnswer
                                  )
                                : "Invalid"}
                            </td>

                            <td className="px-4 py-4 align-top text-slate-600 dark:text-slate-400">
                              {question.exam}
                            </td>

                            <td className="px-4 py-4 align-top text-slate-600 dark:text-slate-400">
                              {question.subject}
                            </td>

                            <td className="px-4 py-4 align-top">
                              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {
                                  question.difficulty
                                }
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>

              {/* IMPORT */}
              <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  <p>
                    All validation checks passed.
                  </p>

                  <p className="mt-1 text-xs">
                    These questions are ready to
                    be imported into MongoDB.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={importQuestions}
                  disabled={importing}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {importing ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload size={17} />
                      Import to MongoDB
                    </>
                  )}
                </button>
              </div>
            </section>
          )}

        {/* RESULT */}
        {importResult && (
          <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-emerald-900 dark:text-emerald-300">
                  Import Completed
                </h2>

                <div className="mt-2 space-y-1 text-sm text-emerald-800 dark:text-emerald-400">
                  <p>
                    Inserted:{" "}
                    <strong>
                      {
                        importResult.insertedCount
                      }
                    </strong>
                  </p>

                  <p>
                    Skipped:{" "}
                    <strong>
                      {
                        importResult.skippedCount
                      }
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

