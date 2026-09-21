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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid exam ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const exam = await Exam.findById(id).lean();

    if (!exam) {
      return NextResponse.json(
        { message: "Exam not found" },
        { status: 404 }
      );
    }

    const questions = await Question.find({
      examId: id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      exam,
      questions,
    });
  } catch (error) {
    console.error("GET exam questions error:", error);

    return NextResponse.json(
      { message: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}