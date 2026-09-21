import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Result } from "@/models/Result";
import { Exam } from "@/models/Exam";

export async function POST(request: Request) {
  try {
    /*
     * Check logged-in user
     */
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to save a result.",
        },
        { status: 401 }
      );
    }

    /*
     * Validate user ID
     */
    if (
      !mongoose.Types.ObjectId.isValid(
        session.user.id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    /*
     * Read request body
     */
    const body = await request.json();

    const {
      examId,
      examName,
      correct,
      wrong,
      skipped,
      totalQuestions,
      timeTakenSeconds,
      type = "practice",
    } = body;

    console.log("SAVE RESULT REQUEST:", {
      examId,
      examName,
      correct,
      wrong,
      skipped,
      totalQuestions,
      timeTakenSeconds,
      type,
      userId: session.user.id,
    });

    /*
     * Validate exam ID
     */
    if (
      !examId ||
      !mongoose.Types.ObjectId.isValid(examId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid examId is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate result type
     */
    if (
      ![
        "practice",
        "mock-test",
        "daily-quiz",
      ].includes(type)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid result type.",
        },
        { status: 400 }
      );
    }

    /*
     * Convert numbers safely
     */
    const correctNumber = Number(correct);
    const wrongNumber = Number(wrong);
    const skippedNumber = Number(skipped);
    const totalNumber = Number(totalQuestions);
    const timeNumber = Number(timeTakenSeconds);

    /*
     * Validate numbers
     */
    if (
      !Number.isInteger(correctNumber) ||
      correctNumber < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid correct answer count.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(wrongNumber) ||
      wrongNumber < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid wrong answer count.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(skippedNumber) ||
      skippedNumber < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid skipped answer count.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(totalNumber) ||
      totalNumber < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid total questions.",
        },
        { status: 400 }
      );
    }

    /*
     * All questions must be accounted for.
     */
    if (
      correctNumber +
        wrongNumber +
        skippedNumber !==
      totalNumber
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Correct, wrong, and skipped counts must equal total questions.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate time
     */
    const safeTime =
      Number.isFinite(timeNumber) &&
      timeNumber >= 0
        ? Math.floor(timeNumber)
        : 0;

    /*
     * Calculate score on the server.
     */
    const score = Math.round(
      (correctNumber / totalNumber) * 100
    );

    /*
     * Get exam from MongoDB.
     */
    const exam = await Exam.findById(
      examId
    ).lean();

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
     * Create result.
     */
    const result = await Result.create({
      userId: new mongoose.Types.ObjectId(
        session.user.id
      ),

      examId: new mongoose.Types.ObjectId(
        examId
      ),

      studentName:
        session.user.name ||
        session.user.email ||
        "Student",

      examName:
        exam.name ||
        examName ||
        "Unknown Exam",

      score,

      correct: correctNumber,

      wrong: wrongNumber,

      skipped: skippedNumber,

      totalQuestions: totalNumber,

      timeTakenSeconds: safeTime,

      type,
    });

    console.log(
      "RESULT SAVED:",
      result._id.toString()
    );

    return NextResponse.json(
      {
        success: true,
        message: "Result saved successfully.",

        result: {
          id: result._id.toString(),
          userId: result.userId.toString(),
          examId: result.examId.toString(),

          studentName:
            result.studentName,

          examName:
            result.examName,

          score: result.score,

          correct:
            result.correct,

          wrong:
            result.wrong,

          skipped:
            result.skipped,

          totalQuestions:
            result.totalQuestions,

          timeTakenSeconds:
            result.timeTakenSeconds,

          type: result.type,

          createdAt:
            result.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "SAVE RESULT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save result.",
      },
      { status: 500 }
    );
  }
}