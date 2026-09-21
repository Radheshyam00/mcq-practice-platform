import mongoose, {
  Schema,
  models,
  model,
  Document,
} from "mongoose";

export interface ISubject {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
}

export interface IExam extends Document {
  name: string;
  slug: string;
  description: string;
  subjects: ISubject[];
  durationMinutes: number;
  isActive: boolean;
  demo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  }
);

const ExamSchema = new Schema<IExam>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    subjects: {
      type: [SubjectSchema],
      default: [],
    },

    durationMinutes: {
      type: Number,
      default: 60,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    demo: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Exam =
  models.Exam ||
  model<IExam>("Exam", ExamSchema);