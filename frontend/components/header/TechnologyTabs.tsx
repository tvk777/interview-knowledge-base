import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Technology } from "@/types/technology";

interface TechnologyTabsProps {
  technologies: Technology[];
  currentTechnology: string | null;
}

export default function TechnologyTabs({
  technologies,
  currentTechnology,
}: TechnologyTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {technologies.map((technology) => (
        <Link
          key={technology.slug}
          href={`/${technology.slug}`}
          className={cn(
            buttonVariants({
              variant:
                technology.slug === currentTechnology ? "secondary" : "ghost",
              size: "sm",
            }),
          )}
        >
          {technology.name}
        </Link>
      ))}
    </div>
  );
}
