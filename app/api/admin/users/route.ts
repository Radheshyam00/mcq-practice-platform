import { NextResponse } from "next/server";
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

/**
 * GET /api/admin/users
 */
export async function GET(request: Request) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";

    const filter = search
      ? {
          $or: [
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              email: {
                $regex: search,
                $options: "i",
              },
            },
            {
              role: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const formattedUsers = users.map((user) => ({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      image: user.image || "",
      permissions: user.permissions || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json({
      users: formattedUsers,
      total: formattedUsers.length,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load users",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST /api/admin/users
 */
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    const role = String(body.role || "user") as UserRole;

    const status = String(body.status || "active") as UserStatus;

    let permissions: string[] = Array.isArray(body.permissions)
      ? body.permissions.filter((permission: unknown) =>
          typeof permission === "string"
        )
      : [];

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must contain at least 6 characters",
        },
        { status: 400 }
      );
    }

    if (!USER_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    if (!USER_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      email,
    }).lean();

    if (existingUser) {
      return NextResponse.json(
        {
          error: "A user with this email already exists",
        },
        { status: 409 }
      );
    }

    permissions = permissions.filter((permission) =>
      ALL_PERMISSION_IDS.includes(
        permission as (typeof ALL_PERMISSION_IDS)[number]
      )
    );

    /**
     * Super admin automatically receives every permission.
     */
    if (role === "super-admin") {
      permissions = [...ALL_PERMISSION_IDS];
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status,
      permissions,
      image: "",
    });

    return NextResponse.json(
      {
        message: "User created successfully",

        user: {
          id: String(createdUser._id),
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          status: createdUser.status,
          image: createdUser.image || "",
          permissions: createdUser.permissions || [],
          createdAt: createdUser.createdAt,
          updatedAt: createdUser.updatedAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create user",
      },
      {
        status: 500,
      }
    );
  }
}


// import {
//   NextResponse,
// } from "next/server";

// import {
//   getServerSession,
// } from "next-auth";

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

// export async function GET() {
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
//             "You do not have permission to view users.",
//         },
//         { status: 403 },
//       );
//     }

//     await connectDB();

//     const users =
//       await User.find({})
//         .select("-password")
//         .sort({
//           createdAt: -1,
//         })
//         .lean();

//     return NextResponse.json({
//       success: true,
//       users,
//     });
//   } catch (error) {
//     console.error(
//       "GET USERS ERROR:",
//       error,
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           "Failed to load users.",
//       },
//       { status: 500 },
//     );
//   }
// }