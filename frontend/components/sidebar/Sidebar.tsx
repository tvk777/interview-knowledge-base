"use client";

import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import TechnologyTabs from "@/components/header/TechnologyTabs";
import TagList from "@/components/sidebar/TagList";
import type { Tag } from "@/types/tag";
import type { Technology } from "@/types/technology";

interface SidebarProps {
  tags: Tag[];
  technologies: Technology[];
  currentTechnology: string;
}

export default function Sidebar({
  tags,
  technologies,
  currentTechnology,
}: SidebarProps) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 overflow-y-auto border-r p-4 md:block">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          Tags
        </h2>
        <TagList tags={tags} />
      </aside>

      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-4">
          <TechnologyTabs
            technologies={technologies}
            currentTechnology={currentTechnology}
          />
          <Separator className="my-4" />
          <TagList tags={tags} />
        </div>
      </SheetContent>
    </>
  );
}
