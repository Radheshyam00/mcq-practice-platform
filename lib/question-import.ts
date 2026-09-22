export type QuestionDifficulty =
  | "Easy"
  | "Medium"
  | "Hard";

export type ImportQuestion = {
  question: string;
  options: [
    string,
    string,
    string,
    string
  ];
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
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
};

const normalizeHeader = (
  value: string
) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

function getValue(
  row: Record<string, unknown>,
  aliases: string[]
): unknown {
  const normalized: Record<
    string,
    unknown
  > = {};

  Object.entries(row).forEach(
    ([key, value]) => {
      normalized[
        normalizeHeader(key)
      ] = value;
    }
  );

  for (const alias of aliases) {
    const value =
      normalized[
        normalizeHeader(alias)
      ];

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

/**
 * Returns null when the value is invalid.
 *
 * This is different from the previous version,
 * which silently returned the default value.
 */
function parseBooleanStrict(
  value: unknown
): {
  value: boolean | null;
  provided: boolean;
} {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return {
      value: null,
      provided: false,
    };
  }

  const normalized = String(
    value
  )
    .trim()
    .toLowerCase();

  if (
    ["true", "1", "yes", "y"].includes(
      normalized
    )
  ) {
    return {
      value: true,
      provided: true,
    };
  }

  if (
    ["false", "0", "no", "n"].includes(
      normalized
    )
  ) {
    return {
      value: false,
      provided: true,
    };
  }

  return {
    value: null,
    provided: true,
  };
}

function parseDifficultyStrict(
  value: unknown
): {
  value: QuestionDifficulty | null;
  provided: boolean;
} {
  const normalized = clean(value)
    .toLowerCase();

  if (!normalized) {
    return {
      value: null,
      provided: false,
    };
  }

  if (normalized === "easy") {
    return {
      value: "Easy",
      provided: true,
    };
  }

  if (normalized === "medium") {
    return {
      value: "Medium",
      provided: true,
    };
  }

  if (normalized === "hard") {
    return {
      value: "Hard",
      provided: true,
    };
  }

  return {
    value: null,
    provided: true,
  };
}

function parseCorrectAnswer(
  value: unknown,
  options: string[]
): number | null {
  const raw = clean(value);

  if (!raw) {
    return null;
  }

  const normalized =
    raw.toLowerCase();

  /*
   * A / B / C / D
   */
  const letters: Record<
    string,
    number
  > = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
  };

  if (
    letters[normalized] !==
    undefined
  ) {
    return letters[normalized];
  }

  /*
   * 0 / 1 / 2 / 3
   */
  if (/^[0-3]$/.test(normalized)) {
    return Number(normalized);
  }

  /*
   * 1 / 2 / 3 / 4
   */
  if (/^[1-4]$/.test(normalized)) {
    return Number(normalized) - 1;
  }

  /*
   * Exact option text
   */
  const optionIndex =
    options.findIndex(
      (option) =>
        option
          .trim()
          .toLowerCase() ===
        normalized
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
  const errors: ImportError[] =
    [];

  /*
   * QUESTION
   */
  const question = clean(
    getValue(row, [
      "question",
      "questionText",
      "text",
    ])
  );

  /*
   * OPTIONS
   */
  const optionA = clean(
    getValue(row, [
      "optionA",
      "option1",
      "a",
    ])
  );

  const optionB = clean(
    getValue(row, [
      "optionB",
      "option2",
      "b",
    ])
  );

  const optionC = clean(
    getValue(row, [
      "optionC",
      "option3",
      "c",
    ])
  );

  const optionD = clean(
    getValue(row, [
      "optionD",
      "option4",
      "d",
    ])
  );

  let options: string[] = [
    optionA,
    optionB,
    optionC,
    optionD,
  ];

  /*
   * JSON may provide:
   *
   * options: [
   *   "A",
   *   "B",
   *   "C",
   *   "D"
   * ]
   */
  const rawOptions = getValue(
    row,
    ["options"]
  );

  if (
    Array.isArray(rawOptions)
  ) {
    if (
      rawOptions.length === 4
    ) {
      options = rawOptions.map(
        (item) => clean(item)
      );
    }
  }

  /*
   * QUESTION ERROR
   */
  if (!question) {
    errors.push({
      row: rowNumber,
      field: "question",
      message:
        "Question is required.",
    });
  }

  /*
   * OPTION ERRORS
   *
   * Report every missing option
   * individually so the editor can
   * fix the exact field.
   */
  if (!options[0]) {
    errors.push({
      row: rowNumber,
      field: "option1",
      message:
        "Option 1 is required.",
    });
  }

  if (!options[1]) {
    errors.push({
      row: rowNumber,
      field: "option2",
      message:
        "Option 2 is required.",
    });
  }

  if (!options[2]) {
    errors.push({
      row: rowNumber,
      field: "option3",
      message:
        "Option 3 is required.",
    });
  }

  if (!options[3]) {
    errors.push({
      row: rowNumber,
      field: "option4",
      message:
        "Option 4 is required.",
    });
  }

  /*
   * EXACTLY FOUR OPTIONS
   */
  if (options.length !== 4) {
    errors.push({
      row: rowNumber,
      field: "options",
      message:
        "Exactly 4 options are required.",
    });
  }

  /*
   * CORRECT ANSWER
   */
  const correctAnswerRaw =
    getValue(row, [
      "correctAnswer",
      "answer",
      "correct",
    ]);

  const correctAnswer =
    parseCorrectAnswer(
      correctAnswerRaw,
      options
    );

  if (correctAnswer === null) {
    errors.push({
      row: rowNumber,
      field: "correctAnswer",
      message:
        "Correct answer must be A/B/C/D, 0-3, 1-4, or exact option text.",
    });
  }

  /*
   * EXPLANATION
   */
  const explanation = clean(
    getValue(row, [
      "explanation",
      "solution",
    ])
  );

  if (!explanation) {
    errors.push({
      row: rowNumber,
      field: "explanation",
      message:
        "Explanation is required.",
    });
  }

  /*
   * SUBJECT
   */
  const subject = clean(
    getValue(row, ["subject"])
  );

  if (!subject) {
    errors.push({
      row: rowNumber,
      field: "subject",
      message:
        "Subject is required.",
    });
  }

  /*
   * TOPIC
   */
  const topic = clean(
    getValue(row, [
      "topic",
      "chapter",
    ])
  );

  if (!topic) {
    errors.push({
      row: rowNumber,
      field: "topic",
      message:
        "Topic is required.",
    });
  }

  /*
   * EXAM
   */
  const exam = clean(
    getValue(row, [
      "exam",
      "examSlug",
      "examId",
    ])
  );

  if (!exam) {
    errors.push({
      row: rowNumber,
      field: "exam",
      message:
        "Exam is required.",
    });
  }

  /*
   * DIFFICULTY
   */
  const difficultyResult =
    parseDifficultyStrict(
      getValue(row, [
        "difficulty",
        "level",
      ])
    );

  let difficulty: QuestionDifficulty =
    "Medium";

  if (
    !difficultyResult.provided
  ) {
    difficulty = "Medium";
  } else if (
    difficultyResult.value === null
  ) {
    errors.push({
      row: rowNumber,
      field: "difficulty",
      message:
        "Difficulty must be Easy, Medium, or Hard.",
    });
  } else {
    difficulty =
      difficultyResult.value;
  }

  /*
   * DAILY QUIZ
   */
  const dailyQuizResult =
    parseBooleanStrict(
      getValue(row, [
        "isDailyQuiz",
        "dailyQuiz",
      ])
    );

  let isDailyQuiz = false;

  if (
    !dailyQuizResult.provided
  ) {
    isDailyQuiz = false;
  } else if (
    dailyQuizResult.value === null
  ) {
    errors.push({
      row: rowNumber,
      field: "isDailyQuiz",
      message:
        "isDailyQuiz must be true or false.",
    });
  } else {
    isDailyQuiz =
      dailyQuizResult.value;
  }

  /*
   * ACTIVE
   */
  const activeResult =
    parseBooleanStrict(
      getValue(row, [
        "isActive",
        "active",
      ])
    );

  let isActive = true;

  if (!activeResult.provided) {
    isActive = true;
  } else if (
    activeResult.value === null
  ) {
    errors.push({
      row: rowNumber,
      field: "isActive",
      message:
        "isActive must be true or false.",
    });
  } else {
    isActive =
      activeResult.value;
  }

  /*
   * DO NOT CREATE DATA WHEN
   * VALIDATION ERRORS EXIST.
   */
  if (
    errors.length > 0 ||
    correctAnswer === null ||
    options.length !== 4
  ) {
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
  rows: Record<
    string,
    unknown
  >[]
) {
  const errors: ImportError[] =
    [];

  const questions: ImportQuestion[] =
    [];

  const duplicateKeys =
    new Set<string>();

  rows.forEach((row, index) => {
    /*
     * CSV:
     *
     * Row 1 = header
     * Row 2 = first question
     *
     * Therefore index 0 = row 2.
     */
    const rowNumber =
      index + 2;

    const result =
      normalizeQuestion(
        row,
        rowNumber
      );

    errors.push(
      ...result.errors
    );

    if (result.data) {
      const duplicateKey =
        `${result.data.exam.toLowerCase()}::${result.data.question
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim()}`;

      if (
        duplicateKeys.has(
          duplicateKey
        )
      ) {
        errors.push({
          row: rowNumber,
          field: "question",
          message:
            "Duplicate question found in this import file.",
        });
      } else {
        duplicateKeys.add(
          duplicateKey
        );

        questions.push(
          result.data
        );
      }
    }
  });

  return {
    questions,
    errors,
  };
}