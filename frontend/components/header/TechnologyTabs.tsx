"use client";

import { Button } from "@/components/ui/button";

const TECHNOLOGIES = ["React", "JavaScript", "TypeScript", "Next.js"];

export default function TechnologyTabs() {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {TECHNOLOGIES.map((technology, index) => (
        <Button
          key={technology}
          variant={index === 0 ? "secondary" : "ghost"}
          size="sm"
        >
          {technology}
        </Button>
      ))}
    </div>
  );
}
