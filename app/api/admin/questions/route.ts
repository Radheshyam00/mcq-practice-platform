import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { Exam } from "@/models/Exam";

/**
 * Check admin authentication
 */
async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  // Keep this as "admin" if your project only uses admin.
  // Add other roles only if you actually use them.
  if (session.user.role !== "admin") {
    return null;
  }

  return session;
}

/**
 * GET /api/admin/questions
 */
export async function GET(request: Request) {
  try {
    const session = await checkAdmin();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const examId = searchParams.get("examId")?.trim() || "";
    const subjectId = searchParams.get("subjectId")?.trim() || "";
    const topic = searchParams.get("topic")?.trim() || "";
    const difficulty = searchParams.get("difficulty")?.trim() || "";

    const isDailyQuiz = searchParams.get("isDailyQuiz");
    const isActive = searchParams.get("isActive");

    const filter: Record<string, unknown> = {};

    // Search
    if (search) {
      filter.question = {
        $regex: search,
        $options: "i",
      };
    }

    // Exam
    if (examId) {
      if (!mongoose.Types.ObjectId.isValid(examId)) {
        return NextResponse.json(
          { message: "Invalid exam ID" },
          { status: 400 }
        );
      }

      filter.examId = new mongoose.Types.ObjectId(examId);
    }

    // Subject
    if (subjectId) {
      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return NextResponse.json(
          { message: "Invalid subject ID" },
          { status: 400 }
        );
      }

      filter.subjectId = new mongoose.Types.ObjectId(subjectId);
    }

    // Topic
    if (topic) {
      filter.topic = {
        $regex: topic,
        $options: "i",
      };
    }

    // Difficulty
    if (difficulty) {
      if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
        return NextResponse.json(
          { message: "Invalid difficulty" },
          { status: 400 }
        );
      }

      filter.difficulty = difficulty;
    }

    // Daily quiz
    if (isDailyQuiz === "true" || isDailyQuiz === "false") {
      filter.isDailyQuiz = isDailyQuiz === "true";
    }

    // Active
    if (isActive === "true" || isActive === "false") {
      filter.isActive = isActive === "true";
    }

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("GET QUESTIONS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch questions",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/questions
 */
export async function POST(request: Request) {
  try {
    const session = await checkAdmin();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    console.log(
      "=========================================="
    );
    console.log("CREATE QUESTION REQUEST");
    console.log(body);
    console.log(
      "=========================================="
    );

    const {
      question,
      options,
      correctAnswer,
      explanation,
      examId,
      subjectId,
      topic,
      difficulty,
      isDailyQuiz,
      isActive,
    } = body;

    // -----------------------------------------
    // Question
    // -----------------------------------------

    if (
      typeof question !== "string" ||
      !question.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Question text is required",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Options
    // -----------------------------------------

    if (
      !Array.isArray(options) ||
      options.length !== 4
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A question must have exactly 4 options",
          received: options,
        },
        { status: 400 }
      );
    }

    const cleanOptions = options.map(
      (option: unknown) =>
        typeof option === "string"
          ? option.trim()
          : ""
    );

    if (cleanOptions.some((option) => !option)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All 4 options must contain text",
          options: cleanOptions,
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Correct Answer
    // -----------------------------------------

    const parsedCorrectAnswer = Number(correctAnswer);

    if (
      !Number.isInteger(parsedCorrectAnswer) ||
      parsedCorrectAnswer < 0 ||
      parsedCorrectAnswer > 3
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Correct answer must be an integer between 0 and 3",
          received: correctAnswer,
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Exam
    // -----------------------------------------

    if (!examId) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam is required",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(examId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID",
          received: examId,
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Subject
    // -----------------------------------------

    if (!subjectId) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject is required",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(subjectId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid subject ID",
          received: subjectId,
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Topic
    // -----------------------------------------

    if (
      typeof topic !== "string" ||
      !topic.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Topic is required",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Difficulty
    // -----------------------------------------

    const finalDifficulty =
      typeof difficulty === "string" &&
      difficulty.trim()
        ? difficulty.trim()
        : "Medium";

    if (
      !["Easy", "Medium", "Hard"].includes(
        finalDifficulty
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid difficulty",
          received: difficulty,
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Find Exam
    // -----------------------------------------

    const exam = await Exam.findById(examId);

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found",
          examId,
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // Find Subject inside Exam
    // -----------------------------------------

    const subject = exam.subjects?.find(
      (item: any) =>
        item._id?.toString() === subjectId
    );

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected subject does not belong to this exam",

          examId,

          subjectId,

          availableSubjects:
            exam.subjects?.map((item: any) => ({
              _id: item._id?.toString(),
              name: item.name,
              slug: item.slug,
            })) || [],
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Create Question
    // -----------------------------------------

    const newQuestion = await Question.create({
      question: question.trim(),

      options: cleanOptions,

      correctAnswer: parsedCorrectAnswer,

      explanation:
        typeof explanation === "string"
          ? explanation.trim()
          : "",

      // MongoDB relationship
      examId: exam._id,

      subjectId: subject._id,

      // Backward compatibility
      exam: exam.name,

      subject: subject.name,

      topic: topic.trim(),

      difficulty: finalDifficulty,

      isDailyQuiz:
        typeof isDailyQuiz === "boolean"
          ? isDailyQuiz
          : false,

      isActive:
        typeof isActive === "boolean"
          ? isActive
          : true,
    });

    console.log(
      "QUESTION CREATED:",
      newQuestion._id.toString()
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Question created successfully",
        question: newQuestion,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "=========================================="
    );
    console.error(
      "CREATE QUESTION ERROR:"
    );
    console.error(error);
    console.error(
      "=========================================="
    );

    // Mongoose validation error
    if (error?.name === "ValidationError") {
      const errors: Record<string, string> = {};

      for (const [field, value] of Object.entries(
        error.errors || {}
      )) {
        errors[field] =
          (value as any)?.message ||
          "Invalid value";
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "Question validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    // Duplicate key
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate key error",
          details: error.keyValue || {},
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to create question",
      },
      { status: 500 }
    );
  }
}