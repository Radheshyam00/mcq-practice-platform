import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { Exam } from "@/models/Exam";
import { Question } from "@/models/Question";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| GET /api/admin/exams/[id]
|--------------------------------------------------------------------------
*/
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const exam = await Exam.findById(id).lean();

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found",
        },
        { status: 404 }
      );
    }

    /*
     * Convert MongoDB ObjectIds to strings.
     * This makes the response easier to use in the client.
     */
    const formattedExam = {
      _id: exam._id.toString(),
      name: exam.name,
      slug: exam.slug,
      description: exam.description || "",

      subjects: Array.isArray(exam.subjects)
        ? exam.subjects.map((subject: any) => ({
            _id: subject._id.toString(),
            name: subject.name,
            slug: subject.slug,
            description: subject.description || "",
          }))
        : [],

      durationMinutes: exam.durationMinutes || 60,

      isActive: exam.isActive !== false,
    };

    return NextResponse.json({
      success: true,
      exam: formattedExam,
    });
  } catch (error) {
    console.error("GET exam error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch exam",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| PUT /api/admin/exams/[id]
|--------------------------------------------------------------------------
*/
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID",
        },
        { status: 400 }
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

    /*
     * Validate exam name
     */
    if (!name || !String(name).trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam name is required",
        },
        { status: 400 }
      );
    }

    /*
     * Generate slug if one wasn't supplied.
     */
    const finalSlug = slugify(String(slug || name));

    if (!finalSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid exam slug is required",
        },
        { status: 400 }
      );
    }

    /*
     * Check duplicate exam slug.
     */
    const duplicate = await Exam.findOne({
      slug: finalSlug,
      _id: { $ne: id },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message: "Another exam already uses this slug",
        },
        { status: 409 }
      );
    }

    /*
     * Validate subjects.
     */
    let formattedSubjects: any[] = [];

    if (Array.isArray(subjects)) {
      const subjectSlugs = new Set<string>();

      for (const subject of subjects) {
        if (!subject?.name || !String(subject.name).trim()) {
          return NextResponse.json(
            {
              success: false,
              message: "Every subject must have a name",
            },
            { status: 400 }
          );
        }

        const subjectSlug = slugify(
          String(subject.slug || subject.name)
        );

        if (!subjectSlug) {
          return NextResponse.json(
            {
              success: false,
              message: `Invalid slug for subject "${subject.name}"`,
            },
            { status: 400 }
          );
        }

        if (subjectSlugs.has(subjectSlug)) {
          return NextResponse.json(
            {
              success: false,
              message: `Duplicate subject slug: ${subjectSlug}`,
            },
            { status: 400 }
          );
        }

        subjectSlugs.add(subjectSlug);

        formattedSubjects.push({
          ...(subject._id
            ? {
                _id: new mongoose.Types.ObjectId(
                  subject._id
                ),
              }
            : {}),

          name: String(subject.name).trim(),

          slug: subjectSlug,

          description: subject.description
            ? String(subject.description).trim()
            : "",
        });
      }
    }

    /*
     * Validate duration.
     */
    const finalDuration = Number(
      durationMinutes ?? 60
    );

    if (
      !Number.isFinite(finalDuration) ||
      finalDuration < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Duration must be a number greater than 0",
        },
        { status: 400 }
      );
    }

    /*
     * Update exam.
     */
    const exam = await Exam.findByIdAndUpdate(
      id,
      {
        name: String(name).trim(),

        slug: finalSlug,

        description: description
          ? String(description).trim()
          : "",

        subjects: formattedSubjects,

        durationMinutes: finalDuration,

        isActive: isActive !== false,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found",
        },
        { status: 404 }
      );
    }

    /*
     * Format response.
     */
    const formattedExam = {
      _id: exam._id.toString(),
      name: exam.name,
      slug: exam.slug,
      description: exam.description || "",

      subjects: Array.isArray(exam.subjects)
        ? exam.subjects.map((subject: any) => ({
            _id: subject._id.toString(),
            name: subject.name,
            slug: subject.slug,
            description: subject.description || "",
          }))
        : [],

      durationMinutes: exam.durationMinutes || 60,

      isActive: exam.isActive !== false,
    };

    return NextResponse.json({
      success: true,
      message: "Exam updated successfully",
      exam: formattedExam,
    });
  } catch (error: any) {
    console.error("PUT exam error:", error);

    /*
     * MongoDB duplicate key error
     */
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An exam with this slug already exists",
        },
        { status: 409 }
      );
    }

    /*
     * Mongoose validation error
     */
    if (error?.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update exam",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE /api/admin/exams/[id]
|--------------------------------------------------------------------------
*/
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const exam = await Exam.findById(id);

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found",
        },
        { status: 404 }
      );
    }

    /*
     * Delete all questions belonging to this exam.
     */
    const deletedQuestions = await Question.deleteMany({
      examId: exam._id,
    });

    /*
     * Delete the exam.
     */
    await Exam.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message:
        "Exam and its questions deleted successfully",

      deletedQuestions: deletedQuestions.deletedCount,
    });
  } catch (error) {
    console.error("DELETE exam error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete exam",
      },
      { status: 500 }
    );
  }
}