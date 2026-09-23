import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { Exam } from "@/models/Exam";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * Check whether the current user is an admin.
 */
async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      authorized: false,
      status: 401,
      message: "Unauthorized. Please log in.",
    };
  }

  if (session.user.role !== "admin") {
    return {
      authorized: false,
      status: 403,
      message: "Forbidden. Admin access required.",
    };
  }

  return {
    authorized: true,
    status: 200,
    message: "",
  };
}

/**
 * Convert different boolean representations into
 * a real boolean.
 */
function parseBoolean(
  value: unknown,
  defaultValue: boolean
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  if (typeof value === "string") {
    const normalized = value
      .trim()
      .toLowerCase();

    if (
      normalized === "true" ||
      normalized === "1" ||
      normalized === "yes" ||
      normalized === "y"
    ) {
      return true;
    }

    if (
      normalized === "false" ||
      normalized === "0" ||
      normalized === "no" ||
      normalized === "n"
    ) {
      return false;
    }
  }

  return defaultValue;
}

/**
 * GET /api/admin/questions/[id]
 *
 * Get a single question.
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const admin = await checkAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: admin.message,
        },
        {
          status: admin.status,
        }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Question ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid question ID.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const question =
      await Question.findById(id).lean();

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: "Question not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      question,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/questions/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch question.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * PUT /api/admin/questions/[id]
 *
 * Update a question.
 *
 * Correct answer convention:
 *
 * A = 0
 * B = 1
 * C = 2
 * D = 3
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const admin = await checkAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: admin.message,
        },
        {
          status: admin.status,
        }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Question ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid question ID.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !body ||
      typeof body !== "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    const data = body as Record<
      string,
      unknown
    >;

    /**
     * -----------------------------------------
     * Basic fields
     * -----------------------------------------
     */
    const question =
      typeof data.question === "string"
        ? data.question.trim()
        : "";

    const explanation =
      typeof data.explanation === "string"
        ? data.explanation.trim()
        : "";

    const examId =
      typeof data.examId === "string"
        ? data.examId.trim()
        : "";

    const subjectId =
      typeof data.subjectId === "string"
        ? data.subjectId.trim()
        : "";

    const topic =
      typeof data.topic === "string"
        ? data.topic.trim()
        : "";

    const difficulty =
      typeof data.difficulty === "string"
        ? data.difficulty.trim()
        : "Medium";

    /**
     * -----------------------------------------
     * Validate question
     * -----------------------------------------
     */
    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Question is required.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * -----------------------------------------
     * Validate options
     * -----------------------------------------
     */
    if (
      !Array.isArray(data.options)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Options must be an array.",
        },
        {
          status: 400,
        }
      );
    }

    if (data.options.length !== 4) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Exactly 4 options are required.",
        },
        {
          status: 400,
        }
      );
    }

    const cleanOptions =
      data.options.map((option) =>
        typeof option === "string"
          ? option.trim()
          : ""
      );

    const hasEmptyOption =
      cleanOptions.some(
        (option) => !option
      );

    if (hasEmptyOption) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All 4 options are required.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * -----------------------------------------
     * Validate correctAnswer
     * -----------------------------------------
     *
     * Accept a number or numeric string from
     * the frontend, then normalize it.
     *
     * A = 0
     * B = 1
     * C = 2
     * D = 3
     */
    const rawCorrectAnswer =
      data.correctAnswer;

    let parsedCorrectAnswer: number;

    if (
      typeof rawCorrectAnswer === "number"
    ) {
      parsedCorrectAnswer =
        rawCorrectAnswer;
    } else if (
      typeof rawCorrectAnswer === "string" &&
      rawCorrectAnswer.trim() !== ""
    ) {
      parsedCorrectAnswer = Number(
        rawCorrectAnswer.trim()
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            "Correct answer is required. Select A, B, C, or D.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(
        parsedCorrectAnswer
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Correct answer must be an integer.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      parsedCorrectAnswer < 0 ||
      parsedCorrectAnswer > 3
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Correct answer must be between 0 and 3. A=0, B=1, C=2, D=3.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * -----------------------------------------
     * Validate examId
     * -----------------------------------------
     */
    if (!examId) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        examId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * -----------------------------------------
     * Validate subjectId
     * -----------------------------------------
     */
    if (!subjectId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Subject is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        subjectId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid subject ID.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * -----------------------------------------
     * Validate topic
     * -----------------------------------------
     */
    if (!topic) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Topic is required.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * -----------------------------------------
     * Validate difficulty
     * -----------------------------------------
     */
    if (
      !["Easy", "Medium", "Hard"].includes(
        difficulty
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Difficulty must be Easy, Medium, or Hard.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * -----------------------------------------
     * Find selected exam
     * -----------------------------------------
     */
    const exam =
      await Exam.findById(examId).lean();

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected exam was not found.",
        },
        {
          status: 404,
        }
      );
    }

    /**
     * -----------------------------------------
     * Find selected subject inside exam
     * -----------------------------------------
     */
    const subjects: Array<{
      _id?: string | { toString(): string };
      name?: string;
    }> = Array.isArray(exam.subjects)
      ? exam.subjects
      : [];

    const subject = subjects.find(
      (item: {
        _id?: string | { toString(): string };
        name?: string;
      }) =>
        String(item._id) === String(subjectId)
    );

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected subject was not found inside the selected exam.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * -----------------------------------------
     * Parse boolean fields
     * -----------------------------------------
     */
    const isDailyQuiz = parseBoolean(
      data.isDailyQuiz,
      false
    );

    const isActive = parseBoolean(
      data.isActive,
      true
    );

    /**
     * -----------------------------------------
     * Update question
     * -----------------------------------------
     */
    const updatedQuestion =
      await Question.findByIdAndUpdate(
        id,
        {
          $set: {
            question,

            options: cleanOptions,

            /**
             * Always save numeric zero-based
             * answer index.
             *
             * A = 0
             * B = 1
             * C = 2
             * D = 3
             */
            correctAnswer:
              parsedCorrectAnswer,

            explanation,

            /**
             * New relationship fields.
             */
            examId: exam._id,

            subjectId:
              subject._id,

            /**
             * Legacy compatibility fields.
             */
            exam:
              typeof exam.name === "string"
                ? exam.name
                : "",

            subject:
              typeof subject.name ===
              "string"
                ? subject.name
                : "",

            topic,

            difficulty:
              difficulty as
                | "Easy"
                | "Medium"
                | "Hard",

            isDailyQuiz,

            isActive,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!updatedQuestion) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Question not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Question updated successfully.",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/questions/[id] error:",
      error
    );

    /**
     * Mongoose validation error.
     */
    if (
      error instanceof
      mongoose.Error.ValidationError
    ) {
      const messages = Object.values(
        error.errors
      ).map(
        (item) => item.message
      );

      return NextResponse.json(
        {
          success: false,
          message:
            messages.join(", ") ||
            "Question validation failed.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Invalid ObjectId.
     */
    if (
      error instanceof
      mongoose.Error.CastError
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid question, exam, or subject ID.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update question.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * DELETE /api/admin/questions/[id]
 *
 * Delete a question.
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const admin = await checkAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: admin.message,
        },
        {
          status: admin.status,
        }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Question ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid question ID.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const deletedQuestion =
      await Question.findByIdAndDelete(id).lean();

    if (!deletedQuestion) {
      return NextResponse.json(
        {
          success: false,
          message: "Question not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Question deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/questions/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete question.",
      },
      {
        status: 500,
      }
    );
  }
}