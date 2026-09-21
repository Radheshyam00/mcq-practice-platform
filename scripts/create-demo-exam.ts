import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is missing. Make sure .env.local exists in the project root."
  );
}

const subjectSchema = new mongoose.Schema(
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

const examSchema = new mongoose.Schema(
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
      type: [subjectSchema],
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
    },
  },
  {
    timestamps: true,
  }
);

const Exam =
  mongoose.models.Exam ||
  mongoose.model("Exam", examSchema);

async function createDemoExam() {
  try {
    console.log("");
    console.log("================================");
    console.log("Creating Demo Exam");
    console.log("================================");

    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI!);

    console.log("MongoDB connected successfully.");

    const existingExam = await Exam.findOne({
      slug: "demo",
    });

    if (existingExam) {
      existingExam.demo = true;
      existingExam.isActive = true;

      await existingExam.save();

      console.log("");
      console.log("================================");
      console.log("DEMO EXAM ALREADY EXISTS");
      console.log("================================");
      console.log(`ID:       ${existingExam._id}`);
      console.log(`Name:     ${existingExam.name}`);
      console.log(`Slug:     ${existingExam.slug}`);
      console.log(`Demo:     ${existingExam.demo}`);
      console.log(`Active:   ${existingExam.isActive}`);
      console.log(`Subjects: ${existingExam.subjects.length}`);
      console.log("================================");
      console.log("");

      return;
    }

    const demoExam = await Exam.create({
      name: "Demo Exam",

      slug: "demo",

      description:
        "Practice with our free demo exam and experience the MCQ Practice platform.",

      durationMinutes: 30,

      isActive: true,

      demo: true,

      subjects: [
        {
          name: "General Knowledge",
          slug: "general-knowledge",
          description:
            "General knowledge and awareness questions.",
        },
        {
          name: "Computer Science",
          slug: "computer-science",
          description:
            "Basic computer science and technology questions.",
        },
        {
          name: "Reasoning",
          slug: "reasoning",
          description:
            "Logical reasoning and analytical ability questions.",
        },
      ],
    });

    console.log("");
    console.log("================================");
    console.log("DEMO EXAM CREATED SUCCESSFULLY");
    console.log("================================");
    console.log(`ID:       ${demoExam._id}`);
    console.log(`Name:     ${demoExam.name}`);
    console.log(`Slug:     ${demoExam.slug}`);
    console.log(`Demo:     ${demoExam.demo}`);
    console.log(`Active:   ${demoExam.isActive}`);
    console.log(`Subjects: ${demoExam.subjects.length}`);
    console.log("================================");
    console.log("");
  } catch (error) {
    console.error("");
    console.error("================================");
    console.error("FAILED TO CREATE DEMO EXAM");
    console.error("================================");
    console.error(error);
    console.error("");
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createDemoExam();