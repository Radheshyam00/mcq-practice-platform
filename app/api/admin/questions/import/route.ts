import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { Exam } from "@/models/Exam";

import {
  ImportQuestion,
  validateImportRows,
} from "@/lib/question-import";

const MAX_IMPORT_ROWS = 1000;

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
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
          message: "Admin access required.",
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

function normalizeText(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: Request) {
  try {
    /*
     * -----------------------------------------
     * ADMIN AUTHENTICATION
     * -----------------------------------------
     */

    const auth = await requireAdmin();

    if (!auth.authorized) {
      return auth.response;
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
     * VALIDATE CSV / JSON ROWS
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

    if (action === "validate") {
      return NextResponse.json({
        success: validation.errors.length === 0,
        valid: validation.errors.length === 0,
        total: rows.length,
        validCount: validation.questions.length,
        errorCount: validation.errors.length,
        questions: validation.questions,
        errors: validation.errors,
      });
    }

    /*
     * -----------------------------------------
     * IMPORT ACTION
     * -----------------------------------------
     */

    if (action !== "import") {
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
     * STOP IF VALIDATION ERRORS EXIST
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

    await connectDB();

    const questions =
      validation.questions as ImportQuestion[];

    /*
     * -----------------------------------------
     * LOAD ALL EXAMS
     * -----------------------------------------
     *
     * Subjects are embedded inside Exam.
     */

    const exams = await Exam.find(
      {},
      {
        _id: 1,
        name: 1,
        slug: 1,
        subjects: 1,
      }
    ).lean();

    /*
     * -----------------------------------------
     * BUILD EXAM LOOKUP
     * -----------------------------------------
     */

    const examMap = new Map<
      string,
      (typeof exams)[number]
    >();

    for (const exam of exams) {
      examMap.set(
        normalizeText(exam.name),
        exam
      );

      examMap.set(
        normalizeText(exam.slug),
        exam
      );
    }

    /*
     * -----------------------------------------
     * CONVERT IMPORT ROWS
     * TO MONGODB QUESTIONS
     * -----------------------------------------
     */

    const preparedQuestions: Array<
      Record<string, unknown>
    > = [];

    const mappingErrors: Array<{
      row: number;
      message: string;
    }> = [];

    /*
     * Track duplicates inside the
     * current import file itself.
     */
    const importKeys = new Set<string>();

    for (let index = 0; index < questions.length; index++) {
      const item = questions[index];

      const rowNumber = index + 1;

      const examName = normalizeText(item.exam);
      const subjectName = normalizeText(
        item.subject
      );

      /*
       * Find exam by name OR slug.
       */
      const exam = examMap.get(examName);

      if (!exam) {
        mappingErrors.push({
          row: rowNumber,
          message: `Exam "${item.exam}" was not found in MongoDB.`,
        });

        continue;
      }

      /*
       * Find subject inside selected exam.
       */
      const subject = exam.subjects.find(
        (subjectItem: {
          name?: string;
          slug?: string;
        }) =>
          normalizeText(subjectItem.name ?? "") ===
            subjectName ||
          normalizeText(subjectItem.slug ?? "") ===
            subjectName
      );

      if (!subject) {
        mappingErrors.push({
          row: rowNumber,
          message: `Subject "${item.subject}" was not found inside exam "${exam.name}".`,
        });

        continue;
      }

      /*
       * ---------------------------------------
       * DUPLICATE KEY
       * ---------------------------------------
       *
       * exam + question
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
       * PREPARE MONGODB DOCUMENT
       * ---------------------------------------
       */

      preparedQuestions.push({
        question: String(
          item.question
        ).trim(),

        options: item.options.map(
          (option: string) =>
            String(option).trim()
        ),

        correctAnswer: Number(
          item.correctAnswer
        ),

        explanation:
          typeof item.explanation === "string"
            ? item.explanation.trim()
            : "",

        /*
         * New MongoDB relationships
         */
        examId: exam._id,

        subjectId: subject._id,

        /*
         * Keep old fields temporarily
         * for compatibility.
         */
        exam: exam.name,

        subject: subject.name,

        topic: String(item.topic).trim(),

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
          validCount: validation.questions.length,
          mappedCount: preparedQuestions.length,
          errorCount: mappingErrors.length,
        },
        { status: 400 }
      );
    }

    /*
     * -----------------------------------------
     * FIND EXISTING QUESTIONS
     * -----------------------------------------
     *
     * Duplicate detection now uses:
     *
     * examId + question
     *
     * instead of:
     *
     * exam + question
     */

    const duplicateConditions =
      preparedQuestions.map((item) => ({
        examId: item.examId,
        question: item.question,
      }));

    const existing =
      duplicateConditions.length > 0
        ? await Question.find(
            {
              $or: duplicateConditions,
            },
            {
              examId: 1,
              question: 1,
            }
          ).lean()
        : [];

    /*
     * -----------------------------------------
     * CREATE EXISTING KEY SET
     * -----------------------------------------
     */

    const existingKeys = new Set(
      existing.map(
        (item) =>
          `${String(
            item.examId
          )}::${normalizeText(item.question)}`
      )
    );

    /*
     * -----------------------------------------
     * REMOVE EXISTING QUESTIONS
     * -----------------------------------------
     */

    const newQuestions =
      preparedQuestions.filter((item) => {
        const key =
          `${String(
            item.examId
          )}::${normalizeText(item.question)}`;

        return !existingKeys.has(key);
      });

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

      insertedCount = inserted.length;
    }

    /*
     * -----------------------------------------
     * SKIPPED
     * -----------------------------------------
     */

    const skippedCount =
      questions.length - insertedCount;

    return NextResponse.json({
      success: true,

      message:
        "Questions imported successfully.",

      total: questions.length,

      insertedCount,

      skippedCount,

      duplicateCount:
        preparedQuestions.length -
        insertedCount,

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