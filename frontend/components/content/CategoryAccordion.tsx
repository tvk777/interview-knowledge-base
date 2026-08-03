"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import QuestionAccordion from "@/components/content/QuestionAccordion";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { Question } from "@/types/question";

interface CategoryAccordionProps {
  category: Category;
  questions: Question[];
}

export default function CategoryAccordion({
  category,
  questions,
}: CategoryAccordionProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  return (
    <AccordionItem value={String(category.id)} className="py-1">
      <AccordionTrigger className="text-base font-semibold">
        {category.name}
      </AccordionTrigger>
      <AccordionContent>
        <div className="mb-1 flex justify-end pl-4">
          <button
            type="button"
            onClick={() => setExpandedQuestions([])}
            className={cn(
              "text-xs text-muted-foreground hover:underline",
              expandedQuestions.length === 0 && "invisible",
            )}
          >
            Collapse all
          </button>
        </div>
        <Accordion
          multiple
          value={expandedQuestions}
          onValueChange={setExpandedQuestions}
          className="border-l pl-4"
        >
          {questions.map((question) => (
            <QuestionAccordion key={question.id} question={question} />
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}
