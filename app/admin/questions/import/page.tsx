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
  useState,
} from "react";

import {
  ImportQuestion,
  ImportError,
  validateImportRows,
} from "@/lib/question-import";

type RawRow = Record<string, unknown>;

type CSVParserResult = {
  headers: string[];
  rows: RawRow[];
};

function parseCSV(text: string): CSVParserResult {
  const rows: string[][] = [];

  let current = "";
  let row: string[] = [];
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if (
      (char === "\n" || char === "\r") &&
      !insideQuotes
    ) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(current);
      current = "";

      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    current += char;
  }

  if (current !== "" || row.length > 0) {
    row.push(current);

    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  if (rows.length === 0) {
    return {
      headers: [],
      rows: [],
    };
  }

  const headers = rows[0].map((header) =>
    header.trim()
  );

  const dataRows = rows.slice(1);

  const objects = dataRows.map((values) => {
    const object: RawRow = {};

    headers.forEach((header, index) => {
      object[header] = values[index] ?? "";
    });

    return object;
  });

  return {
    headers,
    rows: objects,
  };
}

async function parseFile(
  file: File
): Promise<RawRow[]> {
  const text = await file.text();

  const extension =
    file.name.split(".").pop()?.toLowerCase();

  if (extension === "json") {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (
      parsed &&
      Array.isArray(parsed.questions)
    ) {
      return parsed.questions;
    }

    throw new Error(
      'JSON must contain an array or { "questions": [] }.'
    );
  }

  if (extension === "csv") {
    const result = parseCSV(text);
    return result.rows;
  }

  throw new Error(
    "Only CSV and JSON files are supported."
  );
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
    useState<{
      insertedCount: number;
      skippedCount: number;
    } | null>(null);

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setRows([]);
    setQuestions([]);
    setErrors([]);
    setMessage("");
    setErrorMessage("");
    setImportResult(null);

    try {
      const parsedRows =
        await parseFile(selectedFile);

      setRows(parsedRows);

      if (parsedRows.length === 0) {
        setErrorMessage(
          "The selected file does not contain any rows."
        );
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not read the file."
      );
    }
  };

  const validateQuestions = async () => {
    if (rows.length === 0) {
      setErrorMessage(
        "Please select a CSV or JSON file first."
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setErrorMessage("");
    setErrors([]);
    setQuestions([]);
    setImportResult(null);

    try {
      /*
       * Local validation first.
       */
      const localValidation =
        validateImportRows(rows);

      if (localValidation.errors.length > 0) {
        setErrors(localValidation.errors);
      }

      /*
       * Server-side validation.
       */
      const response = await fetch(
        "/api/admin/questions/import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "validate",
            questions: rows,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Validation failed."
        );
      }

      setQuestions(data.questions || []);
      setErrors(data.errors || []);

      if (
        data.errors?.length === 0
      ) {
        setMessage(
          `${data.validCount} questions are valid and ready to import.`
        );
      } else {
        setErrorMessage(
          `${data.errorCount} validation error(s) found.`
        );
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

  const importQuestions = async () => {
    if (questions.length === 0) {
      setErrorMessage(
        "There are no valid questions to import."
      );
      return;
    }

    if (errors.length > 0) {
      setErrorMessage(
        "Fix all validation errors before importing."
      );
      return;
    }

    setImporting(true);
    setMessage("");
    setErrorMessage("");
    setImportResult(null);

    try {
      const response = await fetch(
        "/api/admin/questions/import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "import",
            questions,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Import failed."
        );
      }

      setImportResult({
        insertedCount:
          data.insertedCount || 0,
        skippedCount:
          data.skippedCount || 0,
      });

      setMessage(
        "Import completed successfully."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Import failed."
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
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/questions"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Questions
            </Link>

            <h1 className="text-3xl font-black tracking-tight">
              Import Questions
            </h1>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Upload CSV or JSON questions, validate
              them, preview the data, and import into
              MongoDB.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-4">
          {[
            ["1", "Upload", "Select CSV / JSON"],
            ["2", "Validate", "Check question data"],
            ["3", "Preview", "Review questions"],
            ["4", "Import", "Save to MongoDB"],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-black text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                  {number}
                </div>

                <div>
                  <p className="font-bold">
                    {title}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5">
            <h2 className="text-xl font-black">
              Upload File
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Maximum 1000 questions per import.
            </p>
          </div>

          {!file ? (
            <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center transition hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-950/50 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/5">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <FileUp className="h-8 w-8" />
              </div>

              <h3 className="text-lg font-bold">
                Choose a CSV or JSON file
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Click here to browse your computer
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700">
                <Upload className="h-4 w-4" />
                Select File
              </span>

              <input
                type="file"
                accept=".csv,.json,application/json,text/csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {file.name
                      .toLowerCase()
                      .endsWith(".json") ? (
                      <FileJson className="h-6 w-6" />
                    ) : (
                      <FileSpreadsheet className="h-6 w-6" />
                    )}
                  </div>

                  <div>
                    <p className="font-bold">
                      {file.name}
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {(file.size / 1024).toFixed(
                        1
                      )}{" "}
                      KB · {rows.length} rows detected
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={validateQuestions}
              disabled={
                loading ||
                rows.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}

              {loading
                ? "Validating..."
                : "Validate & Preview"}
            </button>
          </div>
        </section>

        {/* Messages */}
        {message && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm font-semibold">
              {message}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm font-semibold">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Error list */}
        {errors.length > 0 && (
          <section className="mt-6 rounded-3xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-red-700 dark:text-red-400">
                  Validation Errors
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Fix these errors in your file and
                  validate again.
                </p>
              </div>

              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 dark:bg-red-500/10 dark:text-red-400">
                {errors.length} errors
              </span>
            </div>

            <div className="max-h-80 overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              {errors.map((error, index) => (
                <div
                  key={`${error.row}-${error.field}-${index}`}
                  className="flex gap-4 border-b border-slate-200 p-4 last:border-b-0 dark:border-slate-800"
                >
                  <span className="shrink-0 rounded-lg bg-red-100 px-2 py-1 text-xs font-black text-red-700 dark:bg-red-500/10 dark:text-red-400">
                    Row {error.row}
                  </span>

                  <div>
                    <p className="text-sm font-bold">
                      {error.field}
                    </p>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {error.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Preview */}
        {questions.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <div>
                <h2 className="text-xl font-black">
                  Question Preview
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Showing the first{" "}
                  {Math.min(
                    questions.length,
                    20
                  )}{" "}
                  questions.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {questions.length} Valid
                </span>

                {errors.length > 0 && (
                  <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-black text-red-700 dark:bg-red-500/10 dark:text-red-400">
                    {errors.length} Errors
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4">
                      #
                    </th>

                    <th className="px-6 py-4">
                      Question
                    </th>

                    <th className="px-6 py-4">
                      Exam
                    </th>

                    <th className="px-6 py-4">
                      Subject
                    </th>

                    <th className="px-6 py-4">
                      Topic
                    </th>

                    <th className="px-6 py-4">
                      Answer
                    </th>

                    <th className="px-6 py-4">
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
                          className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-slate-500">
                            {index + 1}
                          </td>

                          <td className="max-w-md px-6 py-4">
                            <p className="line-clamp-2 text-sm font-semibold">
                              {
                                question.question
                              }
                            </p>

                            <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-slate-500 dark:text-slate-400">
                              {question.options.map(
                                (
                                  option,
                                  optionIndex
                                ) => (
                                  <span
                                    key={
                                      optionIndex
                                    }
                                  >
                                    {String.fromCharCode(
                                      65 +
                                        optionIndex
                                    )}
                                    .{" "}
                                    {option}
                                  </span>
                                )
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold">
                            {question.exam}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            {question.subject}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            {question.topic}
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                              {
                                String.fromCharCode(
                                  65 +
                                    question.correctAnswer
                                )
                              }
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold dark:bg-slate-800">
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

            {/* Import */}
            <div className="flex flex-col gap-4 border-t border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <div>
                <p className="font-bold">
                  Ready to import?
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Existing questions with the same
                  exam and question text will be
                  skipped.
                </p>
              </div>

              <button
                type="button"
                onClick={importQuestions}
                disabled={
                  importing ||
                  questions.length === 0 ||
                  errors.length > 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}

                {importing
                  ? "Importing..."
                  : `Import ${questions.length} Questions`}
              </button>
            </div>
          </section>
        )}

        {/* Result */}
        {importResult && (
          <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-black text-emerald-800 dark:text-emerald-300">
                  Import Complete
                </h2>

                <div className="mt-3 flex flex-wrap gap-3">
                  <span className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm dark:bg-slate-900 dark:text-white">
                    Inserted:{" "}
                    {
                      importResult.insertedCount
                    }
                  </span>

                  <span className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm dark:bg-slate-900 dark:text-white">
                    Skipped:{" "}
                    {
                      importResult.skippedCount
                    }
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}