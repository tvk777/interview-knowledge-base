import type { Difficulty, LocalizedText } from "@/types/common";

export interface Question {
  id: string;
  difficulty: Difficulty;
  question: LocalizedText;
  answer: LocalizedText;
  categoryId: number;
  tags: string[];
}
