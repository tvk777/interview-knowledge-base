import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import QuestionAccordion from "@/components/content/QuestionAccordion";
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
  return (
    <AccordionItem value={String(category.id)} className="py-1">
      <AccordionTrigger className="text-base font-semibold">
        {category.name}
      </AccordionTrigger>
      <AccordionContent>
        <Accordion className="border-l pl-4">
          {questions.map((question) => (
            <QuestionAccordion key={question.id} question={question} />
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}
