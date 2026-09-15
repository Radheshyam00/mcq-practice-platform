import type { User } from "@/types/user";

export async function getCurrentUser(): Promise<User | null> {
  // Replace with Auth.js/session lookup in production.
  return null;
}

export function isAdmin(user: User | null) {
  return user?.role === "admin";
}
