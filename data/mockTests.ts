
export type MockTest = {
  id: string;
  title: string;
  slug: string;
  description: string;
  questions: number;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  demo?: boolean;
};

export const mockTests: MockTest[] = [
  {
    id: "demo-mock-test",
    title: "Demo Mock Test",
    slug: "demo-mock-test",
    description:
      "Try a free demo mock test and experience our timed examination system.",
    questions: 10,
    duration: 10,
    difficulty: "Easy",
    demo: true,
  },

  {
    id: "computer-instructor",
    title: "Computer Instructor",
    slug: "computer-instructor",
    description:
      "Practice Computer Instructor questions under real exam conditions.",
    questions: 50,
    duration: 60,
    difficulty: "Medium",
    demo: false,
  },

  {
    id: "cybersecurity",
    title: "Cybersecurity",
    slug: "cybersecurity",
    description:
      "Test your cybersecurity knowledge with challenging questions.",
    questions: 50,
    duration: 60,
    difficulty: "Hard",
    demo: false,
  },

  {
    id: "ssc-cgl",
    title: "SSC CGL",
    slug: "ssc-cgl",
    description:
      "Practice SSC CGL questions with a complete timed mock examination.",
    questions: 50,
    duration: 60,
    difficulty: "Medium",
    demo: false,
  },
];

