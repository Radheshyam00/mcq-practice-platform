import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { Exam } from "@/models/Exam";

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
 * GET /api/admin/questions
 *
 * Supported query parameters:
 *
 * ?search=
 * ?examId=
 * ?subjectId=
 * ?topic=
 * ?difficulty=
 * ?isDailyQuiz=true
 * ?isActive=true
 */
export async function GET(request: NextRequest) {
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

    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const examId =
      searchParams.get("examId")?.trim() || "";

    const subjectId =
      searchParams
        .get("subjectId")
        ?.trim() || "";

    const topic =
      searchParams.get("topic")?.trim() || "";

    const difficulty =
      searchParams
        .get("difficulty")
        ?.trim() || "";

    const isDailyQuiz =
      searchParams.get("isDailyQuiz");

    const isActive =
      searchParams.get("isActive");

    const filter: Record<string, unknown> =
      {};

    /**
     * Search question text, exam name,
     * subject name and topic.
     */
    if (search) {
      filter.$or = [
        {
          question: {
            $regex: search,
            $options: "i",
          },
        },
        {
          exam: {
            $regex: search,
            $options: "i",
          },
        },
        {
          subject: {
            $regex: search,
            $options: "i",
          },
        },
        {
          topic: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /**
     * Filter by exam.
     */
    if (examId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          examId
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid examId.",
          },
          { status: 400 }
        );
      }

      filter.examId =
        new mongoose.Types.ObjectId(examId);
    }

    /**
     * Filter by subject.
     */
    if (subjectId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          subjectId
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid subjectId.",
          },
          { status: 400 }
        );
      }

      filter.subjectId =
        new mongoose.Types.ObjectId(
          subjectId
        );
    }

    /**
     * Filter by topic.
     */
    if (topic) {
      filter.topic = {
        $regex: topic,
        $options: "i",
      };
    }

    /**
     * Filter by difficulty.
     */
    if (
      difficulty &&
      ["Easy", "Medium", "Hard"].includes(
        difficulty
      )
    ) {
      filter.difficulty = difficulty;
    }

    /**
     * Filter by daily quiz.
     */
    if (isDailyQuiz === "true") {
      filter.isDailyQuiz = true;
    } else if (isDailyQuiz === "false") {
      filter.isDailyQuiz = false;
    }

    /**
     * Filter by active status.
     */
    if (isActive === "true") {
      filter.isActive = true;
    } else if (isActive === "false") {
      filter.isActive = false;
    }

    const questions =
      await Question.find(filter)
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      questions,
      count: questions.length,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/questions error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch questions.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST /api/admin/questions
 *
 * Creates a new question.
 *
 * Correct answer convention:
 *
 * A = 0
 * B = 1
 * C = 2
 * D = 3
 */
export async function POST(
  request: NextRequest
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

    const question =
      typeof data.question === "string"
        ? data.question.trim()
        : "";

    const options =
      Array.isArray(data.options)
        ? data.options
        : [];

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
     * Boolean values.
     *
     * Boolean("false") would incorrectly become true,
     * so explicitly handle string values as well.
     */
    const isDailyQuiz =
      data.isDailyQuiz === true ||
      data.isDailyQuiz === "true" ||
      data.isDailyQuiz === 1 ||
      data.isDailyQuiz === "1";

    const isActive =
      data.isActive === undefined
        ? true
        : data.isActive === true ||
          data.isActive === "true" ||
          data.isActive === 1 ||
          data.isActive === "1";

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
     * Validate exactly 4 options
     * -----------------------------------------
     */
    if (options.length !== 4) {
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
      options.map((option) =>
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
     * IMPORTANT:
     *
     * The entire application uses:
     *
     * A = 0
     * B = 1
     * C = 2
     * D = 3
     *
     * Convert the incoming value explicitly
     * because HTML forms can send numbers as
     * strings.
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

    /**
     * Must be an actual integer.
     */
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

    /**
     * Only 0–3 are valid.
     */
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
     * Find exam
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
     * Find subject inside selected exam
     * -----------------------------------------
     *
     * Your Subject records are embedded inside
     * Exam.subjects.
     */
    const subjects =
      Array.isArray(exam.subjects)
        ? exam.subjects
        : [];

    const subject =
      subjects.find(
        (item: { _id?: string | mongoose.Types.ObjectId }) =>
          String(item._id) ===
          String(subjectId)
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
     * Create question
     * -----------------------------------------
     */
    const newQuestion =
      await Question.create({
        question,

        options: cleanOptions,

        /**
         * ALWAYS save a number.
         *
         * A = 0
         * B = 1
         * C = 2
         * D = 3
         */
        correctAnswer:
          parsedCorrectAnswer,

        explanation,

        examId: exam._id,

        subjectId:
          subject._id,

        /**
         * Keep legacy fields for compatibility
         * with existing question-list/search code.
         */
        exam:
          typeof exam.name === "string"
            ? exam.name
            : "",

        subject:
          typeof subject.name === "string"
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
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Question created successfully.",
        question: newQuestion,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/questions error:",
      error
    );

    /**
     * Handle Mongoose validation errors
     * with a useful message.
     */
    if (
      error instanceof mongoose.Error.ValidationError
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
     * Handle duplicate key errors.
     */
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code ===
        11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A question with the same unique value already exists.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create question.",
      },
      {
        status: 500,
      }
    );
  }
}