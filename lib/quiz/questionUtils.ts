import type { Question } from "@/types/question";

export function shuffleQuestions(items: Question[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function filterQuestions(items: Question[], search = "") {
  const q = search.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) =>
    [item.question, ...item.tags, item.difficulty].some((v) => v.toLowerCase().includes(q))
  );
}
