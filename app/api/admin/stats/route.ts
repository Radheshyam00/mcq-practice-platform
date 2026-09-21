import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Question } from "@/models/Question";
import { Exam } from "@/models/Exam";
import { MockTest } from "@/models/MockTest";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const [
      users,
      activeUsers,
      questions,
      exams,
      mockTests,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        status: "active",
      }),

      Question.countDocuments(),

      Exam.countDocuments(),

      MockTest.countDocuments(),
    ]);

    return NextResponse.json({
      users,
      activeUsers,
      questions,
      exams,
      mockTests,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to load statistics" },
      { status: 500 }
    );
  }
}