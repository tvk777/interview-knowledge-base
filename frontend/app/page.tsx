import AppLayout from "@/components/layout/AppLayout";
import Content from "@/components/content/Content";
import Sidebar from "@/components/sidebar/Sidebar";
import { getTags } from "@/services/knowledge-base";

const TECHNOLOGY = "react";

export default async function Home() {
  const tags = await getTags(TECHNOLOGY);

  return (
    <AppLayout sidebar={<Sidebar tags={tags} />}>
      <Content technology={TECHNOLOGY} />
    </AppLayout>
  );
}
