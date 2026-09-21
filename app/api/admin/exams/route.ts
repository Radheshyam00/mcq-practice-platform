import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import { Exam } from "@/models/Exam";
import { authOptions } from "@/lib/auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * GET /api/admin/exams
 *
 * Used by:
 * - Admin Exams
 * - Admin Questions
 * - Admin Mock Tests
 */
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

    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const exams = await Exam.find({})
      .sort({ createdAt: -1 })
      .lean();

    const formattedExams = exams.map((exam) => ({
      _id: exam._id.toString(),

      name: exam.name,

      slug: exam.slug,

      description: exam.description || "",

      durationMinutes:
        exam.durationMinutes || 60,

      isActive:
        exam.isActive !== false,

      subjects: (exam.subjects || []).map(
        (subject: any) => ({
          _id: subject._id.toString(),

          name: subject.name,

          slug: subject.slug,

          description:
            subject.description || "",
        })
      ),

      createdAt: exam.createdAt,

      updatedAt: exam.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      exams: formattedExams,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/exams ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch exams",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/exams
 */
export async function POST(
  request: NextRequest
) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    const {
      name,
      slug,
      description,
      subjects,
      durationMinutes,
      isActive,
    } = body;

    // ---------------------------------------------
    // Validate name
    // ---------------------------------------------

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam name is required",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // Generate slug
    // ---------------------------------------------

    const finalSlug = slugify(
      typeof slug === "string" && slug.trim()
        ? slug
        : name
    );

    if (!finalSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid exam slug is required",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // Check duplicate slug
    // ---------------------------------------------

    const existing =
      await Exam.findOne({
        slug: finalSlug,
      });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An exam with this slug already exists",
        },
        { status: 409 }
      );
    }

    // ---------------------------------------------
    // Validate duration
    // ---------------------------------------------

    const finalDuration =
      Number(durationMinutes) || 60;

    if (finalDuration < 1) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Duration must be at least 1 minute",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // Prepare subjects
    // ---------------------------------------------

    const formattedSubjects =
      Array.isArray(subjects)
        ? subjects
            .filter(
              (subject) =>
                subject &&
                typeof subject.name ===
                  "string" &&
                subject.name.trim()
            )
            .map((subject) => ({
              name: subject.name.trim(),

              slug: slugify(
                subject.slug ||
                  subject.name
              ),

              description:
                typeof subject.description ===
                  "string"
                  ? subject.description.trim()
                  : "",
            }))
        : [];

    // ---------------------------------------------
    // Check duplicate subject slugs
    // ---------------------------------------------

    const subjectSlugs =
      formattedSubjects.map(
        (subject) => subject.slug
      );

    const uniqueSubjectSlugs =
      new Set(subjectSlugs);

    if (
      uniqueSubjectSlugs.size !==
      subjectSlugs.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Subject slugs must be unique within an exam",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // Create exam
    // ---------------------------------------------

    const exam = await Exam.create({
      name: name.trim(),

      slug: finalSlug,

      description:
        typeof description === "string"
          ? description.trim()
          : "",

      subjects: formattedSubjects,

      durationMinutes: finalDuration,

      isActive: isActive !== false,
    });

    // ---------------------------------------------
    // Format response
    // ---------------------------------------------

    const formattedExam = {
      _id: exam._id.toString(),

      name: exam.name,

      slug: exam.slug,

      description: exam.description || "",

      durationMinutes:
        exam.durationMinutes,

      isActive:
        exam.isActive,

      subjects:
        exam.subjects.map((subject: any) => ({
          _id: subject._id.toString(),

          name: subject.name,

          slug: subject.slug,

          description:
            subject.description || "",
        })),

      createdAt: exam.createdAt,

      updatedAt: exam.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,

        message:
          "Exam created successfully",

        exam: formattedExam,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/exams ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create exam",
      },
      { status: 500 }
    );
  }
}