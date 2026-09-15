import type { Question } from "@/types/question";

export const questions: Question[] = [
  {
    id: "q1",
    examSlug: "computer-instructor",
    subjectSlug: "computer-science",
    question: "Which data structure follows the LIFO principle?",
    options: [
      { id: "a", text: "Queue" },
      { id: "b", text: "Stack" },
      { id: "c", text: "Linked list" },
      { id: "d", text: "Tree" }
    ],
    correctOptionId: "b",
    explanation: "A stack follows Last-In, First-Out (LIFO): the most recently pushed item is removed first.",
    difficulty: "Easy",
    tags: ["data-structures", "stack"]
  },
  {
    id: "q2",
    examSlug: "computer-instructor",
    subjectSlug: "networking",
    question: "Which protocol is primarily used to resolve a domain name to an IP address?",
    options: [
      { id: "a", text: "DHCP" },
      { id: "b", text: "DNS" },
      { id: "c", text: "ARP" },
      { id: "d", text: "FTP" }
    ],
    correctOptionId: "b",
    explanation: "DNS translates domain names such as example.com into IP addresses.",
    difficulty: "Easy",
    tags: ["dns", "networking"]
  },
  {
    id: "q3",
    examSlug: "cybersecurity",
    subjectSlug: "cybersecurity",
    question: "Which security principle gives a user only the permissions required to perform a task?",
    options: [
      { id: "a", text: "Defense in depth" },
      { id: "b", text: "Least privilege" },
      { id: "c", text: "Non-repudiation" },
      { id: "d", text: "Availability" }
    ],
    correctOptionId: "b",
    explanation: "Least privilege minimizes permissions and therefore reduces the impact of misuse or compromise.",
    difficulty: "Easy",
    tags: ["security", "access-control"]
  },
  {
    id: "q4",
    examSlug: "cybersecurity",
    subjectSlug: "digital-forensics",
    question: "What is the main purpose of a cryptographic hash in digital forensics?",
    options: [
      { id: "a", text: "To encrypt evidence" },
      { id: "b", text: "To prove evidence integrity" },
      { id: "c", text: "To recover deleted files" },
      { id: "d", text: "To compress evidence" }
    ],
    correctOptionId: "b",
    explanation: "Hashes provide a repeatable fingerprint that can be compared to verify that evidence has not changed.",
    difficulty: "Medium",
    tags: ["forensics", "hashing"]
  },
  {
    id: "q5",
    examSlug: "ssc-cgl",
    subjectSlug: "quantitative-aptitude",
    question: "If a number is increased by 20% and becomes 120, what was the original number?",
    options: [
      { id: "a", text: "90" },
      { id: "b", text: "100" },
      { id: "c", text: "110" },
      { id: "d", text: "115" }
    ],
    correctOptionId: "b",
    explanation: "120 represents 120% of the original. Original = 120 / 1.2 = 100.",
    difficulty: "Easy",
    tags: ["percentage", "arithmetic"]
  },
  {
    id: "q6",
    examSlug: "ssc-cgl",
    subjectSlug: "reasoning",
    question: "Find the next number: 2, 4, 8, 16, ?",
    options: [
      { id: "a", text: "20" },
      { id: "b", text: "24" },
      { id: "c", text: "32" },
      { id: "d", text: "36" }
    ],
    correctOptionId: "c",
    explanation: "Each term is multiplied by 2, so 16 × 2 = 32.",
    difficulty: "Easy",
    tags: ["series", "reasoning"]
  },
  {
    id: "q7",
    examSlug: "upsc",
    subjectSlug: "general-studies",
    question: "The Constitution of India describes India as a:",
    options: [
      { id: "a", text: "Federal monarchy" },
      { id: "b", text: "Sovereign, Socialist, Secular, Democratic Republic" },
      { id: "c", text: "Unitary republic only" },
      { id: "d", text: "Parliamentary monarchy" }
    ],
    correctOptionId: "b",
    explanation: "The Preamble declares India a Sovereign Socialist Secular Democratic Republic.",
    difficulty: "Easy",
    tags: ["polity", "constitution"]
  },
  {
    id: "q8",
    examSlug: "banking",
    subjectSlug: "english",
    question: "Choose the word closest in meaning to 'abundant'.",
    options: [
      { id: "a", text: "Scarce" },
      { id: "b", text: "Plentiful" },
      { id: "c", text: "Weak" },
      { id: "d", text: "Empty" }
    ],
    correctOptionId: "b",
    explanation: "Abundant means existing in large quantities; plentiful is a close synonym.",
    difficulty: "Easy",
    tags: ["vocabulary"]
  }
];

export function getQuestion(id: string) {
  return questions.find((question) => question.id === id);
}

export function getQuestionsByExam(examSlug: string) {
  return questions.filter((question) => question.examSlug === examSlug);
}

export function getQuestionsBySubject(subjectSlug: string) {
  return questions.filter((question) => question.subjectSlug === subjectSlug);
}
