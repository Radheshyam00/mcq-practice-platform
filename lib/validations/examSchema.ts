export function validateExam(input: unknown) {
  if (!input || typeof input !== "object") return { valid: false, errors: ["Exam must be an object."] };
  const exam = input as Record<string, unknown>;
  const errors: string[] = [];
  for (const key of ["name", "slug", "description"]) {
    if (!exam[key] || typeof exam[key] !== "string") errors.push(`${key} is required.`);
  }
  return { valid: errors.length === 0, errors };
}
