import KnowledgeBase from "@/components/content/KnowledgeBase";
import { getCategories, getQuestions } from "@/services/knowledge-base";

interface ContentProps {
  technology: string;
}

export default async function Content({ technology }: ContentProps) {
  const [categories, questions] = await Promise.all([
    getCategories(technology),
    getQuestions(technology),
  ]);

  return <KnowledgeBase categories={categories} questions={questions} />;
}
