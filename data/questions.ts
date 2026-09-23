import type { Question } from "@/types/question";

export const questions: Question[] = [
  {
    id: "q1",
    examSlug: "computer-instructor",
    subjectSlug: "computer-science",
    question: "Which data structure follows the LIFO principle?",
    options: [
      "Queue",
      "Stack",
      "Linked list",
      "Tree",
    ],
    correctAnswer: 1,
    explanation:
      "A stack follows Last-In, First-Out (LIFO): the most recently pushed item is removed first.",
    difficulty: "Easy",
    tags: ["data-structures", "stack"],
  },

  {
    id: "q2",
    examSlug: "computer-instructor",
    subjectSlug: "networking",
    question:
      "Which protocol is primarily used to resolve a domain name to an IP address?",
    options: [
      "DHCP",
      "DNS",
      "ARP",
      "FTP",
    ],
    correctAnswer: 1,
    explanation:
      "DNS translates domain names such as example.com into IP addresses.",
    difficulty: "Easy",
    tags: ["dns", "networking"],
  },

  {
    id: "q3",
    examSlug: "cybersecurity",
    subjectSlug: "cybersecurity",
    question:
      "Which security principle gives a user only the permissions required to perform a task?",
    options: [
      "Defense in depth",
      "Least privilege",
      "Non-repudiation",
      "Availability",
    ],
    correctAnswer: 1,
    explanation:
      "Least privilege minimizes permissions and therefore reduces the impact of misuse or compromise.",
    difficulty: "Easy",
    tags: ["security", "access-control"],
  },

  {
    id: "q4",
    examSlug: "cybersecurity",
    subjectSlug: "digital-forensics",
    question:
      "What is the main purpose of a cryptographic hash in digital forensics?",
    options: [
      "To encrypt evidence",
      "To prove evidence integrity",
      "To recover deleted files",
      "To compress evidence",
    ],
    correctAnswer: 1,
    explanation:
      "Hashes provide a repeatable fingerprint that can be compared to verify that evidence has not changed.",
    difficulty: "Medium",
    tags: ["forensics", "hashing"],
  },

  {
    id: "q5",
    examSlug: "ssc-cgl",
    subjectSlug: "quantitative-aptitude",
    question:
      "If a number is increased by 20% and becomes 120, what was the original number?",
    options: [
      "90",
      "100",
      "110",
      "115",
    ],
    correctAnswer: 1,
    explanation:
      "120 represents 120% of the original. Original = 120 / 1.2 = 100.",
    difficulty: "Easy",
    tags: ["percentage", "arithmetic"],
  },

  {
    id: "q6",
    examSlug: "ssc-cgl",
    subjectSlug: "reasoning",
    question: "Find the next number: 2, 4, 8, 16, ?",
    options: [
      "20",
      "24",
      "32",
      "36",
    ],
    correctAnswer: 2,
    explanation:
      "Each term is multiplied by 2, so 16 × 2 = 32.",
    difficulty: "Easy",
    tags: ["series", "reasoning"],
  },

  {
    id: "q7",
    examSlug: "upsc",
    subjectSlug: "general-studies",
    question: "The Constitution of India describes India as a:",
    options: [
      "Federal monarchy",
      "Sovereign, Socialist, Secular, Democratic Republic",
      "Unitary republic only",
      "Parliamentary monarchy",
    ],
    correctAnswer: 1,
    explanation:
      "The Preamble declares India a Sovereign Socialist Secular Democratic Republic.",
    difficulty: "Easy",
    tags: ["polity", "constitution"],
  },

  {
    id: "q8",
    examSlug: "banking",
    subjectSlug: "english",
    question:
      "Choose the word closest in meaning to 'abundant'.",
    options: [
      "Scarce",
      "Plentiful",
      "Weak",
      "Empty",
    ],
    correctAnswer: 1,
    explanation:
      "Abundant means existing in large quantities; plentiful is a close synonym.",
    difficulty: "Easy",
    tags: ["vocabulary"],
  },
];

export function getQuestion(id: string) {
  return questions.find((question) => question.id === id);
}

export function getQuestionsByExam(examSlug: string) {
  return questions.filter(
    (question) => question.examSlug === examSlug
  );
}

export function getQuestionsBySubject(subjectSlug: string) {
  return questions.filter(
    (question) => question.subjectSlug === subjectSlug
  );
}