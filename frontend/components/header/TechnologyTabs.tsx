import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Technology } from "@/types/technology";

interface TechnologyTabsProps {
  technologies: Technology[];
  currentTechnology: string;
}

export default function TechnologyTabs({
  technologies,
  currentTechnology,
}: TechnologyTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {technologies.map((technology) => (
        <Button
          key={technology.slug}
          variant={technology.slug === currentTechnology ? "secondary" : "ghost"}
          size="sm"
          render={<Link href={`/${technology.slug}`} />}
        >
          {technology.name}
        </Button>
      ))}
    </div>
  );
}
