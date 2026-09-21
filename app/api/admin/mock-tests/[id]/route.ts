import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { MockTest } from "@/models/MockTest";
import { Exam } from "@/models/Exam";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return false;
  }

  return session.user.role === "admin";
}

/*
 * GET /api/admin/mock-tests/:id
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mock test ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const mockTest = await MockTest.findById(id)
      .populate("examId", "name slug")
      .lean();

    if (!mockTest) {
      return NextResponse.json(
        {
          success: false,
          message: "Mock test not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mockTest: {
        id: mockTest._id.toString(),
        title: mockTest.title,
        slug: mockTest.slug,
        description: mockTest.description || "",
        examId: (mockTest.examId as any)?._id?.toString(),
        examName: (mockTest.examId as any)?.name || "",
        questions: mockTest.questionCount,
        duration: mockTest.durationMinutes,
        difficulty: mockTest.difficulty,
        isActive: mockTest.isActive,
      },
    });
  } catch (error) {
    console.error(
      "GET MOCK TEST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load mock test.",
      },
      { status: 500 }
    );
  }
}

/*
 * PUT /api/admin/mock-tests/:id
 */
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mock test ID.",
        },
        { status: 400 }
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
      isActive,
    } = body;

    const mockTest =
      await MockTest.findById(id);

    if (!mockTest) {
      return NextResponse.json(
        {
          success: false,
          message: "Mock test not found.",
        },
        { status: 404 }
      );
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Title is required.",
          },
          { status: 400 }
        );
      }

      mockTest.title = title.trim();
    }

    if (slug !== undefined) {
      const newSlug = createSlug(slug);

      if (!newSlug) {
        return NextResponse.json(
          {
            success: false,
            message: "Valid slug is required.",
          },
          { status: 400 }
        );
      }

      const duplicate =
        await MockTest.findOne({
          slug: newSlug,
          _id: { $ne: id },
        });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Another mock test already uses this slug.",
          },
          { status: 409 }
        );
      }

      mockTest.slug = newSlug;
    }

    if (examId !== undefined) {
      if (
        !mongoose.Types.ObjectId.isValid(examId)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid examId.",
          },
          { status: 400 }
        );
      }

      const exam =
        await Exam.findById(examId);

      if (!exam) {
        return NextResponse.json(
          {
            success: false,
            message: "Exam not found.",
          },
          { status: 404 }
        );
      }

      mockTest.examId = exam._id;
    }

    if (description !== undefined) {
      mockTest.description =
        description?.trim() || "";
    }

    if (questionCount !== undefined) {
      if (Number(questionCount) < 1) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Question count must be at least 1.",
          },
          { status: 400 }
        );
      }

      mockTest.questionCount =
        Number(questionCount);
    }

    if (durationMinutes !== undefined) {
      if (Number(durationMinutes) < 1) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Duration must be at least 1 minute.",
          },
          { status: 400 }
        );
      }

      mockTest.durationMinutes =
        Number(durationMinutes);
    }

    if (difficulty !== undefined) {
      if (
        ![
          "Easy",
          "Medium",
          "Hard",
          "Mixed",
        ].includes(difficulty)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid difficulty.",
          },
          { status: 400 }
        );
      }

      mockTest.difficulty = difficulty;
    }

    if (isActive !== undefined) {
      mockTest.isActive = Boolean(isActive);
    }

    await mockTest.save();

    return NextResponse.json({
      success: true,
      message:
        "Mock test updated successfully.",
    });
  } catch (error) {
    console.error(
      "UPDATE MOCK TEST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update mock test.",
      },
      { status: 500 }
    );
  }
}

/*
 * DELETE /api/admin/mock-tests/:id
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mock test ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted =
      await MockTest.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Mock test not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Mock test deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE MOCK TEST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete mock test.",
      },
      { status: 500 }
    );
  }
}