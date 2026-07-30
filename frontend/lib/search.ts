import { resolveLocalizedText } from "@/lib/resolveLocalizedText";
import type { Language } from "@/types/common";
import type { Question } from "@/types/question";

export function searchQuestions(
  questions: Question[],
  query: string,
  language: Language,
): Question[] {
  const normalized = query.trim().toLowerCase();

  if (normalized === "") {
    return questions;
  }

  return questions.filter((question) => {
    const title = resolveLocalizedText(question.question, language).toLowerCase();
    const answer = resolveLocalizedText(question.answer, language).toLowerCase();
    return title.includes(normalized) || answer.includes(normalized);
  });
}
