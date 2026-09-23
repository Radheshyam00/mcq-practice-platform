import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { Exam } from "@/models/Exam";
import { Question } from "@/models/Question";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Validate exam ID before querying MongoDB.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    /*
     * Always load the exam first.
     */
    const exam = await Exam.findById(id).lean();

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Primary relationship:
     *
     * Question.examId -> Exam._id
     *
     * This is the canonical relationship used by
     * the current Question model.
     */
    const questions = await Question.find({
      examId: new mongoose.Types.ObjectId(id),
    })
      .sort({ createdAt: -1 })
      .lean();

    /*
     * Return the same structure expected by the admin
     * exam/question pages.
     */
    return NextResponse.json(
      {
        success: true,
        exam,
        questions,
        total: questions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET /api/admin/exams/[id]/questions error:",
      error
    );

    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch exam questions.",
      },
      { status: 500 }
    );
  }
}