export const mockTests = [
  { id: "mock-computer-1", examSlug: "computer-instructor", title: "Computer Instructor Mock Test 1", questions: 50, durationMinutes: 60, difficulty: "Mixed" },
  { id: "mock-cyber-1", examSlug: "cybersecurity", title: "Cybersecurity Mock Test 1", questions: 40, durationMinutes: 45, difficulty: "Mixed" },
  { id: "mock-ssc-1", examSlug: "ssc-cgl", title: "SSC CGL Full Mock 1", questions: 50, durationMinutes: 60, difficulty: "Mixed" }
];
export function getMockTest(id: string) {
  return mockTests.find((test) => test.id === id);
}
