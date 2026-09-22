import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { Exam } from "@/models/Exam";

import {
  ImportQuestion,
  validateImportRows,
} from "@/lib/question-import";

const MAX_IMPORT_ROWS = 1000;

type ExamSubject = {
  _id?: unknown;
  name?: string;
  slug?: string;
};

type ExamDocument = {
  _id: unknown;
  name?: string;
  slug?: string;
  subjects?: ExamSubject[];
};

async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required.",
      },
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Admin access required.",
      },
      { status: 403 }
    );
  }

  return null;
}

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeId(value: unknown): string {
  return String(value ?? "").trim();
}

/*
 * Find exam by:
 * 1. MongoDB _id
 * 2. name
 * 3. slug
 */
function findExam(
  exams: ExamDocument[],
  value: unknown
): ExamDocument | null {
  const search = normalizeText(value);

  if (!search) {
    return null;
  }

  for (const exam of exams) {
    if (normalizeId(exam._id) === String(value).trim()) {
      return exam;
    }

    if (
      normalizeText(exam.name) === search ||
      normalizeText(exam.slug) === search
    ) {
      return exam;
    }
  }

  return null;
}

/*
 * Find subject inside selected exam by:
 * 1. MongoDB _id
 * 2. name
 * 3. slug
 */
function findSubject(
  exam: ExamDocument,
  value: unknown
): ExamSubject | null {
  const search = normalizeText(value);

  if (!search) {
    return null;
  }

  const subjects = Array.isArray(exam.subjects)
    ? exam.subjects
    : [];

  for (const subject of subjects) {
    if (
      normalizeId(subject._id) ===
      String(value).trim()
    ) {
      return subject;
    }

    if (
      normalizeText(subject.name) === search ||
      normalizeText(subject.slug) === search
    ) {
      return subject;
    }
  }

  return null;
}

function getExamSuggestions(
  exams: ExamDocument[]
) {
  return exams.map((exam) => ({
    id: String(exam._id),
    name: exam.name ?? "",
    slug: exam.slug ?? "",
  }));
}

function getSubjectSuggestions(
  exam: ExamDocument | null
) {
  if (!exam || !Array.isArray(exam.subjects)) {
    return [];
  }

  return exam.subjects.map((subject) => ({
    id: String(subject._id ?? ""),
    name: subject.name ?? "",
    slug: subject.slug ?? "",
  }));
}

export async function POST(
  request: Request
): Promise<Response> {
  try {
    /*
     * -----------------------------------------
     * ADMIN AUTHENTICATION
     * -----------------------------------------
     */

    const authResponse = await requireAdmin();

    if (authResponse) {
      return authResponse;
    }

    /*
     * -----------------------------------------
     * REQUEST BODY
     * -----------------------------------------
     */

    const body = await request.json();

    const action = body?.action;
    const rows = body?.questions;

    if (!Array.isArray(rows)) {
      return NextResponse.json(
        {
          success: false,
          message: "questions must be an array.",
        },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No questions found.",
        },
        { status: 400 }
      );
    }

    if (rows.length > MAX_IMPORT_ROWS) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum ${MAX_IMPORT_ROWS} questions can be imported at once.`,
        },
        { status: 400 }
      );
    }

    /*
     * -----------------------------------------
     * LOCAL VALIDATION
     * -----------------------------------------
     */

    const validation = validateImportRows(
      rows as Record<string, unknown>[]
    );

    /*
     * -----------------------------------------
     * VALIDATE ACTION
     * -----------------------------------------
     */

    if (
      action !== "validate" &&
      action !== "import"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Invalid action. Use "validate" or "import".',
        },
        { status: 400 }
      );
    }

    /*
     * -----------------------------------------
     * DATABASE CONNECTION
     * -----------------------------------------
     *
     * We load exams during BOTH validation
     * and import so that the frontend can show
     * useful mapping errors before importing.
     */

    await connectDB();

    const exams = (await Exam.find(
      {},
      {
        _id: 1,
        name: 1,
        slug: 1,
        subjects: 1,
      }
    ).lean()) as unknown as ExamDocument[];

    /*
     * -----------------------------------------
     * VALIDATION ACTION
     * -----------------------------------------
     */

    if (action === "validate") {
      const mappingErrors: Array<{
        row: number;
        field: string;
        message: string;
        suggestion?: string;
      }> = [];

      /*
       * Only perform DB mapping when the row
       * itself passed basic validation.
       */

      for (
        let index = 0;
        index < validation.questions.length;
        index++
      ) {
        const item =
          validation.questions[index];

        /*
         * Find original row number.
         *
         * validateImportRows uses:
         * index + 2
         */

        const rowNumber = index + 2;

        const exam = findExam(
          exams,
          item.exam
        );

        if (!exam) {
          mappingErrors.push({
            row: rowNumber,
            field: "exam",
            message: `Exam "${item.exam}" was not found in MongoDB.`,
            suggestion:
              "Use an existing exam name or slug from the exam list.",
          });

          continue;
        }

        const subject = findSubject(
          exam,
          item.subject
        );

        if (!subject) {
          const availableSubjects =
            getSubjectSuggestions(exam);

          const subjectNames =
            availableSubjects
              .map((item) => item.name)
              .filter(Boolean)
              .slice(0, 10)
              .join(", ");

          mappingErrors.push({
            row: rowNumber,
            field: "subject",
            message: `Subject "${item.subject}" was not found inside exam "${exam.name}".`,
            suggestion: subjectNames
              ? `Use one of these subjects: ${subjectNames}`
              : "Add a subject to this exam first.",
          });
        }
      }

      const allErrors = [
        ...validation.errors,
        ...mappingErrors,
      ];

      return NextResponse.json({
        success: allErrors.length === 0,
        valid: allErrors.length === 0,

        total: rows.length,

        validCount:
          validation.questions.length,

        errorCount: allErrors.length,

        questions: validation.questions,

        errors: allErrors,

        /*
         * Useful for the frontend editor.
         */

        exams: getExamSuggestions(exams),

        subjectsByExam: Object.fromEntries(
          exams.map((exam) => [
            String(exam._id),
            getSubjectSuggestions(exam),
          ])
        ),
      });
    }

    /*
     * -----------------------------------------
     * IMPORT ACTION
     * -----------------------------------------
     */

    if (validation.errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Import blocked because validation errors exist.",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const questions =
      validation.questions as ImportQuestion[];

    /*
     * -----------------------------------------
     * BUILD EXAM LOOKUP
     * -----------------------------------------
     */

    const examMap = new Map<
      string,
      ExamDocument
    >();

    for (const exam of exams) {
      if (exam.name) {
        examMap.set(
          normalizeText(exam.name),
          exam
        );
      }

      if (exam.slug) {
        examMap.set(
          normalizeText(exam.slug),
          exam
        );
      }

      examMap.set(
        normalizeId(exam._id),
        exam
      );
    }

    /*
     * -----------------------------------------
     * PREPARE QUESTIONS
     * -----------------------------------------
     */

    const preparedQuestions: Array<
      Record<string, unknown>
    > = [];

    const mappingErrors: Array<{
      row: number;
      field: string;
      message: string;
      suggestion?: string;
    }> = [];

    /*
     * Duplicate questions inside current
     * import file.
     */

    const importKeys = new Set<string>();

    for (
      let index = 0;
      index < questions.length;
      index++
    ) {
      const item = questions[index];

      /*
       * IMPORTANT:
       *
       * validation row numbers start at 2.
       */

      const rowNumber = index + 2;

      const examValue = normalizeText(
        item.exam
      );

      const exam =
        examMap.get(examValue);

      if (!exam) {
        mappingErrors.push({
          row: rowNumber,
          field: "exam",
          message: `Exam "${item.exam}" was not found in MongoDB.`,
          suggestion:
            "Use an existing exam name, slug, or MongoDB exam ID.",
        });

        continue;
      }

      /*
       * ---------------------------------------
       * SUBJECT
       * ---------------------------------------
       */

      const subject =
        findSubject(
          exam,
          item.subject
        );

      if (!subject) {
        const availableSubjects =
          getSubjectSuggestions(exam);

        const subjectNames =
          availableSubjects
            .map((item) => item.name)
            .filter(Boolean)
            .slice(0, 10)
            .join(", ");

        mappingErrors.push({
          row: rowNumber,
          field: "subject",
          message: `Subject "${item.subject}" was not found inside exam "${exam.name}".`,
          suggestion: subjectNames
            ? `Available subjects: ${subjectNames}`
            : "Add this subject to the selected exam first.",
        });

        continue;
      }

      /*
       * ---------------------------------------
       * DUPLICATE KEY
       * ---------------------------------------
       */

      const duplicateKey =
        `${String(exam._id)}::${normalizeText(
          item.question
        )}`;

      if (importKeys.has(duplicateKey)) {
        continue;
      }

      importKeys.add(duplicateKey);

      /*
       * ---------------------------------------
       * PREPARE DOCUMENT
       * ---------------------------------------
       */

      preparedQuestions.push({
        question:
          String(item.question).trim(),

        options: item.options.map(
          (option: string) =>
            String(option).trim()
        ),

        correctAnswer: Number(
          item.correctAnswer
        ),

        explanation:
          typeof item.explanation ===
          "string"
            ? item.explanation.trim()
            : "",

        /*
         * MongoDB relationships
         */

        examId: exam._id,

        subjectId: subject._id,

        /*
         * Backward compatibility
         */

        exam:
          exam.name ??
          String(item.exam).trim(),

        subject:
          subject.name ??
          String(item.subject).trim(),

        topic:
          String(item.topic).trim(),

        difficulty:
          item.difficulty || "Medium",

        isDailyQuiz:
          Boolean(item.isDailyQuiz),

        isActive:
          item.isActive !== false,
      });
    }

    /*
     * -----------------------------------------
     * MAPPING ERRORS
     * -----------------------------------------
     */

    if (mappingErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Some questions could not be mapped to existing exams or subjects.",

          errors: mappingErrors,

          total: questions.length,

          validCount:
            validation.questions.length,

          mappedCount:
            preparedQuestions.length,

          errorCount:
            mappingErrors.length,

          /*
           * Send available values to the editor.
           */

          exams: getExamSuggestions(exams),

          subjectsByExam: Object.fromEntries(
            exams.map((exam) => [
              String(exam._id),
              getSubjectSuggestions(exam),
            ])
          ),
        },
        { status: 400 }
      );
    }

    /*
     * -----------------------------------------
     * FIND EXISTING QUESTIONS
     * -----------------------------------------
     */

    const duplicateConditions =
      preparedQuestions.map(
        (item) => ({
          examId: item.examId,
          question: item.question,
        })
      );

    const existing =
      duplicateConditions.length > 0
        ? await Question.find(
            {
              $or:
                duplicateConditions,
            },
            {
              examId: 1,
              question: 1,
            }
          ).lean()
        : [];

    /*
     * -----------------------------------------
     * EXISTING KEY SET
     * -----------------------------------------
     */

    const existingKeys =
      new Set(
        existing.map(
          (item) =>
            `${String(
              item.examId
            )}::${normalizeText(
              item.question
            )}`
        )
      );

    /*
     * -----------------------------------------
     * REMOVE EXISTING QUESTIONS
     * -----------------------------------------
     */

    const newQuestions =
      preparedQuestions.filter(
        (item) => {
          const key =
            `${String(
              item.examId
            )}::${normalizeText(
              item.question
            )}`;

          return !existingKeys.has(
            key
          );
        }
      );

    /*
     * -----------------------------------------
     * INSERT
     * -----------------------------------------
     */

    let insertedCount = 0;

    if (newQuestions.length > 0) {
      const inserted =
        await Question.insertMany(
          newQuestions,
          {
            ordered: true,
          }
        );

      insertedCount =
        inserted.length;
    }

    /*
     * -----------------------------------------
     * SKIPPED
     * -----------------------------------------
     */

    const skippedCount =
      questions.length -
      insertedCount;

    const duplicateCount =
      preparedQuestions.length -
      insertedCount;

    /*
     * -----------------------------------------
     * SUCCESS
     * -----------------------------------------
     */

    return NextResponse.json({
      success: true,

      message:
        "Questions imported successfully.",

      total: questions.length,

      insertedCount,

      skippedCount,

      duplicateCount,

      mappedCount:
        preparedQuestions.length,
    });
  } catch (error) {
    console.error(
      "QUESTION_IMPORT_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to import questions.",
      },
      { status: 500 }
    );
  }
}