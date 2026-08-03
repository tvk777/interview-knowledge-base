"use client";

import { useEffect, useRef, useState } from "react";

import { Accordion } from "@/components/ui/accordion";
import CategoryAccordion from "@/components/content/CategoryAccordion";
import QuestionAccordion from "@/components/content/QuestionAccordion";
import { useLanguage } from "@/hooks/useLanguage";
import { useSearch } from "@/hooks/useSearch";
import { filterByTags } from "@/lib/filterByTags";
import { searchQuestions } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { Question } from "@/types/question";

interface KnowledgeBaseProps {
  categories: Category[];
  questions: Question[];
}

function EmptyState() {
  return (
    <div className="py-8 text-center text-sm text-muted-foreground">
      <p>No questions match the current filters.</p>
      <p>Try a different keyword or tag.</p>
    </div>
  );
}

export default function KnowledgeBase({
  categories,
  questions,
}: KnowledgeBaseProps) {
  const { query, selectedTag } = useSearch();
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLElement>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedTag]);

  const isFiltering = query.trim() !== "" || selectedTag !== null;

  let content;

  if (!isFiltering) {
    content = (
      <Accordion>
        {categories.map((category) => (
          <CategoryAccordion
            key={category.id}
            category={category}
            questions={questions.filter(
              (question) => question.categoryId === category.id,
            )}
          />
        ))}
      </Accordion>
    );
  } else {
    const visible = filterByTags(
      searchQuestions(questions, query, language),
      selectedTag ? [selectedTag] : [],
    );

    content =
      visible.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold">
              Search Results ({visible.length})
            </h2>
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
          >
            {visible.map((question) => (
              <QuestionAccordion key={question.id} question={question} />
            ))}
          </Accordion>
        </div>
      );
  }

  return (
    <main ref={scrollRef} className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto max-w-3xl">{content}</div>
    </main>
  );
}
