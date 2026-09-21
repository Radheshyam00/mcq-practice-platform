import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Result } from "@/models/Result";

async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  if (session.user.role !== "admin") {
    return null;
  }

  return session;
}

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const examId = searchParams.get("examId") || "";
    const type = searchParams.get("type") || "";

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        {
          studentName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          examName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (examId) {
      query.examId = examId;
    }

    if (
      type &&
      ["practice", "mock-test", "daily-quiz"].includes(type)
    ) {
      query.type = type;
    }

    const results = await Result.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const formattedResults = results.map((result) => ({
      id: result._id.toString(),

      userId: result.userId.toString(),
      examId: result.examId.toString(),

      name: result.studentName,
      exam: result.examName,

      score: result.score,
      correct: result.correct,
      wrong: result.wrong,
      skipped: result.skipped,

      total: result.totalQuestions,

      timeSeconds: result.timeTakenSeconds,

      time:
        result.timeTakenSeconds > 0
          ? `${Math.floor(result.timeTakenSeconds / 60)} min`
          : "—",

      type: result.type,

      createdAt: result.createdAt,
    }));

    const totalCompleted = await Result.countDocuments();

    const attemptsToday = await Result.countDocuments({
      createdAt: {
        $gte: new Date(
          new Date().setHours(0, 0, 0, 0)
        ),
      },
    });

    const averageResult = await Result.aggregate([
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: "$score",
          },
        },
      },
    ]);

    const averageScore =
      averageResult.length > 0
        ? Math.round(averageResult[0].averageScore)
        : 0;

    return NextResponse.json({
      success: true,

      results: formattedResults,

      stats: {
        averageScore,
        completed: totalCompleted,
        attemptsToday,
      },
    });
  } catch (error) {
    console.error("GET ADMIN RESULTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load results",
      },
      { status: 500 }
    );
  }
}