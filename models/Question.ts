import mongoose, {
  Schema,
  models,
  model,
  Document,
} from "mongoose";

export interface IQuestion extends Document {
  question: string;

  options: string[];

  correctAnswer: number;

  explanation: string;

  // New MongoDB relationships
  examId: mongoose.Types.ObjectId;

  subjectId: mongoose.Types.ObjectId;

  // Keep these temporarily for compatibility
  exam?: string;

  subject?: string;

  topic: string;

  difficulty: "Easy" | "Medium" | "Hard";

  isDailyQuiz: boolean;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,

      validate: {
        validator: (value: string[]) =>
          value.length === 4,

        message:
          "A question must have exactly 4 options.",
      },
    },

    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    /*
     * MongoDB Exam reference
     */
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    /*
     * MongoDB Subject reference
     *
     * This references:
     *
     * Exam.subjects._id
     */
    subjectId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    /*
     * Keep old fields temporarily.
     *
     * These can be removed after
     * migrating your existing questions.
     */
    subject: {
      type: String,
      trim: true,
    },

    exam: {
      type: String,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,

      enum: [
        "Easy",
        "Medium",
        "Hard",
      ],

      default: "Medium",
    },

    isDailyQuiz: {
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

/*
 * Main query index
 *
 * Find questions by:
 * Exam → Subject → Topic
 */
QuestionSchema.index({
  examId: 1,
  subjectId: 1,
  topic: 1,
});

/*
 * Useful for filtering questions
 */
QuestionSchema.index({
  examId: 1,
  subjectId: 1,
  difficulty: 1,
});

/*
 * Daily quiz
 */
QuestionSchema.index({
  isDailyQuiz: 1,
  isActive: 1,
});

/*
 * Backward compatibility index
 */
QuestionSchema.index({
  subject: 1,
  topic: 1,
  exam: 1,
});

export const Question =
  models.Question ||
  model<IQuestion>("Question", QuestionSchema);