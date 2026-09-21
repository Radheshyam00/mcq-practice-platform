import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Result } from "@/models/Result";
import { Exam } from "@/models/Exam";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = session.user.id;

    /*
     * Get all results belonging to this student.
     */
    const results = await Result.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    /*
     * Questions attempted
     */
    const questionsAttempted = results.reduce(
      (sum, result) =>
        sum + (result.totalQuestions || 0),
      0
    );

    /*
     * Correct answers
     */
    const totalCorrect = results.reduce(
      (sum, result) =>
        sum + (result.correct || 0),
      0
    );

    /*
     * Overall accuracy
     */
    const accuracy =
      questionsAttempted > 0
        ? Math.round(
            (totalCorrect / questionsAttempted) * 100
          )
        : 0;

    /*
     * Total practice time
     */
    const totalTimeSeconds = results.reduce(
      (sum, result) =>
        sum + (result.timeTakenSeconds || 0),
      0
    );

    /*
     * Completed tests
     */
    const completedTests = results.length;

    /*
     * Recent results
     */
    const recentResults = results
      .slice(0, 10)
      .map((result) => ({
        id: result._id.toString(),

        examName: result.examName,

        score: result.score,

        correct: result.correct,

        totalQuestions: result.totalQuestions,

        timeTakenSeconds:
          result.timeTakenSeconds || 0,

        type: result.type,

        createdAt: result.createdAt,
      }));

    /*
     * Active exams
     */
    const examDocs = await Exam.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    /*
     * Get question counts for each exam.
     *
     * Using aggregation avoids loading every question
     * document into memory.
     */
    const { Question } = await import(
      "@/models/Question"
    );

    const questionCounts = await Question.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$examId",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const questionCountMap = new Map<string, number>();

    for (const item of questionCounts) {
      questionCountMap.set(
        item._id.toString(),
        item.count
      );
    }

    const exams = examDocs.map((exam) => ({
      _id: exam._id.toString(),

      name: exam.name,

      slug: exam.slug,

      description: exam.description || "",

      totalQuestions:
        questionCountMap.get(
          exam._id.toString()
        ) || 0,

      durationMinutes:
        exam.durationMinutes || 60,
    }));

    /*
     * Rank
     *
     * Rank is based on average score.
     *
     * Students are grouped by userId and their
     * average result score is calculated.
     */
    const leaderboard = await Result.aggregate([
      {
        $group: {
          _id: "$userId",

          averageScore: {
            $avg: "$score",
          },
        },
      },
      {
        $sort: {
          averageScore: -1,
        },
      },
    ]);

    const rankIndex = leaderboard.findIndex(
      (item) =>
        item._id.toString() === userId
    );

    const rank =
      rankIndex >= 0
        ? rankIndex + 1
        : null;

    return NextResponse.json({
      success: true,

      stats: {
        questionsAttempted,
        accuracy,
        totalTimeSeconds,
        completedTests,
        rank,
      },

      recentResults,

      exams,
    });
  } catch (error) {
    console.error(
      "DASHBOARD API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard",
      },
      {
        status: 500,
      }
    );
  }
}