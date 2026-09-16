import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is missing. Make sure .env.local exists in the project root."
  );
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI!);

    console.log("MongoDB connected successfully.");

    const name = "Administrator";
    const email = "admin@example.com";
    const password = "Admin@123456";

    const permissions = [
      "users",
      "exams",
      "questions",
      "results",
      "settings",
    ];

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log("Admin already exists.");
        console.log(`Email: ${email}`);
        return;
      }

      existingUser.role = "admin";
      existingUser.permissions = permissions;

      await existingUser.save();

      console.log("Existing user promoted to admin.");
      console.log(`Email: ${email}`);

      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      permissions,
    });

    console.log("");
    console.log("================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("================================");
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log("================================");
    console.log("");
  } catch (error) {
    console.error("");
    console.error("Failed to create admin:");
    console.error(error);
    console.error("");
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();