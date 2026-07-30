import { connection } from "next/server";
import { notFound } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import Content from "@/components/content/Content";
import Sidebar from "@/components/sidebar/Sidebar";
import { getTags, getTechnologies } from "@/services/knowledge-base";

interface TechnologyPageProps {
  params: Promise<{ technology: string }>;
}

export default async function TechnologyPage({
  params,
}: TechnologyPageProps) {
  await connection();

  const { technology } = await params;
  const technologies = await getTechnologies();

  const isKnownTechnology = technologies.some(
    (entry) => entry.slug === technology,
  );
  if (!isKnownTechnology) {
    notFound();
  }

  const tags = await getTags(technology);

  return (
    <AppLayout
      technology={technology}
      technologies={technologies}
      sidebar={
        <Sidebar
          tags={tags}
          technologies={technologies}
          currentTechnology={technology}
        />
      }
    >
      <Content technology={technology} />
    </AppLayout>
  );
}
