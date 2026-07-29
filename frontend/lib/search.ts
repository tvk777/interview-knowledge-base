import type { Question } from "@/types/question";

export function searchQuestions(
  questions: Question[],
  query: string,
): Question[] {
  const normalized = query.trim().toLowerCase();

  if (normalized === "") {
    return questions;
  }

  return questions.filter((question) => {
    const title = question.question.en.toLowerCase();
    const answer = question.answer.en.toLowerCase();
    return title.includes(normalized) || answer.includes(normalized);
  });
}
