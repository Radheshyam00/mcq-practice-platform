import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getAdminSession } from "@/lib/admin-auth";
import {
  ALL_PERMISSION_IDS,
  USER_ROLES,
  USER_STATUSES,
  UserRole,
  UserStatus,
} from "@/lib/user-permissions";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/admin/users/:id
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(id)
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        image: user.image || "",
        permissions: user.permissions || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load user" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users/:id
 */
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const body = await request.json();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (body.name !== undefined) {
      const name = String(body.name).trim();

      if (!name) {
        return NextResponse.json(
          { error: "Name cannot be empty" },
          { status: 400 }
        );
      }

      user.name = name;
    }

    if (body.email !== undefined) {
      const email = String(body.email)
        .trim()
        .toLowerCase();

      if (!email) {
        return NextResponse.json(
          { error: "Email cannot be empty" },
          { status: 400 }
        );
      }

      const emailExists = await User.findOne({
        email,
        _id: {
          $ne: id,
        },
      }).lean();

      if (emailExists) {
        return NextResponse.json(
          {
            error: "Another user already uses this email",
          },
          { status: 409 }
        );
      }

      user.email = email;
    }

    if (body.role !== undefined) {
      const role = String(body.role) as UserRole;

      if (!USER_ROLES.includes(role)) {
        return NextResponse.json(
          { error: "Invalid role" },
          { status: 400 }
        );
      }

      user.role = role;
    }

    if (body.status !== undefined) {
      const status = String(body.status) as UserStatus;

      if (!USER_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }

      user.status = status;
    }

    if (body.password !== undefined) {
      const password = String(body.password);

      if (password.length > 0) {
        if (password.length < 6) {
          return NextResponse.json(
            {
              error:
                "Password must contain at least 6 characters",
            },
            { status: 400 }
          );
        }

        user.password = await bcrypt.hash(password, 12);
      }
    }

    if (body.permissions !== undefined) {
      if (!Array.isArray(body.permissions)) {
        return NextResponse.json(
          {
            error: "Permissions must be an array",
          },
          { status: 400 }
        );
      }

      const validPermissions = body.permissions.filter(
        (permission: unknown) =>
          typeof permission === "string" &&
          ALL_PERMISSION_IDS.includes(
            permission as (typeof ALL_PERMISSION_IDS)[number]
          )
      );

      user.permissions = validPermissions;
    }

    /**
     * Super admin always has all permissions.
     */
    if (user.role === "super-admin") {
      user.permissions = [...ALL_PERMISSION_IDS];
    }

    await user.save();

    return NextResponse.json({
      message: "User updated successfully",

      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        image: user.image || "",
        permissions: user.permissions || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update user",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * DELETE /api/admin/users/:id
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    /**
     * Prevent an admin from deleting their own account.
     */
    if (session.user.id === id) {
      return NextResponse.json(
        {
          error: "You cannot delete your own account",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete user",
      },
      {
        status: 500,
      }
    );
  }
}


// import {
//   NextRequest,
//   NextResponse,
// } from "next/server";

// import {
//   getServerSession,
// } from "next-auth";

// import mongoose from "mongoose";

// import { authOptions } from "@/lib/auth";
// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/User";

// const ADMIN_ROLES = [
//   "admin",
//   "super-admin",
//   "question-manager",
//   "exam-manager",
//   "result-manager",
//   "user-manager",
// ];

// const VALID_ROLES = [
//   "user",
//   "admin",
//   "super-admin",
//   "question-manager",
//   "exam-manager",
//   "result-manager",
//   "user-manager",
// ];

// const VALID_STATUSES = [
//   "active",
//   "blocked",
// ];

// const VALID_PERMISSIONS = [
//   "dashboard.view",

//   "users.view",
//   "users.create",
//   "users.edit",
//   "users.delete",

//   "questions.view",
//   "questions.create",
//   "questions.edit",
//   "questions.delete",

//   "exams.view",
//   "exams.create",
//   "exams.edit",
//   "exams.delete",

//   "mock-tests.view",
//   "mock-tests.create",
//   "mock-tests.edit",
//   "mock-tests.delete",

//   "results.view",
//   "results.delete",

//   "settings.view",
//   "settings.edit",

//   "permissions.view",
//   "permissions.edit",
// ];

// export async function PATCH(
//   request: NextRequest,
//   context: {
//     params: Promise<{
//       id: string;
//     }>;
//   },
// ) {
//   try {
//     const session =
//       await getServerSession(
//         authOptions,
//       );

//     if (!session?.user) {
//       return NextResponse.json(
//         {
//           message:
//             "Unauthorized",
//         },
//         { status: 401 },
//       );
//     }

//     if (
//       !ADMIN_ROLES.includes(
//         session.user.role,
//       )
//     ) {
//       return NextResponse.json(
//         {
//           message:
//             "You do not have permission to modify users.",
//         },
//         { status: 403 },
//       );
//     }

//     const { id } =
//       await context.params;

//     if (
//       !mongoose.Types.ObjectId.isValid(
//         id,
//       )
//     ) {
//       return NextResponse.json(
//         {
//           message:
//             "Invalid user ID.",
//         },
//         { status: 400 },
//       );
//     }

//     const body =
//       await request.json();

//     const role =
//       body.role;

//     const status =
//       body.status;

//     const permissions =
//       body.permissions;

//     if (
//       role &&
//       !VALID_ROLES.includes(role)
//     ) {
//       return NextResponse.json(
//         {
//           message:
//             "Invalid role.",
//         },
//         { status: 400 },
//       );
//     }

//     if (
//       status &&
//       !VALID_STATUSES.includes(
//         status,
//       )
//     ) {
//       return NextResponse.json(
//         {
//           message:
//             "Invalid status.",
//         },
//         { status: 400 },
//       );
//     }

//     if (
//       permissions !== undefined
//     ) {
//       if (
//         !Array.isArray(
//           permissions,
//         )
//       ) {
//         return NextResponse.json(
//           {
//             message:
//               "Permissions must be an array.",
//           },
//           { status: 400 },
//         );
//       }

//       const invalidPermissions =
//         permissions.filter(
//           (
//             permission: string,
//           ) =>
//             !VALID_PERMISSIONS.includes(
//               permission,
//             ),
//         );

//       if (
//         invalidPermissions.length >
//         0
//       ) {
//         return NextResponse.json(
//           {
//             message:
//               "Invalid permissions detected.",
//           },
//           { status: 400 },
//         );
//       }
//     }

//     await connectDB();

//     const user =
//       await User.findById(id);

//     if (!user) {
//       return NextResponse.json(
//         {
//           message:
//             "User not found.",
//         },
//         { status: 404 },
//       );
//     }

//     /*
//      * Prevent admin from blocking
//      * their own account.
//      */
//     if (
//       user._id.toString() ===
//       session.user.id
//     ) {
//       if (
//         status === "blocked"
//       ) {
//         return NextResponse.json(
//           {
//             message:
//               "You cannot block your own account.",
//           },
//           { status: 400 },
//         );
//       }

//       if (role === "user") {
//         return NextResponse.json(
//           {
//             message:
//               "You cannot change your own account to User.",
//           },
//           { status: 400 },
//         );
//       }
//     }

//     /*
//      * Update role.
//      */
//     if (role) {
//       user.role = role;
//     }

//     /*
//      * Update status.
//      */
//     if (status) {
//       user.status = status;
//     }

//     /*
//      * Super Admin always has every
//      * permission.
//      */
//     if (
//       user.role ===
//       "super-admin"
//     ) {
//       user.permissions = [
//         ...VALID_PERMISSIONS,
//       ];
//     } else if (
//       permissions !== undefined
//     ) {
//       user.permissions = [
//         ...new Set(
//           permissions,
//         ),
//       ];
//     }

//     /*
//      * Normal user should at least
//      * have dashboard.view.
//      */
//     if (
//       user.role === "user" &&
//       user.permissions.length === 0
//     ) {
//       user.permissions = [
//         "dashboard.view",
//       ];
//     }

//     await user.save();

//     const updatedUser =
//       await User.findById(id)
//         .select("-password")
//         .lean();

//     return NextResponse.json({
//       success: true,

//       message:
//         "User updated successfully.",

//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error(
//       "UPDATE USER ERROR:",
//       error,
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           "Failed to update user.",
//       },
//       { status: 500 },
//     );
//   }
// }