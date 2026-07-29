import type { Question } from "@/types/question";

export function filterByTags(
  questions: Question[],
  selectedTags: string[],
): Question[] {
  if (selectedTags.length === 0) {
    return questions;
  }

  return questions.filter((question) =>
    selectedTags.every((tag) => question.tags.includes(tag)),
  );
}
