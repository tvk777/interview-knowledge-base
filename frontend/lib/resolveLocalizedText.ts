import type { Language, LocalizedText } from "@/types/common";

export function resolveLocalizedText(
  text: LocalizedText,
  language: Language,
): string {
  return text[language] || text.en;
}
