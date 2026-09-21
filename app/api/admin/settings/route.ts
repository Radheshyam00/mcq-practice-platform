import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Settings } from "@/models/Settings";

async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return false;
  }

  return session.user.role === "admin";
}

const DEFAULT_SETTINGS = {
  websiteName: "MCQ Practice",
  websiteDescription:
    "Practice multiple choice questions for competitive exams.",

  defaultDuration: 30,
  questionsPerQuiz: 20,

  showExplanations: true,
  allowQuestionNavigation: true,

  newUserNotifications: true,
  newResultNotifications: false,

  requireAdminAuthentication: true,
  sessionTimeout: true,
};

export async function GET() {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Administrator access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    let settings = await Settings.findOne().lean();

    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
      settings = settings.toObject();
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...settings,
        _id: settings._id.toString(),
      },
    });
  } catch (error) {
    console.error("GET ADMIN SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load settings.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Administrator access required.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      websiteName,
      websiteDescription,
      defaultDuration,
      questionsPerQuiz,
      showExplanations,
      allowQuestionNavigation,
      newUserNotifications,
      newResultNotifications,
      requireAdminAuthentication,
      sessionTimeout,
    } = body;

    if (!websiteName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Website name is required.",
        },
        { status: 400 }
      );
    }

    const duration = Number(defaultDuration);
    const questionCount = Number(questionsPerQuiz);

    if (!Number.isInteger(duration) || duration < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Default duration must be at least 1 minute.",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(questionCount) || questionCount < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Questions per quiz must be at least 1.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const settings = await Settings.findOneAndUpdate(
      {},
      {
        websiteName: websiteName.trim(),
        websiteDescription: String(
          websiteDescription ?? ""
        ).trim(),

        defaultDuration: duration,
        questionsPerQuiz: questionCount,

        showExplanations: Boolean(showExplanations),
        allowQuestionNavigation: Boolean(
          allowQuestionNavigation
        ),

        newUserNotifications: Boolean(
          newUserNotifications
        ),
        newResultNotifications: Boolean(
          newResultNotifications
        ),

        requireAdminAuthentication: Boolean(
          requireAdminAuthentication
        ),
        sessionTimeout: Boolean(sessionTimeout),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully.",
      settings: {
        ...settings,
        _id: settings._id.toString(),
      },
    });
  } catch (error) {
    console.error("UPDATE ADMIN SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save settings.",
      },
      { status: 500 }
    );
  }
}