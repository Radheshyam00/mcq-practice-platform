import mongoose, {
  Document,
  Schema,
  model,
  models,
} from "mongoose";

export interface IMockTest extends Document {
  title: string;
  slug: string;
  examId: mongoose.Types.ObjectId;
  description: string;
  questionCount: number;
  durationMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  demo: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MockTestSchema = new Schema<IMockTest>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    questionCount: {
      type: Number,
      required: true,
      min: 1,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Mixed"],
      default: "Mixed",
    },

    demo: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

MockTestSchema.index({
  examId: 1,
  isActive: 1,
});

export const MockTest =
  models.MockTest ||
  model<IMockTest>("MockTest", MockTestSchema);