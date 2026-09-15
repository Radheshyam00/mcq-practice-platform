import type { Exam } from "@/types/exam";

export const exams: Exam[] = [
  {
    id: "upsc-cse",
    slug: "upsc",
    name: "UPSC Civil Services",
    shortName: "UPSC",
    description: "Practice General Studies, CSAT and other Civil Services topics.",
    category: "Government",
    icon: "🏛️",
    subjects: ["general-studies", "current-affairs", "aptitude"],
    totalQuestions: 10000,
    durationMinutes: 120,
    color: "from-indigo-500 to-blue-600"
  },
  {
    id: "ssc-cgl",
    slug: "ssc-cgl",
    name: "SSC CGL",
    shortName: "SSC CGL",
    description: "Quantitative aptitude, reasoning, English and general awareness.",
    category: "Government",
    icon: "📚",
    subjects: ["quantitative-aptitude", "reasoning", "english", "general-awareness"],
    totalQuestions: 8000,
    durationMinutes: 60,
    color: "from-violet-500 to-purple-600"
  },
  {
    id: "banking",
    slug: "banking",
    name: "Banking Exams",
    shortName: "Banking",
    description: "IBPS, SBI and other banking examination practice.",
    category: "Banking",
    icon: "🏦",
    subjects: ["quantitative-aptitude", "reasoning", "english", "current-affairs"],
    totalQuestions: 7000,
    durationMinutes: 60,
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: "computer-instructor",
    slug: "computer-instructor",
    name: "Computer Instructor",
    shortName: "Computer",
    description: "Computer science, networking, operating systems and IT fundamentals.",
    category: "Technical",
    icon: "💻",
    subjects: ["computer-science", "networking", "operating-systems", "cybersecurity"],
    totalQuestions: 5000,
    durationMinutes: 90,
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "cybersecurity",
    slug: "cybersecurity",
    name: "Cybersecurity",
    shortName: "Cybersecurity",
    description: "SOC, network security, cloud security, DFIR and threat analysis.",
    category: "Technical",
    icon: "🛡️",
    subjects: ["cybersecurity", "networking", "linux", "digital-forensics"],
    totalQuestions: 4000,
    durationMinutes: 90,
    color: "from-slate-700 to-slate-950"
  }
];

export function getExam(slug: string) {
  return exams.find((exam) => exam.slug === slug);
}
