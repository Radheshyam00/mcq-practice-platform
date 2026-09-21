import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is missing. Make sure .env.local exists in the project root."
  );
}

/*
 * Exam schema
 * We only need slug/name for finding the Demo Exam.
 */
const examSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    subjects: Array,
    durationMinutes: Number,
    isActive: Boolean,
    demo: Boolean,
  },
  {
    collection: "exams",
  }
);

const Exam =
  mongoose.models.Exam ||
  mongoose.model("Exam", examSchema);

/*
 * Mock Test schema
 */
const mockTestSchema = new mongoose.Schema(
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
      trim: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
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
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const MockTest =
  mongoose.models.MockTest ||
  mongoose.model("MockTest", mockTestSchema);

async function createDemoMockTest() {
  try {
    console.log("");
    console.log("================================");
    console.log("Creating Demo Mock Test");
    console.log("================================");

    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI!);

    console.log("MongoDB connected successfully.");

    /*
     * Find the Demo Exam
     */
    const demoExam = await Exam.findOne({
      slug: "demo",
    });

    if (!demoExam) {
      throw new Error(
        'Demo Exam was not found. Run "npm run create-demo-exam" first.'
      );
    }

    console.log("");
    console.log("Demo Exam found:");
    console.log(`ID:   ${demoExam._id}`);
    console.log(`Name: ${demoExam.name}`);
    console.log(`Slug: ${demoExam.slug}`);

    /*
     * Check whether demo mock test already exists
     */
    const existingMockTest = await MockTest.findOne({
      slug: "demo-mock-test",
    });

    if (existingMockTest) {
      existingMockTest.demo = true;
      existingMockTest.isActive = true;
      existingMockTest.examId = demoExam._id;

      await existingMockTest.save();

      console.log("");
      console.log("================================");
      console.log("DEMO MOCK TEST ALREADY EXISTS");
      console.log("================================");
      console.log(`ID:         ${existingMockTest._id}`);
      console.log(`Title:      ${existingMockTest.title}`);
      console.log(`Slug:       ${existingMockTest.slug}`);
      console.log(`Exam ID:    ${existingMockTest.examId}`);
      console.log(`Questions:  ${existingMockTest.questionCount}`);
      console.log(`Duration:   ${existingMockTest.durationMinutes} min`);
      console.log(`Difficulty: ${existingMockTest.difficulty}`);
      console.log(`Demo:       ${existingMockTest.demo}`);
      console.log(`Active:     ${existingMockTest.isActive}`);
      console.log("================================");
      console.log("");

      return;
    }

    /*
     * Create Demo Mock Test
     */
    const demoMockTest = await MockTest.create({
      title: "Demo Mock Test",

      slug: "demo-mock-test",

      description:
        "Try our free demo mock test and experience timed exam practice before unlocking the complete mock test library.",

      examId: demoExam._id,

      questionCount: 20,

      durationMinutes: 20,

      difficulty: "Mixed",

      demo: true,

      isActive: true,
    });

    console.log("");
    console.log("================================");
    console.log("DEMO MOCK TEST CREATED");
    console.log("================================");
    console.log(`ID:         ${demoMockTest._id}`);
    console.log(`Title:      ${demoMockTest.title}`);
    console.log(`Slug:       ${demoMockTest.slug}`);
    console.log(`Exam ID:    ${demoMockTest.examId}`);
    console.log(`Questions:  ${demoMockTest.questionCount}`);
    console.log(`Duration:   ${demoMockTest.durationMinutes} min`);
    console.log(`Difficulty: ${demoMockTest.difficulty}`);
    console.log(`Demo:       ${demoMockTest.demo}`);
    console.log(`Active:     ${demoMockTest.isActive}`);
    console.log("================================");
    console.log("");
  } catch (error) {
    console.error("");
    console.error("================================");
    console.error("FAILED TO CREATE DEMO MOCK TEST");
    console.error("================================");
    console.error(error);
    console.error("");
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createDemoMockTest();