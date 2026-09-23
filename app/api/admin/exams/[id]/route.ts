/*
|--------------------------------------------------------------------------
| app/api/admin/exams/[id]/route.ts
|--------------------------------------------------------------------------
*/

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { Exam } from "@/models/Exam";
import { Question } from "@/models/Question";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface SubjectInput {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
}

interface FormattedSubject {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

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

function isValidObjectId(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    mongoose.Types.ObjectId.isValid(value)
  );
}

function formatSubject(
  subject: any
): FormattedSubject {
  return {
    _id: subject._id
      ? subject._id.toString()
      : new mongoose.Types.ObjectId().toString(),

    name: clean(subject.name),

    slug: clean(subject.slug),

    description: clean(subject.description),
  };
}

function formatExam(exam: any) {
  return {
    _id: exam._id.toString(),

    name: clean(exam.name),

    slug: clean(exam.slug),

    description: clean(exam.description),

    subjects: Array.isArray(exam.subjects)
      ? exam.subjects.map(formatSubject)
      : [],

    durationMinutes:
      Number(exam.durationMinutes) > 0
        ? Number(exam.durationMinutes)
        : 60,

    isActive: exam.isActive !== false,
  };
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

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID.",
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
          message: "Exam not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        exam: formatExam(exam),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET /api/admin/exams/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch exam.",
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

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    /*
     * Make sure the exam exists before modifying it.
     */
    const existingExam =
      await Exam.findById(id);

    if (!existingExam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found.",
        },
        { status: 404 }
      );
    }

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
    | Generate/validate exam slug
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

    const duplicateExam =
      await Exam.findOne({
        slug: finalSlug,
        _id: {
          $ne: new mongoose.Types.ObjectId(id),
        },
      }).lean();

    if (duplicateExam) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Another exam already uses this slug.",
        },
        { status: 409 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate subjects
    |--------------------------------------------------------------------------
    |
    | Subjects are embedded inside Exam.
    |
    | Question.subjectId points to the embedded
    | subject _id.
    |
    | Therefore we MUST preserve existing subject
    | ObjectIds when editing the exam.
    |--------------------------------------------------------------------------
    */

    if (!Array.isArray(subjects)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Subjects must be an array.",
        },
        { status: 400 }
      );
    }

    const existingSubjects =
      Array.isArray(existingExam.subjects)
        ? existingExam.subjects
        : [];

    const subjectSlugs =
      new Set<string>();

    const subjectIds =
      new Set<string>();

    const formattedSubjects: any[] = [];

    for (
      let index = 0;
      index < subjects.length;
      index++
    ) {
      const subject =
        subjects[index] as SubjectInput;

      if (
        !subject ||
        !clean(subject.name)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Subject ${index + 1} must have a name.`,
          },
          { status: 400 }
        );
      }

      const subjectName =
        clean(subject.name);

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
       * Prevent duplicate subject slugs.
       */
      if (
        subjectSlugs.has(subjectSlug)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Duplicate subject slug: ${subjectSlug}.`,
          },
          { status: 400 }
        );
      }

      subjectSlugs.add(subjectSlug);

      /*
       * Preserve the existing embedded subject _id.
       *
       * This is extremely important because Questions
       * store subjectId.
       */

      let subjectId: mongoose.Types.ObjectId;

      if (subject._id) {
        if (
          !isValidObjectId(subject._id)
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                `Invalid subject ID for "${subjectName}".`,
            },
            { status: 400 }
          );
        }

        subjectId =
          new mongoose.Types.ObjectId(
            subject._id
          );
      } else {
        /*
         * If the client didn't send _id, try to
         * find the existing subject by slug/name.
         */
        const existingSubject =
          existingSubjects.find(
            (item: any) =>
              clean(item.slug) ===
                subjectSlug ||
              clean(item.name)
                .toLowerCase() ===
                subjectName.toLowerCase()
          );

        if (existingSubject?._id) {
          subjectId =
            new mongoose.Types.ObjectId(
              existingSubject._id
            );
        } else {
          /*
           * New subject.
           */
          subjectId =
            new mongoose.Types.ObjectId();
        }
      }

      const subjectIdString =
        subjectId.toString();

      /*
       * Prevent duplicate subject IDs.
       */
      if (
        subjectIds.has(subjectIdString)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Duplicate subject ID detected for "${subjectName}".`,
          },
          { status: 400 }
        );
      }

      subjectIds.add(subjectIdString);

      formattedSubjects.push({
        _id: subjectId,

        name: subjectName,

        slug: subjectSlug,

        description: clean(
          subject.description
        ),
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Duration
    |--------------------------------------------------------------------------
    */

    const parsedDuration =
      Number(
        durationMinutes ?? 60
      );

    if (
      !Number.isFinite(
        parsedDuration
      ) ||
      !Number.isInteger(
        parsedDuration
      ) ||
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
    | Active status
    |--------------------------------------------------------------------------
    */

    const finalIsActive =
      isActive !== false;

    /*
    |--------------------------------------------------------------------------
    | Update exam
    |--------------------------------------------------------------------------
    */

    existingExam.name =
      finalName;

    existingExam.slug =
      finalSlug;

    existingExam.description =
      clean(description);

    existingExam.subjects =
      formattedSubjects;

    existingExam.durationMinutes =
      parsedDuration;

    existingExam.isActive =
      finalIsActive;

    await existingExam.save();

    /*
    |--------------------------------------------------------------------------
    | Important subject/question consistency check
    |--------------------------------------------------------------------------
    |
    | If a subject was deleted from the exam, existing questions
    | referencing that subject would become orphaned.
    |
    | We do NOT silently delete those questions.
    |
    | Instead, the API reports how many questions still reference
    | subjects that are no longer present.
    |--------------------------------------------------------------------------
    */

    const currentSubjectIds =
      formattedSubjects.map(
        (subject) =>
          subject._id
      );

    const orphanedQuestionCount =
      await Question.countDocuments({
        examId: existingExam._id,
        ...(currentSubjectIds.length > 0
          ? {
              subjectId: {
                $nin: currentSubjectIds,
              },
            }
          : {}),
      });

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    const updatedExam =
      await Exam.findById(id).lean();

    if (!updatedExam) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Exam was updated but could not be reloaded.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Exam updated successfully.",

        exam: formatExam(
          updatedExam
        ),

        /*
         * This is informational only.
         * Questions are not deleted automatically.
         */
        orphanedQuestionCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "PUT /api/admin/exams/[id] error:",
      error
    );

    /*
    |--------------------------------------------------------------------------
    | Duplicate key
    |--------------------------------------------------------------------------
    */

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An exam or subject with the same slug already exists.",
        },
        { status: 409 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Mongoose validation
    |--------------------------------------------------------------------------
    */

    if (
      error?.name ===
      "ValidationError"
    ) {
      const details =
        Object.values(
          error.errors ?? {}
        ).map(
          (item: any) => ({
            field: item.path,
            message: item.message,
          })
        );

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

    /*
    |--------------------------------------------------------------------------
    | Cast error
    |--------------------------------------------------------------------------
    */

    if (
      error?.name ===
      "CastError"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid exam or subject ID.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update exam.",
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

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    /*
     * Find the exam first.
     */
    const exam =
      await Exam.findById(id);

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
     * Delete questions using the canonical
     * Question.examId relationship.
     */
    const deletedQuestions =
      await Question.deleteMany({
        examId: exam._id,
      });

    /*
     * Delete the exam.
     */
    await Exam.findByIdAndDelete(
      exam._id
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Exam and its questions deleted successfully.",

        deletedQuestions:
          deletedQuestions.deletedCount ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE /api/admin/exams/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete exam.",
      },
      { status: 500 }
    );
  }
}