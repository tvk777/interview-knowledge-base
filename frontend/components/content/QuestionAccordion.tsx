"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Markdown from "@/components/common/Markdown";
import { useLanguage } from "@/hooks/useLanguage";
import { resolveLocalizedText } from "@/lib/resolveLocalizedText";
import type { Question } from "@/types/question";

interface QuestionAccordionProps {
  question: Question;
}

export default function QuestionAccordion({
  question,
}: QuestionAccordionProps) {
  const { language } = useLanguage();

  return (
    <AccordionItem value={question.id}>
      <AccordionTrigger className="text-sm font-semibold text-foreground">
        {resolveLocalizedText(question.question, language)}
      </AccordionTrigger>
      <AccordionContent className="rounded-md bg-muted/40 px-3 py-2">
        <Markdown content={resolveLocalizedText(question.answer, language)} />
      </AccordionContent>
    </AccordionItem>
  );
}
