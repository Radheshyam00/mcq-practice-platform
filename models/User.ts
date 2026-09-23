import mongoose, { Schema, Model } from "mongoose";

export const USER_ROLES = [
  "user",
  "admin",
  "super-admin",
  "question-manager",
  "exam-manager",
  "result-manager",
  "user-manager",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["active", "blocked"] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export const PERMISSION_IDS = [
  "dashboard.view",

  "users.view",
  "users.create",
  "users.edit",
  "users.delete",

  "questions.view",
  "questions.create",
  "questions.edit",
  "questions.delete",

  "exams.view",
  "exams.create",
  "exams.edit",
  "exams.delete",

  "mock-tests.view",
  "mock-tests.create",
  "mock-tests.edit",
  "mock-tests.delete",

  "results.view",
  "results.delete",

  "settings.view",
  "settings.edit",

  "permissions.view",
  "permissions.edit",
] as const;

export type PermissionId = (typeof PERMISSION_IDS)[number];

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      default: "user",
      required: true,
    },

    status: {
      type: String,
      enum: USER_STATUSES,
      default: "active",
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    permissions: {
      type: [String],
      enum: PERMISSION_IDS,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<any> =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default User;