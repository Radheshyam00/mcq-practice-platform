// lib/question-import.ts

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export type ImportQuestion = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  subject: string;
  topic: string;
  exam: string;
  difficulty: QuestionDifficulty;
  isDailyQuiz: boolean;
  isActive: boolean;
};

export type ImportError = {
  row: number;
  field: string;
  message: string;
};

/**
 * Clean a value safely.
 */
function clean(value: unknown): string {
  return String(value ?? "").trim();
}

/**
 * Normalize CSV/JSON headers.
 *
 * Examples:
 * "Correct Answer" -> "correctanswer"
 * "correct_answer" -> "correctanswer"
 * "Option-1"       -> "option1"
 */
function normalizeHeader(value: unknown): string {
  return clean(value)
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

/**
 * Get a value using multiple possible field aliases.
 */
function getValue(
  row: Record<string, unknown>,
  aliases: string[]
): unknown {
  const normalizedEntries: [string, unknown][] = Object.entries(row).map(
    ([key, value]): [string, unknown] => [normalizeHeader(key), value]
  );

  const map = new Map<string, unknown>(normalizedEntries);

  for (const alias of aliases) {
    const value = map.get(normalizeHeader(alias));

    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
}

/**
 * Strict boolean parser.
 */
function parseBooleanStrict(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = clean(value).toLowerCase();

  if (["true", "1", "yes", "y"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "n"].includes(normalized)) {
    return false;
  }

  return null;
}

/**
 * Parse difficulty.
 */
function parseDifficultyStrict(
  value: unknown
): QuestionDifficulty | null {
  const normalized = clean(value).toLowerCase();

  if (normalized === "easy") {
    return "Easy";
  }

  if (normalized === "medium") {
    return "Medium";
  }

  if (normalized === "hard") {
    return "Hard";
  }

  return null;
}

/**
 * Parse correct answer.
 *
 * CANONICAL FORMAT:
 * A = 0
 * B = 1
 * C = 2
 * D = 3
 *
 * Also accepts:
 * - "A", "B", "C", "D"
 * - 0, 1, 2, 3
 * - exact option text
 *
 * For imports, numeric values 0-3 are treated as zero-based.
 *
 * Numeric 1-4 is intentionally NOT interpreted as one-based because
 * that creates ambiguity with the canonical value 1 = option B.
 */
function parseCorrectAnswer(
  value: unknown,
  options: [string, string, string, string]
): number | null {
  if (typeof value === "number") {
    if (
      Number.isInteger(value) &&
      value >= 0 &&
      value <= 3
    ) {
      return value;
    }

    return null;
  }

  const normalized = clean(value);

  if (!normalized) {
    return null;
  }

  const upper = normalized.toUpperCase();

  if (upper === "A") return 0;
  if (upper === "B") return 1;
  if (upper === "C") return 2;
  if (upper === "D") return 3;

  // Canonical numeric representation: 0-3.
  if (/^[0-3]$/.test(normalized)) {
    return Number(normalized);
  }

  // Allow exact option text.
  const optionIndex = options.findIndex(
    (option) =>
      option.trim().toLowerCase() === normalized.toLowerCase()
  );

  if (optionIndex >= 0) {
    return optionIndex;
  }

  return null;
}

/**
 * Normalize a single imported question.
 */
export function normalizeQuestion(
  row: Record<string, unknown>
): {
  question: ImportQuestion | null;
  errors: ImportError[];
} {
  const errors: ImportError[] = [];

  const question = clean(
    getValue(row, ["question", "Question"])
  );

  const optionValues = [
    getValue(row, [
      "option1",
      "option 1",
      "optionA",
      "option A",
      "a",
    ]),
    getValue(row, [
      "option2",
      "option 2",
      "optionB",
      "option B",
      "b",
    ]),
    getValue(row, [
      "option3",
      "option 3",
      "optionC",
      "option C",
      "c",
    ]),
    getValue(row, [
      "option4",
      "option 4",
      "optionD",
      "option D",
      "d",
    ]),
  ];

  /**
   * Also support JSON:
   *
   * {
   *   options: ["A", "B", "C", "D"]
   * }
   */
  const rawOptions = getValue(row, ["options"]);

  let options: [string, string, string, string];

  if (
    Array.isArray(rawOptions) &&
    rawOptions.length === 4
  ) {
    options = [
      clean(rawOptions[0]),
      clean(rawOptions[1]),
      clean(rawOptions[2]),
      clean(rawOptions[3]),
    ];
  } else {
    options = [
      clean(optionValues[0]),
      clean(optionValues[1]),
      clean(optionValues[2]),
      clean(optionValues[3]),
    ];
  }

  const missingOptions = options.some(
    (option) => !option
  );

  if (missingOptions) {
    errors.push({
      row: 0,
      field: "options",
      message:
        "All four options are required. Use option1-option4 or an options array with exactly 4 values.",
    });
  }

  const rawCorrectAnswer = getValue(row, [
    "correctAnswer",
    "correct answer",
    "correct_answer",
    "answer",
    "correctOption",
    "correct option",
  ]);

  const correctAnswer = parseCorrectAnswer(
    rawCorrectAnswer,
    options
  );

  if (correctAnswer === null) {
    errors.push({
      row: 0,
      field: "correctAnswer",
      message:
        "Correct answer must be A, B, C, D, a zero-based number 0-3, or exactly match one of the four options.",
    });
  }

  if (!question) {
    errors.push({
      row: 0,
      field: "question",
      message: "Question is required.",
    });
  }

  const explanation = clean(
    getValue(row, ["explanation"])
  );

  const exam = clean(
    getValue(row, [
      "exam",
      "examName",
      "exam name",
      "examSlug",
    ])
  );

  if (!exam) {
    errors.push({
      row: 0,
      field: "exam",
      message: "Exam is required.",
    });
  }

  const subject = clean(
    getValue(row, [
      "subject",
      "subjectName",
      "subject name",
      "subjectSlug",
    ])
  );

  if (!subject) {
    errors.push({
      row: 0,
      field: "subject",
      message: "Subject is required.",
    });
  }

  const topic = clean(
    getValue(row, ["topic"])
  );

  if (!topic) {
    errors.push({
      row: 0,
      field: "topic",
      message: "Topic is required.",
    });
  }

  const rawDifficulty = getValue(row, [
    "difficulty",
  ]);

  const difficulty =
    parseDifficultyStrict(rawDifficulty);

  if (!difficulty) {
    errors.push({
      row: 0,
      field: "difficulty",
      message:
        "Difficulty must be Easy, Medium, or Hard.",
    });
  }

  const rawDailyQuiz = getValue(row, [
    "isDailyQuiz",
    "is daily quiz",
    "dailyQuiz",
    "daily quiz",
  ]);

  let isDailyQuiz = false;

  if (
    rawDailyQuiz !== undefined &&
    clean(rawDailyQuiz) !== ""
  ) {
    const parsed = parseBooleanStrict(rawDailyQuiz);

    if (parsed === null) {
      errors.push({
        row: 0,
        field: "isDailyQuiz",
        message:
          "isDailyQuiz must be true/false, 1/0, yes/no, or y/n.",
      });
    } else {
      isDailyQuiz = parsed;
    }
  }

  const rawActive = getValue(row, [
    "isActive",
    "is active",
    "active",
  ]);

  let isActive = true;

  if (
    rawActive !== undefined &&
    clean(rawActive) !== ""
  ) {
    const parsed = parseBooleanStrict(rawActive);

    if (parsed === null) {
      errors.push({
        row: 0,
        field: "isActive",
        message:
          "isActive must be true/false, 1/0, yes/no, or y/n.",
      });
    } else {
      isActive = parsed;
    }
  }

  if (errors.length > 0) {
    return {
      question: null,
      errors,
    };
  }

  return {
    question: {
      question,
      options,
      correctAnswer: correctAnswer as number,
      explanation,
      exam,
      subject,
      topic,
      difficulty: difficulty as QuestionDifficulty,
      isDailyQuiz,
      isActive,
    },
    errors: [],
  };
}

/**
 * Validate all imported rows.
 */
export function validateImportRows(
  rows: Record<string, unknown>[]
): {
  questions: ImportQuestion[];
  errors: ImportError[];
} {
  const questions: ImportQuestion[] = [];
  const errors: ImportError[] = [];

  const seen = new Set<string>();

  rows.forEach((row, index) => {
    // CSV header is row 1, therefore first data row = 2.
    const rowNumber = index + 2;

    const result = normalizeQuestion(row);

    for (const error of result.errors) {
      errors.push({
        ...error,
        row: rowNumber,
      });
    }

    if (!result.question) {
      return;
    }

    const normalizedQuestion = result.question.question
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

    const normalizedExam = result.question.exam
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

    const duplicateKey =
      `${normalizedExam}::${normalizedQuestion}`;

    if (seen.has(duplicateKey)) {
      errors.push({
        row: rowNumber,
        field: "question",
        message:
          "Duplicate question found in the import file for the same exam.",
      });

      return;
    }

    seen.add(duplicateKey);
    questions.push(result.question);
  });

  return {
    questions,
    errors,
  };
}