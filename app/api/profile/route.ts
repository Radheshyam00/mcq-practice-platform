
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

/*
 * GET /api/profile
 *
 * Returns the currently authenticated user's profile.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
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
          message: "User account not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name || "",
          email: user.email || "",
          role: user.role || "student",
          image: user.image || "",
          permissions: Array.isArray(user.permissions)
            ? user.permissions
            : [],
          status:
            "status" in user && user.status
              ? user.status
              : "active",
          createdAt: user.createdAt || null,
          updatedAt: user.updatedAt || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load profile.",
      },
      { status: 500 }
    );
  }
}

/*
 * PUT /api/profile
 *
 * Updates the currently authenticated user's editable profile fields.
 *
 * Editable:
 * - name
 * - image
 *
 * Email and role cannot be changed from this endpoint.
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    let body: unknown;

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

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const name =
      typeof data.name === "string"
        ? data.name.trim()
        : "";

    const image =
      typeof data.image === "string"
        ? data.image.trim()
        : "";

    /*
     * Validate name
     */
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required.",
        },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must contain at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Name cannot exceed 100 characters.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate image URL when provided.
     *
     * Empty string is allowed so the user can remove
     * an existing profile image.
     */
    if (image.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile image URL is too long.",
        },
        { status: 400 }
      );
    }

    if (image) {
      try {
        const imageUrl = new URL(image);

        if (
          imageUrl.protocol !== "http:" &&
          imageUrl.protocol !== "https:"
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Profile image must use an HTTP or HTTPS URL.",
            },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "Please provide a valid profile image URL.",
          },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Only update fields that the user is allowed to change.
     *
     * Never accept:
     * - email
     * - role
     * - permissions
     * - password
     * - status
     */
    user.name = name;

    /*
     * Your User model contains image in the current profile/auth
     * setup. Assign an empty string when the user removes it.
     */
    user.image = image;

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select("-password")
      .lean();

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to reload updated profile.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          role: updatedUser.role || "student",
          image: updatedUser.image || "",
          permissions: Array.isArray(updatedUser.permissions)
            ? updatedUser.permissions
            : [],
          status:
            "status" in updatedUser && updatedUser.status
              ? updatedUser.status
              : "active",
          createdAt: updatedUser.createdAt || null,
          updatedAt: updatedUser.updatedAt || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile.",
      },
      { status: 500 }
    );
  }
}

