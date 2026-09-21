import mongoose, {
  Schema,
  models,
  model,
  Document,
} from "mongoose";

export interface IResult extends Document {
  userId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;

  studentName: string;
  examName: string;

  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  totalQuestions: number;

  timeTakenSeconds: number;

  type: "practice" | "mock-test" | "daily-quiz";

  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema = new Schema<IResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    examName: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    correct: {
      type: Number,
      required: true,
      min: 0,
    },

    wrong: {
      type: Number,
      default: 0,
      min: 0,
    },

    skipped: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    timeTakenSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    type: {
      type: String,
      enum: ["practice", "mock-test", "daily-quiz"],
      default: "mock-test",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ResultSchema.index({ createdAt: -1 });
ResultSchema.index({ examId: 1, createdAt: -1 });
ResultSchema.index({ userId: 1, createdAt: -1 });

export const Result =
  models.Result || model<IResult>("Result", ResultSchema);