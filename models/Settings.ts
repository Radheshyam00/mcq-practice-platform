import { Schema, model, models, Document } from "mongoose";

export interface ISettings extends Document {
  websiteName: string;
  websiteDescription: string;

  defaultDuration: number;
  questionsPerQuiz: number;
  showExplanations: boolean;
  allowQuestionNavigation: boolean;

  newUserNotifications: boolean;
  newResultNotifications: boolean;

  requireAdminAuthentication: boolean;
  sessionTimeout: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    websiteName: {
      type: String,
      default: "MCQ Practice",
      trim: true,
    },

    websiteDescription: {
      type: String,
      default:
        "Practice multiple choice questions for competitive exams.",
      trim: true,
    },

    defaultDuration: {
      type: Number,
      default: 30,
      min: 1,
    },

    questionsPerQuiz: {
      type: Number,
      default: 20,
      min: 1,
    },

    showExplanations: {
      type: Boolean,
      default: true,
    },

    allowQuestionNavigation: {
      type: Boolean,
      default: true,
    },

    newUserNotifications: {
      type: Boolean,
      default: true,
    },

    newResultNotifications: {
      type: Boolean,
      default: false,
    },

    requireAdminAuthentication: {
      type: Boolean,
      default: true,
    },

    sessionTimeout: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Settings =
  models.Settings || model<ISettings>("Settings", SettingsSchema);