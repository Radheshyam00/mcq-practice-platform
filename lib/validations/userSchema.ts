export function validateUser(input: unknown) {
  if (!input || typeof input !== "object") return { valid: false, errors: ["User must be an object."] };
  const user = input as Record<string, unknown>;
  const errors: string[] = [];
  if (!user.name || typeof user.name !== "string") errors.push("Name is required.");
  if (!user.email || typeof user.email !== "string") errors.push("Email is required.");
  return { valid: errors.length === 0, errors };
}
