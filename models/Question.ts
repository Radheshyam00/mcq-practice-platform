import mongoose, {
  Schema,
  models,
  model,
  Document,
} from "mongoose";

export interface IQuestion extends Document {
  question: string;

  options: [
    string,
    string,
    string,
    string
  ];

  /**
   * Zero-based answer index:
   *
   * A = 0
   * B = 1
   * C = 2
   * D = 3
   */
  correctAnswer: number;

  explanation: string;

  examId: mongoose.Types.ObjectId;

  subjectId: mongoose.Types.ObjectId;

  /**
   * Temporary compatibility/display fields.
   */
  exam?: string;

  subject?: string;

  topic: string;

  difficulty:
    | "Easy"
    | "Medium"
    | "Hard";

  isDailyQuiz: boolean;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

const QuestionSchema =
  new Schema<IQuestion>(
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
          validator: (
            value: string[]
          ) =>
            Array.isArray(value) &&
            value.length === 4 &&
            value.every(
              (item) =>
                typeof item === "string" &&
                item.trim().length > 0
            ),

          message:
            "A question must have exactly 4 non-empty options.",
        },
      },

      correctAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 3,

        validate: {
          validator: Number.isInteger,
          message:
            "Correct answer must be an integer between 0 and 3.",
        },
      },

      explanation: {
        type: String,
        default: "",
        trim: true,
      },

      examId: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
        index: true,
      },

      subjectId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },

      exam: {
        type: String,
        trim: true,
      },

      subject: {
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

QuestionSchema.index({
  examId: 1,
  subjectId: 1,
  topic: 1,
});

QuestionSchema.index({
  examId: 1,
  subjectId: 1,
  difficulty: 1,
});

QuestionSchema.index({
  isDailyQuiz: 1,
  isActive: 1,
});

QuestionSchema.index({
  subject: 1,
  topic: 1,
  exam: 1,
});

export const Question =
  models.Question ||
  model<IQuestion>(
    "Question",
    QuestionSchema
  );