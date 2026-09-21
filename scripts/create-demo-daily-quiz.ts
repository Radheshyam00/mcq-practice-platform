
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
    timestamps: true,
  }
);

const Exam =
  mongoose.models.Exam ||
  mongoose.model("Exam", examSchema);

/*
 * Question schema
 */
const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    correctAnswer: {
      type: Number,
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    exam: {
      type: String,
      default: "",
    },

    subject: {
      type: String,
      default: "",
    },

    topic: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    isDailyQuiz: {
      type: Boolean,
      default: false,
    },

    /*
     * true = available to guests as demo content
     * false = available only to logged-in users
     */
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

const Question =
  mongoose.models.Question ||
  mongoose.model("Question", questionSchema);

/*
 * Demo Daily Quiz questions
 */
const demoQuestions = [
  {
    question: "Which protocol is primarily used to securely browse websites?",
    options: [
      "HTTP",
      "HTTPS",
      "FTP",
      "SMTP",
    ],
    correctAnswer: 1,
    explanation:
      "HTTPS uses TLS to provide encrypted and authenticated communication between a browser and web server.",
    subject: "Computer Science",
    topic: "Computer Networks",
    difficulty: "Easy",
  },

  {
    question: "Which data structure follows the Last-In, First-Out principle?",
    options: [
      "Queue",
      "Stack",
      "Linked List",
      "Graph",
    ],
    correctAnswer: 1,
    explanation:
      "A stack follows the Last-In, First-Out (LIFO) principle.",
    subject: "Computer Science",
    topic: "Data Structures",
    difficulty: "Easy",
  },

  {
    question: "What is the capital of India?",
    options: [
      "Mumbai",
      "New Delhi",
      "Jaipur",
      "Kolkata",
    ],
    correctAnswer: 1,
    explanation:
      "New Delhi is the capital of India.",
    subject: "General Knowledge",
    topic: "Indian Geography",
    difficulty: "Easy",
  },

  {
    question: "Which number comes next in the sequence: 2, 4, 8, 16, ?",
    options: [
      "20",
      "24",
      "32",
      "36",
    ],
    correctAnswer: 2,
    explanation:
      "Each number is multiplied by 2, so the next number is 32.",
    subject: "Reasoning",
    topic: "Number Series",
    difficulty: "Easy",
  },

  {
    question: "Which component of a computer performs arithmetic and logical operations?",
    options: [
      "RAM",
      "ALU",
      "Hard Disk",
      "Control Bus",
    ],
    correctAnswer: 1,
    explanation:
      "The Arithmetic Logic Unit (ALU) performs arithmetic and logical operations.",
    subject: "Computer Science",
    topic: "Computer Organization",
    difficulty: "Easy",
  },

  {
    question: "Which layer of the OSI model is responsible for routing packets between networks?",
    options: [
      "Transport Layer",
      "Network Layer",
      "Session Layer",
      "Presentation Layer",
    ],
    correctAnswer: 1,
    explanation:
      "The Network Layer is responsible for logical addressing and routing packets between networks.",
    subject: "Computer Science",
    topic: "Networking",
    difficulty: "Medium",
  },

  {
    question: "If all cats are animals and some animals are pets, which conclusion is definitely true?",
    options: [
      "All cats are pets",
      "Some cats are pets",
      "All pets are cats",
      "All cats are animals",
    ],
    correctAnswer: 3,
    explanation:
      "The first statement directly establishes that every cat is an animal.",
    subject: "Reasoning",
    topic: "Syllogism",
    difficulty: "Easy",
  },

  {
    question: "Which SQL command is used to retrieve data from a database?",
    options: [
      "INSERT",
      "UPDATE",
      "SELECT",
      "DELETE",
    ],
    correctAnswer: 2,
    explanation:
      "SELECT is used to retrieve records from a database.",
    subject: "Computer Science",
    topic: "DBMS",
    difficulty: "Easy",
  },

  {
    question: "Which gas is most abundant in Earth's atmosphere?",
    options: [
      "Oxygen",
      "Carbon Dioxide",
      "Nitrogen",
      "Hydrogen",
    ],
    correctAnswer: 2,
    explanation:
      "Nitrogen makes up the largest portion of Earth's atmosphere.",
    subject: "General Knowledge",
    topic: "General Science",
    difficulty: "Easy",
  },

  {
    question: "A train travels 60 km in 1 hour. How far will it travel in 3 hours at the same speed?",
    options: [
      "120 km",
      "150 km",
      "180 km",
      "240 km",
    ],
    correctAnswer: 2,
    explanation:
      "Distance = speed × time = 60 × 3 = 180 km.",
    subject: "Mathematics",
    topic: "Time and Distance",
    difficulty: "Easy",
  },
];

/*
 * Create Demo Daily Quiz
 */
async function createDemoDailyQuiz() {
  try {
    console.log("");
    console.log("================================");
    console.log("Creating Demo Daily Quiz");
    console.log("================================");
    console.log("");

    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI!);

    console.log("MongoDB connected successfully.");
    console.log("");

    /*
     * Find the demo exam created by create-demo-exam.ts
     */
    const demoExam = await Exam.findOne({
      slug: "demo",
      isActive: true,
    });

    if (!demoExam) {
      throw new Error(
        'Demo exam not found. Run "npm run create-demo-exam" first.'
      );
    }

    console.log(`Demo exam found: ${demoExam.name}`);
    console.log(`Exam ID: ${demoExam._id}`);
    console.log("");

    /*
     * Remove old demo Daily Quiz questions.
     *
     * This makes the script safe to run again.
     */
    const deleteResult = await Question.deleteMany({
      examId: demoExam._id,
      isDailyQuiz: true,
      demo: true,
    });

    console.log(
      `Removed ${deleteResult.deletedCount} existing demo Daily Quiz questions.`
    );

    /*
     * Prepare questions
     */
    const questionsToInsert = demoQuestions.map((item) => ({
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,

      examId: demoExam._id,
      exam: demoExam.name,

      subject: item.subject,
      topic: item.topic,
      difficulty: item.difficulty,

      isDailyQuiz: true,

      // IMPORTANT:
      // These questions are available to guests.
      demo: true,

      isActive: true,
    }));

    /*
     * Insert questions
     */
    const createdQuestions = await Question.insertMany(
      questionsToInsert
    );

    console.log("");
    console.log(
      `Created ${createdQuestions.length} demo Daily Quiz questions.`
    );

    console.log("");
    console.log("================================");
    console.log("DEMO DAILY QUIZ CREATED");
    console.log("================================");
    console.log(`Exam:      ${demoExam.name}`);
    console.log(`Questions: ${createdQuestions.length}`);
    console.log(`Demo:      true`);
    console.log(`Daily:     true`);
    console.log(`Active:    true`);
    console.log("================================");
    console.log("");

    console.log(
      "Guests will see the first 5 demo questions."
    );

    console.log(
      "Logged-in users can access the complete Daily Quiz."
    );

    console.log("");
  } catch (error) {
    console.error("");
    console.error("Failed to create demo Daily Quiz:");
    console.error(error);
    console.error("");

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createDemoDailyQuiz();

