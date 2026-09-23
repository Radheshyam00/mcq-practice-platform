/*
|--------------------------------------------------------------------------
| app/api/admin/exams/route.ts
|--------------------------------------------------------------------------
*/

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Exam } from "@/models/Exam";

type SubjectInput = {
  _id?: string;
  name?: unknown;
  slug?: unknown;
  description?: unknown;
};

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatSubject(subject: any) {
  return {
    _id: subject?._id
      ? subject._id.toString()
      : "",
    name: clean(subject?.name),
    slug: clean(subject?.slug),
    description: clean(subject?.description),
  };
}

function formatExam(exam: any) {
  return {
    _id: exam._id.toString(),

    name: clean(exam.name),

    slug: clean(exam.slug),

    description: clean(exam.description),

    durationMinutes:
      Number(exam.durationMinutes) > 0
        ? Number(exam.durationMinutes)
        : 60,

    isActive: exam.isActive !== false,

    subjects: Array.isArray(exam.subjects)
      ? exam.subjects.map(formatSubject)
      : [],

    createdAt: exam.createdAt,

    updatedAt: exam.updatedAt,
  };
}

async function requireAdmin() {
  const session =
    await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "admin") {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      ),
    };
  }

  return {
    session,
  };
}

/*
|--------------------------------------------------------------------------
| GET /api/admin/exams
|--------------------------------------------------------------------------
|
| Used by:
| - Admin Exams
| - Admin Questions
| - Admin Mock Tests
| - Add Question
| - Edit Question
|
*/
export async function GET() {
  try {
    const auth = await requireAdmin();

    if (auth.error) {
      return auth.error;
    }

    await connectDB();

    const exams = await Exam.find({})
      .sort({ createdAt: -1 })
      .lean();

    const formattedExams =
      exams.map(formatExam);

    return NextResponse.json(
      {
        success: true,
        exams: formattedExams,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET /api/admin/exams ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch exams.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST /api/admin/exams
|--------------------------------------------------------------------------
*/
export async function POST(
  request: NextRequest
) {
  try {
    const auth = await requireAdmin();

    if (auth.error) {
      return auth.error;
    }

    await connectDB();

    /*
    |--------------------------------------------------------------------------
    | Parse request body
    |--------------------------------------------------------------------------
    */

    let body: Record<string, any>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const {
      name,
      slug,
      description,
      subjects,
      durationMinutes,
      isActive,
    } = body;

    /*
    |--------------------------------------------------------------------------
    | Validate exam name
    |--------------------------------------------------------------------------
    */

    const finalName = clean(name);

    if (!finalName) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam name is required.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Generate exam slug
    |--------------------------------------------------------------------------
    */

    const finalSlug = slugify(
      clean(slug) || finalName
    );

    if (!finalSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid exam slug is required.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check duplicate exam slug
    |--------------------------------------------------------------------------
    */

    const existingExam =
      await Exam.findOne({
        slug: finalSlug,
      }).lean();

    if (existingExam) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An exam with this slug already exists.",
        },
        { status: 409 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate duration
    |--------------------------------------------------------------------------
    */

    const parsedDuration =
      Number(durationMinutes ?? 60);

    if (
      !Number.isFinite(parsedDuration) ||
      !Number.isInteger(parsedDuration) ||
      parsedDuration < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Duration must be a positive integer.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate subjects
    |--------------------------------------------------------------------------
    |
    | Subjects are embedded inside Exam.
    |
    | Question documents store:
    |
    | examId    -> Exam._id
    | subjectId -> Exam.subjects._id
    |
    | Therefore every subject must receive an _id.
    |
    */

    if (!Array.isArray(subjects)) {
      return NextResponse.json(
        {
          success: false,
          message: "Subjects must be an array.",
        },
        { status: 400 }
      );
    }

    const formattedSubjects: Array<{
      name: string;
      slug: string;
      description: string;
    }> = [];

    const subjectSlugs =
      new Set<string>();

    const subjectNames =
      new Set<string>();

    for (
      let index = 0;
      index < subjects.length;
      index++
    ) {
      const subject =
        subjects[index] as SubjectInput;

      if (!subject) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Subject ${index + 1} is invalid.`,
          },
          { status: 400 }
        );
      }

      const subjectName =
        clean(subject.name);

      /*
      |--------------------------------------------------------------------------
      | Subject name
      |--------------------------------------------------------------------------
      */

      if (!subjectName) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Subject ${index + 1} must have a name.`,
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Subject slug
      |--------------------------------------------------------------------------
      */

      const subjectSlug =
        slugify(
          clean(subject.slug) ||
            subjectName
        );

      if (!subjectSlug) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid slug for subject "${subjectName}".`,
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Duplicate subject slug
      |--------------------------------------------------------------------------
      */

      if (
        subjectSlugs.has(subjectSlug)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Duplicate subject slug "${subjectSlug}".`,
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Duplicate subject name
      |--------------------------------------------------------------------------
      */

      const normalizedName =
        subjectName.toLowerCase();

      if (
        subjectNames.has(
          normalizedName
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Duplicate subject name "${subjectName}".`,
          },
          { status: 400 }
        );
      }

      subjectSlugs.add(
        subjectSlug
      );

      subjectNames.add(
        normalizedName
      );

      formattedSubjects.push({
        name: subjectName,

        slug: subjectSlug,

        description: clean(
          subject.description
        ),
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create exam
    |--------------------------------------------------------------------------
    */

    const exam = await Exam.create({
      name: finalName,

      slug: finalSlug,

      description: clean(
        description
      ),

      subjects:
        formattedSubjects,

      durationMinutes:
        parsedDuration,

      isActive:
        isActive !== false,
    });

    /*
    |--------------------------------------------------------------------------
    | Format response
    |--------------------------------------------------------------------------
    */

    const formattedExam =
      formatExam(exam);

    return NextResponse.json(
      {
        success: true,

        message:
          "Exam created successfully.",

        exam: formattedExam,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "POST /api/admin/exams ERROR:",
      error
    );

    /*
    |--------------------------------------------------------------------------
    | MongoDB duplicate key
    |--------------------------------------------------------------------------
    */

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An exam with the same slug already exists.",
        },
        { status: 409 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Mongoose validation error
    |--------------------------------------------------------------------------
    */

    if (
      error?.name ===
      "ValidationError"
    ) {
      const details =
        Object.values(
          error.errors ?? {}
        ).map((item: any) => ({
          field: item.path,
          message: item.message,
        }));

      return NextResponse.json(
        {
          success: false,
          message:
            "Exam validation failed.",
          details,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create exam.",
      },
      { status: 500 }
    );
  }
}