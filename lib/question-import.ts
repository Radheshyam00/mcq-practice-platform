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

const clean = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const normalizeHeader = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

function getValue(
  row: Record<string, unknown>,
  aliases: string[]
): unknown {
  const normalized: Record<string, unknown> = {};

  Object.entries(row).forEach(([key, value]) => {
    normalized[normalizeHeader(key)] = value;
  });

  for (const alias of aliases) {
    const value = normalized[normalizeHeader(alias)];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return "";
}

function parseBoolean(
  value: unknown,
  defaultValue: boolean
): boolean {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  const normalized = String(value).trim().toLowerCase();

  if (["true", "1", "yes", "y"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "n"].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

function parseDifficulty(value: unknown): QuestionDifficulty {
  const normalized = clean(value).toLowerCase();

  if (normalized === "easy") return "Easy";
  if (normalized === "hard") return "Hard";

  return "Medium";
}

function parseCorrectAnswer(
  value: unknown,
  options: string[]
): number | null {
  const raw = clean(value);

  if (!raw) return null;

  const normalized = raw.toLowerCase();

  // A/B/C/D
  const letters: Record<string, number> = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
  };

  if (letters[normalized] !== undefined) {
    return letters[normalized];
  }

  // 0/1/2/3
  if (/^[0-3]$/.test(normalized)) {
    return Number(normalized);
  }

  // 1/2/3/4
  if (/^[1-4]$/.test(normalized)) {
    return Number(normalized) - 1;
  }

  // Exact option text
  const optionIndex = options.findIndex(
    (option) => option.trim().toLowerCase() === normalized
  );

  if (optionIndex >= 0) {
    return optionIndex;
  }

  return null;
}

export function normalizeQuestion(
  row: Record<string, unknown>,
  rowNumber: number
): {
  data: ImportQuestion | null;
  errors: ImportError[];
} {
  const errors: ImportError[] = [];

  const question = clean(
    getValue(row, ["question", "questionText", "text"])
  );

  const optionA = clean(
    getValue(row, ["optionA", "option1", "a"])
  );

  const optionB = clean(
    getValue(row, ["optionB", "option2", "b"])
  );

  const optionC = clean(
    getValue(row, ["optionC", "option3", "c"])
  );

  const optionD = clean(
    getValue(row, ["optionD", "option4", "d"])
  );

  let options: string[] = [
    optionA,
    optionB,
    optionC,
    optionD,
  ];

  // JSON may provide options: [...]
  const rawOptions = getValue(row, ["options"]);

  if (
    Array.isArray(rawOptions) &&
    rawOptions.length === 4
  ) {
    options = rawOptions.map((item) => clean(item));
  }

  const correctAnswerRaw = getValue(row, [
    "correctAnswer",
    "answer",
    "correct",
  ]);

  const correctAnswer = parseCorrectAnswer(
    correctAnswerRaw,
    options
  );

  const explanation = clean(
    getValue(row, ["explanation", "solution"])
  );

  const subject = clean(
    getValue(row, ["subject"])
  );

  const topic = clean(
    getValue(row, ["topic", "chapter"])
  );

  const exam = clean(
    getValue(row, ["exam", "examSlug", "examId"])
  );

  const difficulty = parseDifficulty(
    getValue(row, ["difficulty", "level"])
  );

  const isDailyQuiz = parseBoolean(
    getValue(row, ["isDailyQuiz", "dailyQuiz"]),
    false
  );

  const isActive = parseBoolean(
    getValue(row, ["isActive", "active"]),
    true
  );

  if (!question) {
    errors.push({
      row: rowNumber,
      field: "question",
      message: "Question is required.",
    });
  }

  if (options.some((option) => !option)) {
    errors.push({
      row: rowNumber,
      field: "options",
      message: "Exactly 4 non-empty options are required.",
    });
  }

  if (correctAnswer === null) {
    errors.push({
      row: rowNumber,
      field: "correctAnswer",
      message:
        "Correct answer must be A/B/C/D, 0-3, 1-4, or exact option text.",
    });
  }

  if (!explanation) {
    errors.push({
      row: rowNumber,
      field: "explanation",
      message: "Explanation is required.",
    });
  }

  if (!subject) {
    errors.push({
      row: rowNumber,
      field: "subject",
      message: "Subject is required.",
    });
  }

  if (!topic) {
    errors.push({
      row: rowNumber,
      field: "topic",
      message: "Topic is required.",
    });
  }

  if (!exam) {
    errors.push({
      row: rowNumber,
      field: "exam",
      message: "Exam is required.",
    });
  }

  if (errors.length > 0 || correctAnswer === null) {
    return {
      data: null,
      errors,
    };
  }

  return {
    data: {
      question,
      options: options as [
        string,
        string,
        string,
        string
      ],
      correctAnswer,
      explanation,
      subject,
      topic,
      exam,
      difficulty,
      isDailyQuiz,
      isActive,
    },
    errors: [],
  };
}

export function validateImportRows(
  rows: Record<string, unknown>[]
) {
  const errors: ImportError[] = [];
  const questions: ImportQuestion[] = [];

  const duplicateKeys = new Set<string>();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const result = normalizeQuestion(
      row,
      rowNumber
    );

    errors.push(...result.errors);

    if (result.data) {
      const duplicateKey =
        `${result.data.exam.toLowerCase()}::${result.data.question
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim()}`;

      if (duplicateKeys.has(duplicateKey)) {
        errors.push({
          row: rowNumber,
          field: "question",
          message:
            "Duplicate question found in this import file.",
        });
      } else {
        duplicateKeys.add(duplicateKey);
        questions.push(result.data);
      }
    }
  });

  return {
    questions,
    errors,
  };
}