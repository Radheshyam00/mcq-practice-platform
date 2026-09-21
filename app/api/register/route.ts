import {
  NextRequest,
  NextResponse,
} from "next/server";

import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(
  request: NextRequest,
) {
  try {
    const body = await request.json();

    const name =
      String(body.name ?? "").trim();

    const email =
      String(body.email ?? "")
        .toLowerCase()
        .trim();

    const password =
      String(body.password ?? "");

    if (!name) {
      return NextResponse.json(
        {
          message:
            "Name is required.",
        },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          message:
            "Email is required.",
        },
        { status: 400 },
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          message:
            "Password is required.",
        },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message:
            "Password must contain at least 6 characters.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "An account with this email already exists.",
        },
        { status: 409 },
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12,
      );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      role: "user",

      status: "active",

      permissions: [
        "dashboard.view",
      ],

      image: "",
    });

    return NextResponse.json(
      {
        success: true,

        message:
          "Account created successfully.",

        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create account.",
      },
      { status: 500 },
    );
  }
}

// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/User";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const name = String(body.name ?? "").trim();
//     const email = String(body.email ?? "")
//       .trim()
//       .toLowerCase();
//     const password = String(body.password ?? "");

//     if (!name || name.length < 2) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Name must contain at least 2 characters.",
//         },
//         { status: 400 }
//       );
//     }

//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Please enter a valid email address.",
//         },
//         { status: 400 }
//       );
//     }

//     if (!password || password.length < 6) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Password must contain at least 6 characters.",
//         },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     const existingUser = await User.findOne({
//       email,
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "An account with this email already exists.",
//         },
//         { status: 409 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "student",
//       permissions: [],
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Account created successfully.",
//         user: {
//           id: String(user._id),
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Registration error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Unable to create account.",
//       },
//       { status: 500 }
//     );
//   }
// }