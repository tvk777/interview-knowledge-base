import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Markdown from "@/components/common/Markdown";
import type { Question } from "@/types/question";

interface QuestionAccordionProps {
  question: Question;
}

export default function QuestionAccordion({
  question,
}: QuestionAccordionProps) {
  return (
    <AccordionItem value={question.id}>
      <AccordionTrigger className="text-sm font-normal">
        {question.question.en}
      </AccordionTrigger>
      <AccordionContent>
        <Markdown content={question.answer.en} />
      </AccordionContent>
    </AccordionItem>
  );
}
