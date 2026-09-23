// app/api/admin/questions/import/route.ts

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { Exam } from "@/models/Exam";

import {
  validateImportRows,
  type ImportQuestion,
} from "@/lib/question-import";

type ImportAction = "validate" | "import";

type ImportRequestBody = {
  action?: ImportAction;
  questions?: Record<string, unknown>[];
};

type ExamSubject = {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug?: string;
};

type ExamDocument = {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug?: string;
  subjects?: ExamSubject[];
};

/**
 * Check whether the current user is an admin.
 */
async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "admin") {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Forbidden. Admin access required.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    response: null,
  };
}

/**
 * Safely convert a value to a string.
 */
function clean(value: unknown): string {
  return String(value ?? "").trim();
}

/**
 * Check whether a value is a valid ObjectId.
 */
function isValidObjectId(value: unknown): boolean {
  return (
    typeof value === "string" &&
    mongoose.Types.ObjectId.isValid(value)
  );
}

/**
 * Normalize a string for matching.
 */
function normalizeText(value: unknown): string {
  return clean(value)
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Find an exam by:
 * - MongoDB _id
 * - exact name
 * - slug
 */
function findExam(
  exams: ExamDocument[],
  value: string
): ExamDocument | null {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  const byId = exams.find(
    (exam) =>
      exam._id.toString() === value
  );

  if (byId) {
    return byId;
  }

  const bySlug = exams.find(
    (exam) =>
      normalizeText(exam.slug) === normalized
  );

  if (bySlug) {
    return bySlug;
  }

  const byName = exams.find(
    (exam) =>
      normalizeText(exam.name) === normalized
  );

  return byName ?? null;
}

/**
 * Find a subject inside an exam.
 *
 * Supports:
 * - subject _id
 * - subject name
 * - subject slug
 */
function findSubject(
  exam: ExamDocument,
  value: string
): ExamSubject | null {
  const subjects = exam.subjects ?? [];

  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  const byId = subjects.find(
    (subject) =>
      subject._id.toString() === value
  );

  if (byId) {
    return byId;
  }

  const bySlug = subjects.find(
    (subject) =>
      normalizeText(subject.slug) === normalized
  );

  if (bySlug) {
    return bySlug;
  }

  const byName = subjects.find(
    (subject) =>
      normalizeText(subject.name) === normalized
  );

  return byName ?? null;
}

/**
 * Build a clean MongoDB document.
 */
function buildQuestionDocument(
  item: ImportQuestion,
  exam: ExamDocument,
  subject: ExamSubject
) {
  const parsedCorrectAnswer = Number(
    item.correctAnswer
  );

  return {
    question: item.question.trim(),

    options: [
      item.options[0].trim(),
      item.options[1].trim(),
      item.options[2].trim(),
      item.options[3].trim(),
    ],

    // Canonical representation:
    // A = 0
    // B = 1
    // C = 2
    // D = 3
    correctAnswer: parsedCorrectAnswer,

    explanation: item.explanation.trim(),

    // New MongoDB relationships.
    examId: exam._id,
    subjectId: subject._id,

    // Legacy compatibility fields.
    exam: exam.name,
    subject: subject.name,

    topic: item.topic.trim(),

    difficulty: item.difficulty,

    isDailyQuiz: Boolean(item.isDailyQuiz),

    isActive: item.isActive !== false,
  };
}

/**
 * POST /api/admin/questions/import
 *
 * action = validate
 * action = import
 */
export async function POST(
  request: NextRequest
) {
  try {
    const adminCheck = await checkAdmin();

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await connectDB();

    let body: ImportRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const action = body.action;

    if (
      action !== "validate" &&
      action !== "import"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid action. Use "validate" or "import".',
        },
        { status: 400 }
      );
    }

    const rows = Array.isArray(body.questions)
      ? body.questions
      : [];

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No questions were provided.",
        },
        { status: 400 }
      );
    }

    if (rows.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Maximum 1000 questions can be imported at once.",
        },
        { status: 400 }
      );
    }

    /**
     * First validate and normalize all rows.
     */
    const validation = validateImportRows(rows);

    /**
     * Validation-only request.
     *
     * Important:
     * The frontend preview gets canonical correctAnswer values
     * as 0, 1, 2, or 3.
     */
    if (action === "validate") {
      return NextResponse.json({
        success: validation.errors.length === 0,
        action: "validate",
        questions: validation.questions,
        errors: validation.errors,
        totalRows: rows.length,
        validRows: validation.questions.length,
        errorCount: validation.errors.length,
      });
    }

    /**
     * Do not import anything when validation has errors.
     */
    if (validation.errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          action: "import",
          message:
            "Import blocked because validation errors were found.",
          questions: validation.questions,
          errors: validation.errors,
          totalRows: rows.length,
          validRows: validation.questions.length,
          errorCount: validation.errors.length,
        },
        { status: 400 }
      );
    }

    /**
     * Load exams once.
     *
     * We need subjects embedded inside each exam because
     * Question.subjectId must belong to Question.examId.
     */
    const exams = (await Exam.find({})
      .select("_id name slug subjects")
      .lean()) as unknown as ExamDocument[];

    if (exams.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No exams are available. Create an exam before importing questions.",
        },
        { status: 400 }
      );
    }

    const preparedDocuments: ReturnType<
      typeof buildQuestionDocument
    >[] = [];

    const mappingErrors = [];

    /**
     * Resolve exam + subject for every validated question.
     */
    for (let index = 0; index < validation.questions.length; index++) {
      const item = validation.questions[index];

      const exam = findExam(
        exams,
        item.exam
      );

      if (!exam) {
        mappingErrors.push({
          row: index + 2,
          field: "exam",
          message: `Exam "${item.exam}" was not found.`,
        });

        continue;
      }

      const subject = findSubject(
        exam,
        item.subject
      );

      if (!subject) {
        mappingErrors.push({
          row: index + 2,
          field: "subject",
          message:
            `Subject "${item.subject}" was not found inside exam "${exam.name}".`,
        });

        continue;
      }

      /**
       * Final defensive validation before MongoDB.
       */
      const correctAnswer = Number(
        item.correctAnswer
      );

      if (
        !Number.isInteger(correctAnswer) ||
        correctAnswer < 0 ||
        correctAnswer > 3
      ) {
        mappingErrors.push({
          row: index + 2,
          field: "correctAnswer",
          message:
            "Correct answer must be an integer from 0 to 3.",
        });

        continue;
      }

      preparedDocuments.push(
        buildQuestionDocument(
          item,
          exam,
          subject
        )
      );
    }

    /**
     * Mapping errors must also block import.
     */
    if (mappingErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          action: "import",
          message:
            "Import blocked because exam or subject mapping failed.",
          errors: mappingErrors,
          totalRows: rows.length,
          validRows: validation.questions.length,
          preparedRows: preparedDocuments.length,
          errorCount: mappingErrors.length,
        },
        { status: 400 }
      );
    }

    /**
     * Final defensive validation of every document.
     */
    for (let index = 0; index < preparedDocuments.length; index++) {
      const document =
        preparedDocuments[index];

      if (
        !document.examId ||
        !isValidObjectId(
          document.examId.toString()
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              `Invalid examId generated for row ${index + 2}.`,
          },
          { status: 400 }
        );
      }

      if (
        !document.subjectId ||
        !isValidObjectId(
          document.subjectId.toString()
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              `Invalid subjectId generated for row ${index + 2}.`,
          },
          { status: 400 }
        );
      }

      if (
        !Array.isArray(document.options) ||
        document.options.length !== 4
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              `Question on row ${index + 2} must have exactly 4 options.`,
          },
          { status: 400 }
        );
      }

      if (
        !Number.isInteger(
          document.correctAnswer
        ) ||
        document.correctAnswer < 0 ||
        document.correctAnswer > 3
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              `Question on row ${index + 2} has an invalid correctAnswer.`,
          },
          { status: 400 }
        );
      }
    }

    /**
     * Avoid inserting duplicate questions that already exist
     * in MongoDB.
     *
     * Duplicate identity:
     * same exam + normalized question text.
     */
    const duplicateKeys = new Set<string>();

    const existingQuestions =
      await Question.find({
        examId: {
          $in: preparedDocuments.map(
            (item) => item.examId
          ),
        },
      })
        .select("_id examId question")
        .lean();

    for (const existing of existingQuestions) {
      const key =
        `${existing.examId.toString()}::${normalizeText(
          existing.question
        )}`;

      duplicateKeys.add(key);
    }

    const documentsToInsert =
      preparedDocuments.filter((document) => {
        const key =
          `${document.examId.toString()}::${normalizeText(
            document.question
          )}`;

        if (duplicateKeys.has(key)) {
          return false;
        }

        /**
         * Prevent duplicates inside the same import batch.
         */
        duplicateKeys.add(key);

        return true;
      });

    /**
     * Nothing new to insert.
     */
    if (documentsToInsert.length === 0) {
      return NextResponse.json({
        success: true,
        action: "import",
        message:
          "No new questions were imported. All questions already exist.",
        imported: 0,
        skipped: preparedDocuments.length,
        totalRows: rows.length,
      });
    }

    /**
     * Insert all documents.
     */
    const inserted =
      await Question.insertMany(
        documentsToInsert,
        {
          ordered: true,
        }
      );

    return NextResponse.json({
      success: true,
      action: "import",
      message: `${inserted.length} question(s) imported successfully.`,
      imported: inserted.length,
      skipped:
        preparedDocuments.length -
        inserted.length,
      totalRows: rows.length,
    });
  } catch (error) {
    console.error(
      "POST /api/admin/questions/import error:",
      error
    );

    if (
      error instanceof mongoose.Error.ValidationError
    ) {
      const validationErrors = Object.values(
        error.errors
      ).map((item) => ({
        field: item.path,
        message: item.message,
      }));

      return NextResponse.json(
        {
          success: false,
          error:
            "MongoDB validation failed.",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    if (
      error instanceof mongoose.Error.CastError
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid MongoDB ID encountered while importing questions.",
          field: error.path,
          value: error.value,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to import questions.",
      },
      { status: 500 }
    );
  }
}