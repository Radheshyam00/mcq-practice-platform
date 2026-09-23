import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const ADMIN_ROLES = [
  "admin",
  "super-admin",
  "question-manager",
  "exam-manager",
  "result-manager",
  "user-manager",
] as const;

function isAdminRole(role?: string) {
  return !!role && ADMIN_ROLES.includes(
    role as (typeof ADMIN_ROLES)[number]
  );
}

async function getAuthorizedSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  if (!isAdminRole(session.user.role)) {
    return null;
  }

  return session;
}

/**
 * GET /api/admin/profile
 *
 * Get the currently logged-in administrator profile.
 */
export async function GET() {
  try {
    const session = await getAuthorizedSession();

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

    const user = await User.findById(session.user.id)
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name ?? "",
        email: user.email ?? "",
        role: user.role ?? "user",
        status: user.status ?? "active",
        image: user.image ?? "",
        phone: user.phone ?? "",
        bio: user.bio ?? "",
        permissions: user.permissions ?? [],
        createdAt: user.createdAt ?? null,
        updatedAt: user.updatedAt ?? null,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load profile",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/profile
 *
 * Update the currently logged-in administrator profile.
 *
 * Editable:
 * - name
 * - phone
 * - bio
 * - image
 *
 * Protected:
 * - email
 * - password
 * - role
 * - status
 * - permissions
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getAuthorizedSession();

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

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body",
        },
        { status: 400 }
      );
    }

    /*
     * Never allow the profile endpoint to modify
     * sensitive account fields.
     */
    const protectedFields = [
      "email",
      "password",
      "role",
      "status",
      "permissions",
      "_id",
      "id",
    ];

    const attemptedProtectedField = protectedFields.find(
      (field) => field in body
    );

    if (attemptedProtectedField) {
      return NextResponse.json(
        {
          success: false,
          message: `${attemptedProtectedField} cannot be changed from the profile page`,
        },
        { status: 403 }
      );
    }

    const update: Record<string, string> = {};

    /* -------------------------
       Name
    ------------------------- */

    if (body.name !== undefined) {
      if (typeof body.name !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "Name must be a string",
          },
          { status: 400 }
        );
      }

      const name = body.name.trim();

      if (!name) {
        return NextResponse.json(
          {
            success: false,
            message: "Name is required",
          },
          { status: 400 }
        );
      }

      if (name.length < 2) {
        return NextResponse.json(
          {
            success: false,
            message: "Name must contain at least 2 characters",
          },
          { status: 400 }
        );
      }

      if (name.length > 100) {
        return NextResponse.json(
          {
            success: false,
            message: "Name cannot exceed 100 characters",
          },
          { status: 400 }
        );
      }

      update.name = name;
    }

    /* -------------------------
       Phone
    ------------------------- */

    if (body.phone !== undefined) {
      if (typeof body.phone !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "Phone must be a string",
          },
          { status: 400 }
        );
      }

      const phone = body.phone.trim();

      if (phone.length > 30) {
        return NextResponse.json(
          {
            success: false,
            message: "Phone number cannot exceed 30 characters",
          },
          { status: 400 }
        );
      }

      update.phone = phone;
    }

    /* -------------------------
       Bio
    ------------------------- */

    if (body.bio !== undefined) {
      if (typeof body.bio !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "Bio must be a string",
          },
          { status: 400 }
        );
      }

      const bio = body.bio.trim();

      if (bio.length > 500) {
        return NextResponse.json(
          {
            success: false,
            message: "Bio cannot exceed 500 characters",
          },
          { status: 400 }
        );
      }

      update.bio = bio;
    }

    /* -------------------------
       Profile Image
    ------------------------- */

    if (body.image !== undefined) {
      if (typeof body.image !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "Image must be a string",
          },
          { status: 400 }
        );
      }

      const image = body.image.trim();

      if (image.length > 2000) {
        return NextResponse.json(
          {
            success: false,
            message: "Image value is too long",
          },
          { status: 400 }
        );
      }

      update.image = image;
    }

    /* -------------------------
       Nothing to update
    ------------------------- */

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid profile fields were provided",
        },
        { status: 400 }
      );
    }

    /* -------------------------
       Update MongoDB
    ------------------------- */

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: update,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-password")
      .lean();

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name ?? "",
        email: updatedUser.email ?? "",
        role: updatedUser.role ?? "user",
        status: updatedUser.status ?? "active",
        image: updatedUser.image ?? "",
        phone: updatedUser.phone ?? "",
        bio: updatedUser.bio ?? "",
        permissions: updatedUser.permissions ?? [],
        createdAt: updatedUser.createdAt ?? null,
        updatedAt: updatedUser.updatedAt ?? null,
      },
    });
  } catch (error) {
    console.error("PUT /api/admin/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      { status: 500 }
    );
  }
}