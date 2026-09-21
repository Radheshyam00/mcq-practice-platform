import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/models/Question";
import { Exam } from "@/models/Exam";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  return session;
}

/**
 * GET /api/admin/questions/[id]
 */
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const session = await checkAdmin();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid question ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const question = await Question.findById(id).lean();

    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      question,
    });
  } catch (error) {
    console.error("GET question error:", error);

    return NextResponse.json(
      { message: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/questions/[id]
 */
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await checkAdmin();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid question ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const body = await request.json();

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

    // -----------------------------
    // Basic validation
    // -----------------------------

    if (!question?.trim()) {
      return NextResponse.json(
        { message: "Question text is required" },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(options) ||
      options.length !== 4 ||
      options.some(
        (option) =>
          typeof option !== "string" || !option.trim()
      )
    ) {
      return NextResponse.json(
        {
          message:
            "A question must have exactly 4 non-empty options",
        },
        { status: 400 }
      );
    }

    if (
      typeof correctAnswer !== "number" ||
      correctAnswer < 0 ||
      correctAnswer > 3
    ) {
      return NextResponse.json(
        {
          message:
            "Correct answer must be a number between 0 and 3",
        },
        { status: 400 }
      );
    }

    if (!examId) {
      return NextResponse.json(
        { message: "Exam is required" },
        { status: 400 }
      );
    }

    if (!subjectId) {
      return NextResponse.json(
        { message: "Subject is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return NextResponse.json(
        { message: "Invalid exam ID" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return NextResponse.json(
        { message: "Invalid subject ID" },
        { status: 400 }
      );
    }

    if (!topic?.trim()) {
      return NextResponse.json(
        { message: "Topic is required" },
        { status: 400 }
      );
    }

    if (
      !["Easy", "Medium", "Hard"].includes(difficulty)
    ) {
      return NextResponse.json(
        { message: "Invalid difficulty" },
        { status: 400 }
      );
    }

    // -----------------------------
    // Verify exam
    // -----------------------------

    const exam = await Exam.findById(examId);

    if (!exam) {
      return NextResponse.json(
        { message: "Exam not found" },
        { status: 404 }
      );
    }

    // -----------------------------
    // Verify subject belongs to exam
    // -----------------------------

    const subject = exam.subjects.find(
      (item: { _id: { toString: () => string } }) =>
        item._id.toString() === subjectId
    );

    if (!subject) {
      return NextResponse.json(
        {
          message:
            "Selected subject does not belong to this exam",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Update question
    // -----------------------------

    const updatedQuestion =
      await Question.findByIdAndUpdate(
        id,
        {
          question: question.trim(),

          options: options.map(
            (option: string) => option.trim()
          ),

          correctAnswer,

          explanation:
            typeof explanation === "string"
              ? explanation.trim()
              : "",

          examId: exam._id,

          subjectId: subject._id,

          // Keep old fields temporarily
          // for backward compatibility.
          exam: exam.name,

          subject: subject.name,

          topic: topic.trim(),

          difficulty,

          isDailyQuiz:
            typeof isDailyQuiz === "boolean"
              ? isDailyQuiz
              : false,

          isActive:
            typeof isActive === "boolean"
              ? isActive
              : true,
        },
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!updatedQuestion) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("PUT question error:", error);

    return NextResponse.json(
      { message: "Failed to update question" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/questions/[id]
 */
export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const session = await checkAdmin();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid question ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const question =
      await Question.findByIdAndDelete(id);

    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("DELETE question error:", error);

    return NextResponse.json(
      { message: "Failed to delete question" },
      { status: 500 }
    );
  }
}