import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { MockTest } from "@/models/MockTest";
import { Exam } from "@/models/Exam";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  if (session.user.role !== "admin") {
    return null;
  }

  return session;
}

function formatMockTest(mock: any) {
  const exam =
    mock.examId && typeof mock.examId === "object"
      ? mock.examId
      : null;

  return {
    id: mock._id.toString(),
    _id: mock._id.toString(),

    title: mock.title,
    slug: mock.slug,
    description: mock.description || "",

    examId: exam
      ? exam._id.toString()
      : mock.examId?.toString(),

    examName: exam?.name || "",
    examSlug: exam?.slug || "",

    questions: mock.questionCount,
    questionCount: mock.questionCount,

    duration: mock.durationMinutes,
    durationMinutes: mock.durationMinutes,

    difficulty: mock.difficulty,

    demo: Boolean(mock.demo),

    isActive: Boolean(mock.isActive),

    createdAt: mock.createdAt,
    updatedAt: mock.updatedAt,
  };
}

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

export async function GET() {
  try {
    const session = await requireAdmin();

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

    const mocks = await MockTest.find()
      .populate("examId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      mockTests: mocks.map(formatMockTest),
    });
  } catch (error) {
    console.error("GET mock tests error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch mock tests",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
*/

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();

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

    const {
      title,
      slug,
      examId,
      description,
      questionCount,
      durationMinutes,
      difficulty,
      demo,
      isActive,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    if (
      !examId ||
      !mongoose.Types.ObjectId.isValid(examId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid examId is required",
        },
        { status: 400 }
      );
    }

    const count = Number(questionCount);
    const duration = Number(durationMinutes);

    if (!Number.isInteger(count) || count < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Question count must be at least 1",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(duration) || duration < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Duration must be at least 1 minute",
        },
        { status: 400 }
      );
    }

    const allowedDifficulties = [
      "Easy",
      "Medium",
      "Hard",
      "Mixed",
    ];

    if (
      difficulty &&
      !allowedDifficulties.includes(difficulty)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid difficulty",
        },
        { status: 400 }
      );
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found",
        },
        { status: 404 }
      );
    }

    const finalSlug = slugify(
      slug || title
    );

    const existing = await MockTest.findOne({
      slug: finalSlug,
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A mock test with this slug already exists",
        },
        { status: 409 }
      );
    }

    /*
     * If this mock test is marked as demo,
     * remove demo from all other mock tests.
     */
    if (demo === true) {
      await MockTest.updateMany(
        { demo: true },
        { $set: { demo: false } }
      );
    }

    const mockTest = await MockTest.create({
      title: title.trim(),
      slug: finalSlug,
      examId: exam._id,
      description: description?.trim() || "",
      questionCount: count,
      durationMinutes: duration,
      difficulty: difficulty || "Mixed",
      demo: demo === true,
      isActive: isActive !== false,
    });

    const populated = await MockTest.findById(
      mockTest._id
    )
      .populate("examId", "name slug")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Mock test created successfully",
        mockTest: formatMockTest(populated),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST mock test error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create mock test",
      },
      { status: 500 }
    );
  }
}