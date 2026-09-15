export function validateQuestion(input: unknown) {
  if (!input || typeof input !== "object") return { valid: false, errors: ["Question must be an object."] };
  const q = input as Record<string, unknown>;
  const errors: string[] = [];
  if (!q.question || typeof q.question !== "string") errors.push("Question text is required.");
  if (!Array.isArray(q.options) || q.options.length < 2) errors.push("At least two options are required.");
  if (!q.correctOptionId) errors.push("Correct option is required.");
  return { valid: errors.length === 0, errors };
}
